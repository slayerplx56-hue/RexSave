const nodemailer = require('nodemailer');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: process.env.ALERT_EMAIL,
pass: process.env.ALERT_PASS
}
});


function hashIP(ip) {
return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 12);
}


async function sendAlert(req, type, severity) {
await transporter.sendMail({
from: 'RexSave <noreply@rexsave.com>',
to: process.env.ADMIN_EMAIL,
subject: '🚨 RexSave Security Alert',
text: `Type: ${type}
Severity: ${severity}
Time: ${new Date().toISOString()}
IP Hash: ${hashIP(req.ip || 'unknown')}
Device: ${req.headers['user-agent'] || 'unknown'}
Action: Blocked (5 weeks)`
});
}


module.exports = sendAlert;
