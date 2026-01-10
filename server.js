require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { protect, isBlocked } = require('./security');
const analyzeURL = require('./analyzer');


const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Global rate‑limit
app.use(rateLimit({ windowMs: 60 * 1000, max: 30 }));


// Blocked IP check
app.use((req, res, next) => {
if (isBlocked(req.ip)) {
return res.status(403).json({ error: 'Access blocked for security reasons.' });
}
next();
});


// URL check endpoint
app.post('/check', protect, async (req, res) => {
const { url } = req.body;
if (!url || !/^https?:\/\//i.test(url)) {
return res.status(400).json({ error: 'Invalid URL.' });
}
res.json(await analyzeURL(url));
});


// Error hiding
app.use(() => res.status(500).json({ error: 'Internal error' }));


app.listen(process.env.PORT || 3000, () => console.log('RexSave online'));
