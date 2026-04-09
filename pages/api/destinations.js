const DESTINATIONS = [
  { name: "Santorini", query: "Santorini Greece sunset dramatic" },
  { name: "Bali", query: "Bali Indonesia jungle temple dark" },
  { name: "Maldives", query: "Maldives ocean sunset moody" },
  { name: "Amalfi Coast", query: "Amalfi Coast Italy evening cliffs" },
  { name: "Tokyo", query: "Tokyo Japan neon night street" },
];

async function fetchPhoto(query) {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: process.env.PEXELS_API_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.photos?.length) return null;
    // Prefer photos with darker avg_color (lower brightness)
    const scored = data.photos.map(p => {
      const hex = p.avg_color || "#888888";
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return { url: p.src.large2x || p.src.large, brightness };
    });
    // Pick darkest photo (lowest brightness)
    scored.sort((a,b) => a.brightness - b.brightness);
    return scored[0].url;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
  const photos = await Promise.all(
    DESTINATIONS.map(async ({ name, query }) => {
      const url = await fetchPhoto(query);
      return url ? { destination: name, url } : null;
    })
  );
  res.json({ photos: photos.filter(Boolean) });
}
