module.exports = async function analyzeURL(url) {
let score = 100;
const flags = { safe: true, dangerous: false, scam: false, harmful: false, illegal: false };


if (!url.startsWith('https://')) score -= 20;
if (url.length > 80) score -= 10;
if (/free|verify|login|bonus/i.test(url)) score -= 25;


score = Math.max(0, Math.min(100, score));


if (score < 70) flags.safe = false;
if (score < 60) flags.dangerous = true;
if (score < 40) flags.scam = true;
if (score < 30) flags.harmful = true;
if (score < 20) flags.illegal = true;


return { score, flags };
};
