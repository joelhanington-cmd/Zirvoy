export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { activity, destination } = req.body;
  if (!activity || !destination) return res.status(400).json({ error: "Missing fields" });
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return res.json({ imageUrl: null });

  const query = `${activity} ${destination}`;
  try {
    const r = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    const data = await r.json();
    if (!data.photos?.length) return res.json({ imageUrl: null });
    const photo = data.photos[0];
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.json({ imageUrl: photo.src.large2x || photo.src.large });
  } catch {
    res.json({ imageUrl: null });
  }
}
