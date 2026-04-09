// pages/api/plan.js

async function fetchPexelsPhoto(query, pexelsKey, orientation = "landscape") {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=${orientation}`,
      { headers: { Authorization: pexelsKey } }
    );
    const data = await res.json();
    const photo = data.photos?.[0];
    if (!photo) return null;
    return orientation === "portrait"
      ? photo.src.large2x || photo.src.large
      : photo.src.large2x || photo.src.large;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { request } = req.body;
  if (!request) return res.status(400).json({ error: "No request provided" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const pexelsKey = process.env.PEXELS_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 2200,
        temperature: 0.85,
        messages: [
          {
            role: "system",
            content: `You are Zirvoy, a world-class AI travel planner. Given a plain-English trip request, return a single perfect destination with a full plan.

You MUST respond with ONLY valid JSON — no markdown, no backticks, no explanation. Just the raw JSON object.

FLIGHT RULES:
- Only recommend DIRECT (non-stop) flights from a UK airport
- Only suggest connecting flight if genuinely no direct route exists — say so explicitly
- Always name the specific UK departure airport
- Frame prices as estimates: "typically from £X" or "est. £X-£Ypp return"

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
  "flights": "Direct flight info from UK — airport, airline, duration, estimated price",
  "hotel": "One sentence on best area to stay and why, with rough nightly cost",
  "tip": "One genuinely useful insider tip — specific and actionable, never generic",
  "weather": {
    "bestMonths": "e.g. May & June",
    "peakSeason": "e.g. July–August",
    "avoidMonths": "e.g. November–February (or null if no bad months)",
    "tempRange": "e.g. 24–32°C in summer, 10–15°C in winter",
    "insight": "One sentence on what makes the climate special or what to expect"
  },
  "photoQuery": "2-3 word search for a stunning cityscape or landmark of this destination",
  "storySlides": [
    {
      "type": "destination",
      "headline": "Your next trip.",
      "subline": "City, Country.",
      "imageQuery": "2-3 word search for stunning wide shot of destination city"
    },
    {
      "type": "flight",
      "headline": "Direct from London.",
      "subline": "2 hours 25 minutes.",
      "imageQuery": "airplane window clouds sky"
    },
    {
      "type": "hotel",
      "headline": "Staying in [neighbourhood].",
      "subline": "One evocative sentence about the area.",
      "imageQuery": "2-3 word search for this neighbourhood or city street"
    },
    {
      "type": "activity",
      "headline": "Most spectacular Day 1 activity.",
      "subline": "One vivid sentence about this experience.",
      "imageQuery": "2-3 word search for this exact landmark or activity"
    },
    {
      "type": "activity",
      "headline": "Most spectacular Day 2 activity.",
      "subline": "One vivid sentence about this experience.",
      "imageQuery": "2-3 word search for this exact landmark or activity"
    },
    {
      "type": "activity",
      "headline": "Most spectacular Day 3 activity.",
      "subline": "One vivid sentence about this experience.",
      "imageQuery": "2-3 word search for this exact landmark or activity"
    }
  ],
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
- budgetTotal must equal sum of all breakdown values
- budgetPerPerson must equal budgetTotal divided by travellers
- itinerary length must match duration field exactly
- All budget figures in GBP
- Be specific with restaurant names, attraction names, neighbourhood names
- The tip must be genuinely useful — never generic
- weather.avoidMonths can be null if there are no genuinely bad months
- imageQuery values must be 2-3 words, specific enough to return a beautiful relevant photo
- storySlides must always have exactly 6 slides: destination, flight, hotel, then 3 activities
- Activity slides should be the most visually spectacular things from the itinerary`,
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

    const clean = text.replace(/```json|```/g, "").trim();
    const trip = JSON.parse(clean);

    // Fetch hero photo from Pexels
    if (pexelsKey) {
      const heroPhoto = await fetchPexelsPhoto(trip.photoQuery || trip.destination, pexelsKey, "landscape");
      trip.photo = heroPhoto || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80`;
    } else {
      trip.photo = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80`;
    }

    // Fetch portrait images for each story slide from Pexels
    if (trip.storySlides && pexelsKey) {
      trip.storySlides = await Promise.all(
        trip.storySlides.map(async (slide) => {
          const imageUrl = await fetchPexelsPhoto(slide.imageQuery, pexelsKey, "portrait");
          return {
            ...slide,
            imageUrl: imageUrl || null,
          };
        })
      );
    }

    return res.status(200).json({ trip });
  } catch (err) {
    console.error("Plan error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
