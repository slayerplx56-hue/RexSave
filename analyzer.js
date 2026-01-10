// AI-like risk analysis
export default async function analyzeURL(url) {
  let score = 100;
  const flags = { safe: true, dangerous: false, scam: false, harmful: false, illegal: false };

  // Basic heuristics
  if (!url.startsWith('https://')) score -= 20;
  if (url.length > 80) score -= 10;
  if (/free|verify|login|bonus|gift/i.test(url)) score -= 25;

  // Ensure score 0–100
  score = Math.max(0, Math.min(100, score));

  // Flags based on score
  if (score < 70) flags.safe = false;
  if (score < 60) flags.dangerous = true;
  if (score < 40) flags.scam = true;
  if (score < 30) flags.harmful = true;
  if (score < 20) flags.illegal = true;

  return { score, flags };
}
