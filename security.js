import sendAlert from './alerts.js';

const blocked = new Map();
const abuse = new Map();

// Block IP for 5 weeks
export function blockIP(ip, weeks = 5) {
  blocked.set(ip, Date.now() + weeks * 7 * 24 * 60 * 60 * 1000);
}

// Check if IP is blocked
export function isBlocked(ip) {
  const until = blocked.get(ip);
  if (!until) return false;
  if (Date.now() > until) {
    blocked.delete(ip);
    return false;
  }
  return true;
}

// Protect function for serverless
export async function protect(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  let score = abuse.get(ip) || 0;

  if (ua.includes('bot') || ua.includes('headless')) score++;
  if (!req.headers['content-type']) score++;

  abuse.set(ip, score);

  if (score >= 3) {
    blockIP(ip);
    await sendAlert(req, 'Bot / Automated Attack', 'MEDIUM');
    return res.status(403).json({ error: 'Blocked by RexSave security.' });
  }

  if (typeof next === 'function') next();
}
