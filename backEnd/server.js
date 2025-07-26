const express = require('express');
const qr = require('qrcode');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Serve static files from frontEnd folder
app.use(express.static(path.join(__dirname, '../frontEnd')));

// QR history storage
let qrHistory = [];

// Home route (optional if using static index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontEnd/index.html'));
});

// Generate QR code
app.post('/generate', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const qrDataUrl = await qr.toDataURL(text);
    qrHistory.push({ text, qrDataUrl, timestamp: new Date() });
    res.json({ qrCode: qrDataUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR Code' });
  }
});

// Return QR code history (optional feature)
app.get('/history', (req, res) => {
  res.json(qrHistory);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});
