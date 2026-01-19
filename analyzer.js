function analyze(url) {
  let score = 100;
  let reasons = [];

  const lower = url.toLowerCase();

  // ❌ No HTTPS
  if (!url.startsWith("https://")) {
    score -= 15;
    reasons.push("Website does not use HTTPS encryption.");
  }

  // ❌ IP address instead of domain
  if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
    score -= 25;
    reasons.push("Uses IP address instead of a domain.");
  }

  // ❌ Suspicious keywords
  const scamWords = [
    "free", "bonus", "verify", "login", "update",
    "wallet", "crypto", "airdrop", "reward",
    "password", "bank", "secure", "confirm"
  ];
  scamWords.forEach(word => {
    if (lower.includes(word)) {
      score -= 6;
      reasons.push(`Suspicious keyword detected: "${word}"`);
    }
  });

  // ❌ Illegal keywords
  const illegalWords = ["hack", "crack", "pirate", "cheat", "ddos"];
  let illegal = false;
  illegalWords.forEach(word => {
    if (lower.includes(word)) {
      score -= 30;
      illegal = true;
      reasons.push(`Illegal activity indicator: "${word}"`);
    }
  });

  // ❌ Risky TLDs
  const riskyTLDs = [".tk", ".ml", ".ga", ".cf", ".ru", ".xyz"];
  riskyTLDs.forEach(tld => {
    if (lower.endsWith(tld)) {
      score -= 20;
      reasons.push(`High-risk domain extension detected: ${tld}`);
    }
  });

  // ❌ Very long URLs (phishing indicator)
  if (url.length > 120) {
    score -= 10;
    reasons.push("Unusually long URL length.");
  }

  // ❌ Too many subdomains
  const parts = url.replace("https://", "").split("/");
  if (parts[0].split(".").length > 4) {
    score -= 15;
    reasons.push("Excessive subdomains detected.");
  }

  // Clamp score
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  // Classifications
  const isSafe = score >= 85;
  const isScam = score < 60;
  const isHarmful = score < 50;
  const isIllegal = illegal;
  const isReal = !isScam && !illegal;

  // OUTPUT
  document.getElementById("result").innerHTML = `
    REAL: <b style="color:${isReal ? 'lime' : 'red'}">${isReal ? 'YES' : 'NO ❗'}</b><br>
    SAFE: <b style="color:${isSafe ? 'lime' : 'red'}">${isSafe ? 'YES' : 'NO ❗'}</b><br>
    HARMFUL: <b style="color:${isHarmful ? 'red' : 'lime'}">${isHarmful ? 'YES ❗' : 'NO'}</b><br>
    SCAM: <b style="color:${isScam ? 'red' : 'lime'}">${isScam ? 'YES ❗' : 'NO'}</b><br>
    ILLEGAL: <b style="color:${isIllegal ? 'red' : 'lime'}">${isIllegal ? 'YES ❗' : 'NO'}</b>
  `;

  // Risk Circle
  const circle = document.getElementById("riskCircle");
  circle.style.display = "flex";
  circle.innerText = score + "%";

  if (score === 100) circle.style.borderColor = "#064e3b";
  else if (score >= 90) circle.style.borderColor = "#00ff00";
  else if (score >= 70) circle.style.borderColor = "#00bfff";
  else if (score >= 50) circle.style.borderColor = "#ffff00";
  else if (score >= 30) circle.style.borderColor = "#ff8000";
  else circle.style.borderColor = "#ff0000";

  // Warning text
  const warn = document.getElementById("warningText");
  if (score >= 90) warn.innerText = "✅ This website appears safe to enter.";
  else if (score >= 70) warn.innerText = "⚠️ Mostly safe, proceed with caution.";
  else if (score >= 50) warn.innerText = "⚠️ Medium risk detected. Be careful.";
  else if (score >= 30) warn.innerText = "❌ High risk website. Avoid entering.";
  else warn.innerText = "❌ Dangerous website detected. DO NOT ENTER.";

  console.log("Analysis reasons:", reasons);
}
