function analyze() {
  const url = document.getElementById("urlInput").value.trim();
  const r = document.getElementById("result");

  if (!url) {
    r.innerHTML = "❌ Please enter a link.";
    return;
  }

  let score = 100;
  let reasons = [];

  const lower = url.toLowerCase();

  // 🚩 Dangerous keywords
  const scamWords = [
    "free-money", "giveaway", "bonus", "crypto", "wallet",
    "verify", "login", "account", "password",
    "urgent", "limited", "claim", "prize"
  ];

  // 🚩 Fake TLDs / risky domains
  const riskyTlds = [".tk", ".ml", ".ga", ".cf", ".gq"];

  // 🚩 IP-based URL
  const ipRegex = /https?:\/\/\d+\.\d+\.\d+\.\d+/;

  // 🚩 Shorteners
  const shorteners = ["bit.ly", "tinyurl", "t.co", "is.gd"];

  // Check keyword risk
  scamWords.forEach(word => {
    if (lower.includes(word)) {
      score -= 7;
      reasons.push(`Contains suspicious keyword: "${word}"`);
    }
  });

  // Check TLD
  riskyTlds.forEach(tld => {
    if (lower.endsWith(tld)) {
      score -= 15;
      reasons.push(`Uses risky domain extension: ${tld}`);
    }
  });

  // Check IP link
  if (ipRegex.test(lower)) {
    score -= 25;
    reasons.push("Uses direct IP address instead of domain");
  }

  // Check shortener
  shorteners.forEach(s => {
    if (lower.includes(s)) {
      score -= 15;
      reasons.push("Uses URL shortener (hides destination)");
    }
  });

  // Check HTTPS
  if (!lower.startsWith("https://")) {
    score -= 10;
    reasons.push("No HTTPS encryption");
  }

  if (score < 0) score = 0;

  // Determine flags
  const isReal = score >= 70;
  const isSafe = score >= 75;
  const isHarmful = score < 60;
  const isScam = score < 50;
  const isIllegal = score < 40;

  // Helper
  function yesNo(condition, yesGreen = true) {
    if (condition) {
      return `<span class="${yesGreen ? "yes" : "warn"}">YES${yesGreen ? "" : " !"}</span>`;
    } else {
      return `<span class="no">NO !</span>`;
    }
  }

  // Output
  r.innerHTML = `
    <h2>Analysis Result</h2>

    <p><strong>Trust Score:</strong> ${score}%</p>

    <p>REAL: ${yesNo(isReal)}</p>
    <p>SAFE: ${yesNo(isSafe)}</p>
    <p>HARMFUL: ${yesNo(isHarmful, false)}</p>
    <p>SCAM: ${yesNo(isScam, false)}</p>
    <p>ILLEGAL: ${yesNo(isIllegal, false)}</p>

    <h3>Detected Issues</h3>
    <ul>
      ${reasons.length ? reasons.map(r => `<li>${r}</li>`).join("") : "<li>No obvious issues detected</li>"}
    </ul>

    <p><em>This analysis is automated and probabilistic, not a guarantee.</em></p>
  `;
}
