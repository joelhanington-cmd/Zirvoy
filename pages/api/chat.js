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

Answer questions specifically about ${trip.destination}. Be concise, practical, specific. Always recommend real places by name. Never give generic travel advice.`;

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
        max_tokens: 350,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error("No reply");
    res.json({ reply });
  } catch (e) {
    console.error("Chat error:", e);
    res.status(500).json({ error: "Could not get a response right now" });
  }
}
