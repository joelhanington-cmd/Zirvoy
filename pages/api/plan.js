// pages/api/plan.js
// This runs on the server — your API key stays completely hidden from users

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { request } = req.body;
  if (!request) return res.status(400).json({ error: "No request provided" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1800,
        temperature: 0.85,
        messages: [
          {
            role: "system",
            content: `You are Zirvoy, a world-class AI travel planner. Given a plain-English trip request, you return a single perfect destination with a full plan.

You MUST respond with ONLY valid JSON — no markdown, no backticks, no explanation. Just the raw JSON object.

The JSON must follow this exact structure:
{
  "destination": "City name",
  "country": "Country name",
  "tagline": "One evocative sentence about this destination (max 12 words)",
  "duration": 4,
  "travellers": 2,
  "budgetTotal": 1200,
  "budgetPerPerson": 600,
  "breakdown": {
    "flights": 400,
    "hotel": 500,
    "food": 180,
    "activities": 120
  },
  "flights": "One sentence about typical flights from UK — airline, duration, rough price",
  "hotel": "One sentence recommending the best area to stay and why, with rough nightly cost",
  "tip": "One genuinely useful insider tip a local would give — specific and actionable, not generic",
  "photoQuery": "A specific Unsplash search query to find a great photo of this destination (3-5 words)",
  "itinerary": [
    {
      "day": 1,
      "title": "Short evocative day title",
      "morning": "What to do in the morning — specific, vivid, practical",
      "afternoon": "What to do in the afternoon",
      "evening": "What to do in the evening"
    }
  ]
}

Rules:
- budgetTotal must equal the sum of all breakdown values
- budgetPerPerson must equal budgetTotal divided by travellers
- itinerary length must match the duration field exactly
- All budget figures in GBP (£)
- Be specific with restaurant names, attraction names, neighbourhood names
- The tip must be genuinely useful — not "book in advance" or "arrive early"
- photoQuery should be specific enough to return a beautiful travel photo`,
          },
          {
            role: "user",
            content: request,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return res.status(500).json({ error: "AI service error" });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) return res.status(500).json({ error: "Empty response from AI" });

    // Strip any accidental markdown code fences
    const clean = text.replace(/```json|```/g, "").trim();
    const trip = JSON.parse(clean);

    // Fetch a real photo from Unsplash (no API key needed for source.unsplash.com)
    trip.photo = `https://source.unsplash.com/900x600/?${encodeURIComponent(trip.photoQuery || trip.destination + " travel")}`;

    return res.status(200).json({ trip });
  } catch (err) {
    console.error("Plan error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
