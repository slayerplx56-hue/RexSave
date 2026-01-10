import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create transporter (Gmail App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_PASS
  }
});

// Hash IP for privacy
function hashIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 12);
}

// Send alert email
export default async function sendAlert(req, type, severity) {
  const text = `
RexSave Security Alert

Type: ${type}
Severity: ${severity}
Time: ${new Date().toISOString()}
IP Hash: ${hashIP(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')}
Device: ${req.headers['user-agent'] || 'unknown'}
Endpoint: ${req.url}
Action: Automatically blocked (5 weeks)
`;

  await transporter.sendMail({
    from: 'RexSave <noreply@rexsave.com>',
    to: process.env.ADMIN_EMAIL,
    subject: '🚨 RexSave Attack Blocked',
    text
  });
}
