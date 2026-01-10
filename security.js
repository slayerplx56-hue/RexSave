const sendAlert = require('./alerts');
const blocked = new Map();
const abuse = new Map();


function blockIP(ip, weeks = 5) {
blocked.set(ip, Date.now() + weeks * 7 * 24 * 60 * 60 * 1000);
}


function isBlocked(ip) {
const until = blocked.get(ip);
if (!until) return false;
if (Date.now() > until) { blocked.delete(ip); return false; }
return true;
}


function protect(req, res, next) {
const ip = req.ip || 'unknown';
const ua = (req.headers['user-agent'] || '').toLowerCase();
let score = abuse.get(ip) || 0;


if (ua.includes('bot') || ua.includes('headless')) score++;
if (!req.headers['content-type']) score++;


abuse.set(ip, score);


if (score >= 3) {
blockIP(ip);
sendAlert(req, 'Bot / Attack detected', 'MEDIUM');
return res.status(403).json({ error: 'Blocked by RexSave security.' });
}


next();
}


module.exports = { protect, isBlocked };
