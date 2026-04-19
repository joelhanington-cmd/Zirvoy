async function fetchPexelsPhoto(query) {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      { headers: { Authorization: process.env.PEXELS_API_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.photos?.length) return null;
    // Pick darkest photo
    const scored = data.photos.map(p => {
      const hex = p.avg_color || "#888888";
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      const brightness = (r*299 + g*587 + b*114) / 1000;
      return { url: p.src.large2x || p.src.large, brightness };
    });
    scored.sort((a,b) => a.brightness - b.brightness);
    return scored[0].url;
  } catch { return null; }
}

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

These must be real hotels that actually exist in ${destination}. Be specific.

Respond ONLY with valid JSON — no markdown:
{
  "hotels": [
    {
      "name": "Exact hotel name",
      "area": "Neighbourhood or area",
      "style": "e.g. Boutique · 4-star",
      "why": "One sentence on why this matches their criteria",
      "highlight": "The single best thing about this hotel",
      "pricePerNight": 120,
      "bookingSearch": "exact hotel name for Booking.com search",
      "photoQuery": "hotel name + destination city (2-4 words for photo search)"
    }
  ]
}`;

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a luxury travel concierge. Always recommend real, specific hotels that exist. Be precise and opinionated." },
          { role: "user", content: prompt },
        ],
        max_tokens: 700,
        temperature: 0.7,
      }),
    });

    const data = await aiResponse.json();
    const raw = data.choices?.[0]?.message?.content || "{}";
    const clean = raw.replace(/```json|```/g, "").trim();
    let result;
    try {
      result = JSON.parse(clean);
      if (!result.hotels || !Array.isArray(result.hotels)) throw new Error("No hotels array");
    } catch (parseErr) {
      console.error("Hotels JSON parse error:", parseErr.message);
      return res.status(500).json({ error: "Could not load hotel recommendations" });
    }

    // Fetch a photo for each hotel from Pexels
    if (result.hotels && process.env.PEXELS_API_KEY) {
      result.hotels = await Promise.all(
        result.hotels.map(async (h) => {
          const photo = await fetchPexelsPhoto(h.photoQuery || `${h.name} ${destination} hotel`);
          return { ...h, photo: photo || null };
        })
      );
    }

    res.json(result);
  } catch (e) {
    console.error("Hotels error:", e);
    res.status(500).json({ error: "Could not load hotel recommendations" });
  }
}
