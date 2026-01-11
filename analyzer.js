/* =========================================================
   RexSave Analyzer
   Human‑style website risk analysis (best‑effort logic)
   ========================================================= */

function analyzeURL(url) {
    const result = {
        score: 88,              // realistic expert baseline
        real: true,
        safe: true,
        harmful: false,
        scam: false,
        illegal: false,
        reasons: [],
        warnings: ""
    };

    /* -----------------------------
       BASIC VALIDATION
    ----------------------------- */
    if (!url || typeof url !== "string") {
        result.real = false;
        result.safe = false;
        result.score = 0;
        result.warnings = "Invalid or empty URL provided.";
        return result;
    }

    const u = url.toLowerCase().trim();

    /* -----------------------------
       REALITY CHECK
    ----------------------------- */
    if (!u.startsWith("http://") && !u.startsWith("https://")) {
        result.real = false;
        result.score -= 25;
        result.reasons.push("Website does not use HTTP or HTTPS.");
    }

    if (u.length < 10) {
        result.real = false;
        result.score -= 15;
        result.reasons.push("URL is unusually short.");
    }

    /* -----------------------------
       TRUSTED DOMAINS BOOST
    ----------------------------- */
    const trustedDomains = [
        "google.com",
        "wikipedia.org",
        "github.com",
        "microsoft.com",
        "apple.com",
        "amazon.com",
        "openai.com",
        "mozilla.org"
    ];

    if (trustedDomains.some(d => u.includes(d))) {
        result.score = 95;
        result.safe = true;
        result.reasons.push("Recognized trusted and well‑known domain.");
    }

    /* -----------------------------
       SCAM INDICATORS
    ----------------------------- */
    const scamIndicators = [
        "free-money",
        "earn-fast",
        "giveaway",
        "bonus",
        "verify-account",
        "login-now",
        "urgent",
        "click-now"
    ];

    scamIndicators.forEach(word => {
        if (u.includes(word)) {
            result.scam = true;
            result.score -= 15;
            result.reasons.push(`Scam indicator detected: "${word}"`);
        }
    });

    /* -----------------------------
       HARMFUL INDICATORS
    ----------------------------- */
    const harmfulIndicators = [
        ".xyz",
        ".ru",
        "hack",
        "payload",
        "virus",
        "malware",
        "exploit"
    ];

    harmfulIndicators.forEach(word => {
        if (u.includes(word)) {
            result.harmful = true;
            result.score -= 20;
            result.reasons.push(`Potentially harmful indicator: "${word}"`);
        }
    });

    /* -----------------------------
       ILLEGAL INDICATORS
    ----------------------------- */
    const illegalIndicators = [
        "crack",
        "pirate",
        "torrent",
        "warez",
        "illegal"
    ];

    illegalIndicators.forEach(word => {
        if (u.includes(word)) {
            result.illegal = true;
            result.score -= 35;
            result.reasons.push(`Illegal content indicator: "${word}"`);
        }
    });

    /* -----------------------------
       FINAL SCORE NORMALIZATION
    ----------------------------- */
    if (result.score < 0) result.score = 0;
    if (result.score > 100) result.score = 100;

    result.safe = result.score >= 70;

    /* -----------------------------
       HUMAN‑STYLE FINAL VERDICT
    ----------------------------- */
    if (result.score >= 90) {
        result.warnings =
            "Website appears SAFE. No significant security or trust risks detected.";
    } else if (result.score >= 70) {
        result.warnings =
            "Website seems mostly safe, but some caution is advised.";
    } else if (result.score >= 50) {
        result.warnings =
            "Moderate risk detected. Avoid entering personal or sensitive information.";
    } else if (result.score >= 30) {
        result.warnings =
            "High risk detected. This website may be harmful or deceptive.";
    } else {
        result.warnings =
            "DANGEROUS WEBSITE! Do NOT enter or interact with this site.";
    }

    return result;
}

/* =========================================================
   DISPLAY LOGIC (YES / NO + !)
   ========================================================= */
function getDisplayResults(a) {
    return {
        real: a.real
            ? "<span class='yes'>YES</span>"
            : "<span class='alert'>NO !</span>",

        safe: a.safe
            ? "<span class='yes'>YES</span>"
            : "<span class='alert'>NO !</span>",

        harmful: a.harmful
            ? "<span class='alert'>YES !</span>"
            : "<span class='yes'>NO</span>",

        scam: a.scam
            ? "<span class='alert'>YES !</span>"
            : "<span class='yes'>NO</span>",

        illegal: a.illegal
            ? "<span class='alert'>YES !</span>"
            : "<span class='yes'>NO</span>"
    };
}
