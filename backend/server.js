import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'data', 'db.json');
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ certificates: [] }, null, 2));
}

function readDB() { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); }
function writeDB(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }

app.get('/health', (_req, res)=> res.json({ ok:true, phase:'III mock API' }));

app.get('/certificates', (_req, res)=> {
  res.json(readDB().certificates);
});

app.get('/certificates/:id', (req, res)=> {
  const db = readDB();
  const c = db.certificates.find(x => x.id === req.params.id);
  if(!c) return res.status(404).json({ error:'not found' });
  res.json(c);
});

app.post('/certificates', (req, res)=> {
  const { id, holder, program, issueDate, hash } = req.body || {};
  if(!id) return res.status(400).json({ error:'id required' });
  const db = readDB();
  if(db.certificates.some(x=>x.id===id)) return res.status(409).json({ error:'id exists' });
  const cert = { id, holder, program, issueDate, hash, status:'Valid' };
  db.certificates.push(cert);
  writeDB(db);
  res.status(201).json(cert);
});

app.post('/verify', (req, res)=> {
  const { id, hash } = req.body || {};
  const db = readDB();
  let c = null;
  if (id) c = db.certificates.find(x=>x.id===id);
  if (!c && hash) c = db.certificates.find(x=>x.hash===hash);
  if (!c) return res.json({ exists:false, valid:false, revoked:false });
  const revoked = c.status === 'Revoked';
  res.json({ exists:true, valid: !revoked, revoked, cert: c });
});

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('API listening on http://localhost:'+port));
