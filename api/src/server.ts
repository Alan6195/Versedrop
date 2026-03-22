import express from 'express';
import cors from 'cors';
import {
  getNearbyDrops, createDrop, pickupDrop, getDrop,
  addReaction, getMyPickups, getUserStats, seedDrops,
  addNote, getNotes,
} from './db/store';
import { searchVerses } from './db/verses';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /drops/nearby
app.get('/drops/nearby', (req, res) => {
  const userToken = req.headers['x-user-token'] as string;
  if (!userToken) return res.status(401).json({ error: 'x-user-token required' });

  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const radius = parseInt(req.query.radius_meters as string) || 500;

  if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ error: 'Invalid lat/lng' });

  // Auto-seed demo drops on first nearby query
  seedDrops(lat, lng);

  const drops = getNearbyDrops(lat, lng, radius, userToken);
  res.json({ drops });
});

// POST /drops
app.post('/drops', (req, res) => {
  const userToken = req.headers['x-user-token'] as string;
  if (!userToken) return res.status(401).json({ error: 'x-user-token required' });

  const { verse_reference, verse_text, custom_message, latitude, longitude } = req.body;
  if (!verse_reference || !verse_text || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const drop = createDrop({
    user_token: userToken,
    verse_reference,
    verse_text,
    custom_message,
    latitude,
    longitude,
  });

  res.status(201).json({ drop: { ...drop, is_picked_up: false, reactions: { amen: 0, heart: 0, pray: 0, user_reaction: null } }, status: 'live' });
});

// GET /drops/my-pickups
app.get('/drops/my-pickups', (req, res) => {
  const userToken = req.headers['x-user-token'] as string;
  if (!userToken) return res.status(401).json({ error: 'x-user-token required' });
  res.json(getMyPickups(userToken));
});

// POST /drops/:id/pickup
app.post('/drops/:id/pickup', (req, res) => {
  const userToken = req.headers['x-user-token'] as string;
  if (!userToken) return res.status(401).json({ error: 'x-user-token required' });

  const result = pickupDrop(req.params.id, userToken);
  if (result.alreadyPickedUp) return res.status(409).json({ error: 'Already picked up' });
  if (!result.success) return res.status(404).json({ error: 'Drop not found' });

  const drop = getDrop(req.params.id, userToken);
  res.json({ drop });
});

// POST /drops/:id/react
app.post('/drops/:id/react', (req, res) => {
  const userToken = req.headers['x-user-token'] as string;
  if (!userToken) return res.status(401).json({ error: 'x-user-token required' });

  const { reaction_type } = req.body;
  if (!['amen', 'heart', 'pray'].includes(reaction_type)) {
    return res.status(400).json({ error: 'Invalid reaction_type' });
  }

  const reactions = addReaction(req.params.id, userToken, reaction_type);
  res.json({ reactions });
});

// POST /drops/:id/note — Add a note to a drop when you arrive
app.post('/drops/:id/note', (req, res) => {
  const userToken = req.headers['x-user-token'] as string;
  if (!userToken) return res.status(401).json({ error: 'x-user-token required' });

  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.length > 500) {
    return res.status(400).json({ error: 'Note text required (max 500 chars)' });
  }

  const note = addNote(req.params.id, userToken, text.trim());
  res.status(201).json({ note });
});

// GET /drops/:id/notes — Get all notes for a drop
app.get('/drops/:id/notes', (req, res) => {
  const notes = getNotes(req.params.id);
  res.json({ notes });
});

// GET /users/me
app.get('/users/me', (req, res) => {
  const userToken = req.headers['x-user-token'] as string;
  if (!userToken) return res.status(401).json({ error: 'x-user-token required' });
  res.json(getUserStats(userToken));
});

// GET /verses/search
app.get('/verses/search', (req, res) => {
  const query = (req.query.q as string) || '';
  const results = searchVerses(query);
  res.json({ verses: results });
});

app.listen(PORT, () => {
  console.log(`\n  VerseDrop API running at http://localhost:${PORT}\n`);
});
