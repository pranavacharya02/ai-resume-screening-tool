import express from 'express';
import multer from 'multer';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Ensure uploads dir exists at repo root: ../uploads
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // sanitize filename
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, ts + '_' + safe);
  }
});
const upload = multer({ storage });

app.post('/api/analyze', upload.array('resumes'), async (req, res) => {
  try {
    const jobDesc = req.body.jobDesc || '';
    const files = (req.files || []).map(f => f.path);

    if (!jobDesc || files.length === 0) {
      return res.status(400).json({ error: 'jobDesc and at least one resume PDF are required.' });
    }

    // Call AI service (expects file paths relative to repo; both share the uploads folder)
    const payload = { jobDesc, files };

    const resp = await axios.post('http://127.0.0.1:5000/analyze', payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000
    });

    res.json(resp.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to analyze resumes. Is the AI service running on port 5000?' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});