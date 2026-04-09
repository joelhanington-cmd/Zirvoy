export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { destination, country, type } = req.body;

  const prompts = {
    cheapest: `When are the cheapest months to visit ${destination}, ${country}? Give a 2-3 sentence practical tip. Mention the specific months, why they're cheap, and any downsides. Then suggest the single best month for a budget trip.`,
    warmest: `When is the warmest and best weather in ${destination}, ${country}? Give a 2-3 sentence practical tip. Mention specific months, typical temperatures, and whether it's beach-worthy. Then suggest the single best month for warm weather.`,
    busiest: `When is peak tourist season in ${destination}, ${country}, and when should you avoid it if you hate crowds? Give a 2-3 sentence tip covering busy vs quiet periods. Then suggest the best month to balance good weather and fewer crowds.`,
    flexible: `What is the single best month or two-month window to visit ${destination}, ${country}, balancing weather, price, and crowds? Give a 2-3 sentence recommendation explaining why. Be specific and opinionated.`,
  };

  const prompt = prompts[type] || prompts.flexible;

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
          {
            role: "system",
            content: `You are a knowledgeable travel expert. Always respond with a JSON object with two fields:
- "insight": a 2-3 sentence tip (conversational, specific, no fluff)
- "bestMonths": a short string like "May & June" or "October" — the single best window to visit

Respond ONLY with valid JSON, no markdown.`,
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "{}";
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "Could not load travel tips" });
  }
}
