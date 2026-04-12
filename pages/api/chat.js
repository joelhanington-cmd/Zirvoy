export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { message, trip, history = [] } = req.body;
  if (!message || !trip) return res.status(400).json({ error: "Missing fields" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const systemPrompt = `You are Zirvoy, an expert travel assistant. The user has planned a trip to ${trip.destination}, ${trip.country}.

Trip context:
- ${trip.duration} nights · ${trip.travellers} travellers · £${trip.budgetTotal} total
- Flights: ${trip.flights}
- Staying: ${trip.hotel}
- Insider tip: ${trip.tip}

Answer questions specifically about ${trip.destination}. Be concise, practical, specific. Always recommend real places by name. Never give generic travel advice.

You MUST respond with ONLY valid JSON — no markdown, no backticks. Format:
{
  "reply": "Your answer here",
  "action": null | "itinerary" | "car_hire" | "activities" | "restaurants" | "flights"
}

action rules:
- "itinerary" — only if the user is asking to CHANGE or ADD something to their itinerary (e.g. "add a cooking class", "swap day 2")
- "car_hire" — if the question is about renting a car, driving, needing a car, getting around by car
- "activities" — if the question is about things to do, tours, experiences, day trips, hidden gems
- "restaurants" — if the question is about food, restaurants, where to eat, best cafes
- "flights" — if the question is about flights, getting there, airport transfers FROM the origin
- null — for all other questions (safety, weather, packing, cash, transport within destination, general info)`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-8),
          { role: "user", content: message },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) throw new Error("No reply");

    // Parse the JSON response
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json({ reply: parsed.reply, action: parsed.action || null });
  } catch (e) {
    console.error("Chat error:", e);
    // Fallback: return raw text with no action if JSON parse fails
    res.status(500).json({ error: "Could not get a response right now" });
  }
}
