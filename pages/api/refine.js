export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { trip, instructions } = req.body;
  if (!trip || !instructions) return res.status(400).json({ error: "Missing trip or instructions" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const prompt = `Here is a ${trip.duration}-day itinerary for ${trip.destination}, ${trip.country}:

${JSON.stringify(trip.itinerary, null, 2)}

The traveller wants to change it: "${instructions}"

Return ONLY the updated itinerary as a valid JSON array with the same structure. Each item must have: day (number), title (string), morning (string), afternoon (string), evening (string). Be specific with place names, restaurants, and activity names. No markdown, no explanation — just the raw JSON array.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a world-class travel planner. Modify itineraries exactly as requested. Keep unchanged days identical. Return ONLY a valid JSON array — no markdown, no explanation.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    let itinerary;
    try {
      itinerary = JSON.parse(clean);
      if (!Array.isArray(itinerary)) throw new Error("Not an array");
    } catch (parseErr) {
      console.error("Refine JSON parse error:", parseErr.message);
      return res.status(500).json({ error: "Could not parse updated itinerary" });
    }
    res.json({ itinerary });
  } catch (e) {
    console.error("Refine error:", e);
    res.status(500).json({ error: "Could not refine itinerary" });
  }
}
