export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { destination, country } = req.body;
  if (!destination) return res.status(400).json({ error: "Missing destination" });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "No API key" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: `Give me one specific, genuinely useful insider tip for ${destination}${country ? ", " + country : ""}. Something a local would know — not generic tourist advice. One conversational sentence or two. No intro like "here's a tip:", just the tip itself.`,
        }],
        max_tokens: 120,
        temperature: 0.95,
      }),
    });
    const data = await response.json();
    const tip = data.choices?.[0]?.message?.content?.trim();
    if (!tip) throw new Error("No tip");
    res.json({ tip });
  } catch (e) {
    res.status(500).json({ error: "Could not generate tip" });
  }
}
