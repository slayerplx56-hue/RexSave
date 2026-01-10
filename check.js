import analyzeURL from '../analyzer.js';
import { protect, isBlocked } from '../security.js';
import sendAlert from '../alerts.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (isBlocked(ip)) return res.status(403).json({ error: 'Access blocked.' });

  // Run protection checks
  await protect(req, res, async () => {
    const { url } = req.body;
    if (!url || !/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'Invalid URL.' });

    // 10-second proofing simulation
    await new Promise(r => setTimeout(r, 10000));

    // Analyze URL
    const result = await analyzeURL(url);

    // If dangerous, send alert
    if (result.flags.dangerous || result.flags.scam || result.flags.harmful || result.flags.illegal) {
      await sendAlert(req, 'Suspicious URL Accessed', 'HIGH');
    }

    res.status(200).json(result);
  });
}
