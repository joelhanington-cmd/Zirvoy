const DESTINATIONS = [
  { name: "Santorini", query: "Santorini Greece sunset" },
  { name: "Bali", query: "Bali Indonesia rice terraces" },
  { name: "Maldives", query: "Maldives overwater bungalow" },
  { name: "Amalfi Coast", query: "Amalfi Coast Italy" },
  { name: "Tokyo", query: "Tokyo Japan cityscape night" },
];

async function fetchPhoto(query) {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: process.env.PEXELS_API_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.photos?.[0]?.src?.large2x || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  const photos = await Promise.all(
    DESTINATIONS.map(async ({ name, query }) => {
      const url = await fetchPhoto(query);
      return url ? { destination: name, url } : null;
    })
  );
  res.json({ photos: photos.filter(Boolean) });
}
