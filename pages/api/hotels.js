export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { destination, country, checkin, checkout, travellers, roomType, hotelStyle, priority, extras } = req.body;

  const nights = checkin && checkout
    ? Math.round((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24))
    : 5;

  const prompt = `Recommend exactly 3 real, specific hotels in ${destination}, ${country} for a ${nights}-night stay (${checkin} to ${checkout}) for ${travellers} traveller(s).

Preferences:
- Room type: ${roomType}
- Hotel style: ${hotelStyle}
- Top priority: ${priority}
${extras ? `- Extra requirements: ${extras}` : ""}

For each hotel, give a real hotel name that actually exists in ${destination}. Be specific — name actual hotels, not generic descriptions.

Respond ONLY with valid JSON — no markdown. Format:
{
  "hotels": [
    {
      "name": "Exact hotel name",
      "area": "Neighbourhood or area",
      "style": "e.g. Boutique · 4-star",
      "why": "One sentence on why this hotel matches their criteria specifically",
      "highlight": "The single best thing about this hotel",
      "pricePerNight": 120,
      "bookingSearch": "exact hotel name for Booking.com search"
    }
  ]
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a luxury travel concierge with deep knowledge of hotels worldwide. Always recommend real, specific hotels that actually exist. Be precise and opinionated." },
          { role: "user", content: prompt },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "{}";
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    res.json(result);
  } catch (e) {
    console.error("Hotels error:", e);
    res.status(500).json({ error: "Could not load hotel recommendations" });
  }
}
