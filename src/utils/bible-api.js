const CACHE = new Map();
export async function fetchPassage(reference) {
  const key = reference.toLowerCase().trim();
  if (CACHE.has(key)) return CACHE.get(key);
  const res = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  const result = { reference: data.reference, text: data.text, verses: data.verses || [] };
  CACHE.set(key, result);
  return result;
}
