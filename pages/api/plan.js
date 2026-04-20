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
        max_tokens: 2400,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `You are Zirvoy, a world-class AI travel planner. Given a plain-English trip request, return a single perfect destination with a full plan.

You MUST respond with ONLY valid JSON — no markdown, no backticks, no explanation. Just the raw JSON object.

ACCURACY IS YOUR TOP PRIORITY. Do not hallucinate flights, airlines, or travel times. If you are not certain a route exists, do not invent it.

═══ FLIGHT RULES — READ CAREFULLY ═══

1. DIRECT FLIGHTS ONLY unless genuinely none exist. A direct/non-stop flight means no stop, no plane change.

2. ONLY cite a direct route if you are highly confident it operates as a year-round scheduled service from a UK airport. Do NOT cite seasonal ski charter flights (e.g. Innsbruck, Chambéry, Grenoble, Salzburg winter-only) as if they are regular year-round routes.

3. FLIGHT TIMES must be realistic and accurate:
   - London to short-haul Europe (Spain, France, Italy, Greece): 2h–3h30
   - London to medium-haul (Turkey, Egypt, Canaries): 3h30–5h
   - London to long-haul (Southeast Asia, USA, Caribbean): 10h–14h
   - Innsbruck from UK: NO year-round direct scheduled service — only seasonal charters
   - Never say "1h40" for Innsbruck or Alpine ski resorts — this is wrong
   - Always double-check your stated duration makes geographical sense

4. NAME THE ACTUAL AIRLINE that operates the route (e.g. easyJet, Ryanair, British Airways, Jet2, TUI, Wizz Air, Turkish Airlines). Do not invent codeshares or routes.

5. NAME THE SPECIFIC UK DEPARTURE AIRPORT (e.g. London Gatwick, London Heathrow, Manchester, Bristol, Edinburgh).

6. If only connecting flights exist, say so honestly: "No direct UK service — typically via [hub] with [airline], total journey around Xh."

7. Price estimates: use "typically from £X return" or "est. £X–£Y pp return".

═══ DESTINATION RULES ═══

- Only suggest destinations with reliable, well-established UK flight connections
- Never suggest a destination where the only access from UK is a 3+ leg journey unless explicitly requested
- Budget figures must be realistic for the destination and trip length — do not underestimate
- All itinerary restaurants, cafés and bars must be REAL, named establishments that genuinely exist at that destination

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
      "morning": "Specific activity with named attraction. Breakfast at [REAL CAFÉ NAME] — mention what to order.",
      "afternoon": "Afternoon activity at named location. Lunch at [REAL RESTAURANT NAME] — one specific dish to try.",
      "evening": "Evening experience. Dinner at [REAL RESTAURANT NAME] — why it's worth it and what to book. Mention a specific bar or area for after."
    }
  ]
}

RULES:
- budgetTotal must equal the exact sum of all breakdown values — check your arithmetic
- budgetPerPerson must equal budgetTotal divided by travellers — check your arithmetic
- itinerary length must match duration field exactly — count the days
- All budget figures in GBP, realistic for destination and trip length
- CRITICAL: Every morning/afternoon/evening entry MUST name at least one specific real restaurant, café or bar with its actual name — never say "find a local restaurant", "grab lunch somewhere", or "explore local eateries"
- Name specific streets, squares, landmarks and neighbourhoods — never say "explore the old town" without naming it
- The insider tip must be a genuinely local secret — not tourist board copy, not generic advice
- weather.avoidMonths can be null if there are no genuinely bad months
- imageQuery values: 2-3 words, specific and visual
- storySlides: exactly 6 slides — destination, flight, hotel, then 3 activities
- Activity slides: the most visually spectacular things from the itinerary
- The "flights" field text must match your actual flight knowledge — if you said direct 2h25 from Gatwick, that must be a real route
- BEFORE FINALISING: mentally verify the flight duration you've stated is geographically plausible`,
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
    let trip;
    try {
      trip = JSON.parse(clean);
    } catch (parseErr) {
      console.error("Plan JSON parse error:", parseErr.message, "| Raw:", clean.slice(0, 300));
      return res.status(500).json({ error: "AI returned an unexpected response. Please try again." });
    }

    if (!trip.destination || !Array.isArray(trip.itinerary) || trip.itinerary.length === 0) {
      return res.status(500).json({ error: "AI returned an incomplete trip plan. Please try again." });
    }

    // Silently fix budget math if AI got it wrong
    const breakdownSum = Object.values(trip.breakdown || {}).reduce((a, b) => a + Number(b), 0);
    if (breakdownSum > 0 && Math.abs(breakdownSum - trip.budgetTotal) > 50) {
      trip.budgetTotal = breakdownSum;
      trip.budgetPerPerson = Math.round(breakdownSum / (trip.travellers || 1));
    }

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
