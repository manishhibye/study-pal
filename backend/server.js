require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Subject, Note, Flashcard, Task, Session, ChatMessage, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studypal';

app.use(cors());
app.use(express.json());

// ─── DATABASE CONNECTION ──────────────────────────────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => console.log(`✅ MongoDB connected: ${MONGODB_URI}`))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('💡 Tip: Make sure MongoDB is running → mongod --dbpath /data/db');
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected',  () => console.log('✅  MongoDB reconnected'));

const handleError = (res, err, msg = 'Server error') => {
  console.error(msg, err.message);
  res.status(500).json({ error: msg, details: err.message });
};

// ─── SUBJECTS ────────────────────────────────────────────────────────────────
app.get('/api/subjects', async (req, res) => {
  try { res.json(await Subject.find().sort({ createdAt: 1 })); }
  catch (err) { handleError(res, err, 'Failed to fetch subjects'); }
});

app.post('/api/subjects', async (req, res) => {
  try { res.status(201).json(await Subject.create(req.body)); }
  catch (err) { handleError(res, err, 'Failed to create subject'); }
});

app.put('/api/subjects/:id', async (req, res) => {
  try {
    const s = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ error: 'Subject not found' });
    res.json(s);
  } catch (err) { handleError(res, err, 'Failed to update subject'); }
});

app.delete('/api/subjects/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    await Promise.all([
      Note.deleteMany({ subjectId: req.params.id }),
      Flashcard.deleteMany({ subjectId: req.params.id }),
      Task.deleteMany({ subjectId: req.params.id }),
      Session.deleteMany({ subjectId: req.params.id }),
    ]);
    res.json({ success: true });
  } catch (err) { handleError(res, err, 'Failed to delete subject'); }
});

// ─── NOTES ───────────────────────────────────────────────────────────────────
app.get('/api/notes', async (req, res) => {
  try {
    const { subjectId, search } = req.query;
    let query = {};
    if (subjectId) query.subjectId = subjectId;
    if (search)    query.$text = { $search: search };
    const notes = await Note.find(query).populate('subjectId', 'name color icon').sort({ pinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) { handleError(res, err, 'Failed to fetch notes'); }
});

app.post('/api/notes', async (req, res) => {
  try {
    const note = await (await Note.create(req.body)).populate('subjectId', 'name color icon');
    res.status(201).json(note);
  } catch (err) { handleError(res, err, 'Failed to create note'); }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('subjectId', 'name color icon');
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) { handleError(res, err, 'Failed to update note'); }
});

app.delete('/api/notes/:id', async (req, res) => {
  try { await Note.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { handleError(res, err, 'Failed to delete note'); }
});

// ─── FLASHCARDS ──────────────────────────────────────────────────────────────
app.get('/api/flashcards', async (req, res) => {
  try {
    const { subjectId, due } = req.query;
    let query = {};
    if (subjectId)    query.subjectId = subjectId;
    if (due === 'true') query.nextReview = { $lte: new Date() };
    const cards = await Flashcard.find(query).populate('subjectId', 'name color icon').sort({ nextReview: 1 });
    res.json(cards);
  } catch (err) { handleError(res, err, 'Failed to fetch flashcards'); }
});

app.post('/api/flashcards', async (req, res) => {
  try {
    const card = await (await Flashcard.create(req.body)).populate('subjectId', 'name color icon');
    res.status(201).json(card);
  } catch (err) { handleError(res, err, 'Failed to create flashcard'); }
});

// SM-2 Spaced Repetition Algorithm
app.post('/api/flashcards/:id/review', async (req, res) => {
  try {
    const { quality } = req.body; // 0-5
    const card = await Flashcard.findById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Flashcard not found' });

    let { interval, easeFactor, repetitions } = card;
    if (quality >= 3) {
      if (repetitions === 0)      interval = 1;
      else if (repetitions === 1) interval = 6;
      else                        interval = Math.round(interval * easeFactor);
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    const nextReview = new Date(Date.now() + interval * 86400000);

    const updated = await Flashcard.findByIdAndUpdate(req.params.id, { interval, easeFactor, repetitions, nextReview }, { new: true }).populate('subjectId', 'name color icon');
    res.json(updated);
  } catch (err) { handleError(res, err, 'Failed to review flashcard'); }
});

app.delete('/api/flashcards/:id', async (req, res) => {
  try { await Flashcard.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { handleError(res, err, 'Failed to delete flashcard'); }
});

// ─── TASKS ───────────────────────────────────────────────────────────────────
app.get('/api/tasks', async (req, res) => {
  try {
    const { subjectId, completed } = req.query;
    let query = {};
    if (subjectId)           query.subjectId = subjectId;
    if (completed !== undefined) query.completed = completed === 'true';
    const tasks = await Task.find(query).populate('subjectId', 'name color icon').sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) { handleError(res, err, 'Failed to fetch tasks'); }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await (await Task.create(req.body)).populate('subjectId', 'name color icon');
    res.status(201).json(task);
  } catch (err) { handleError(res, err, 'Failed to create task'); }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.body.completed === true)  update.completedAt = new Date();
    if (req.body.completed === false) update.completedAt = null;
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true }).populate('subjectId', 'name color icon');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { handleError(res, err, 'Failed to update task'); }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try { await Task.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { handleError(res, err, 'Failed to delete task'); }
});

// ─── STUDY SESSIONS ──────────────────────────────────────────────────────────
app.get('/api/sessions', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const sessions = await Session.find({ date: { $gte: new Date(Date.now() - days * 86400000) } })
      .populate('subjectId', 'name color icon').sort({ date: -1 });
    res.json(sessions);
  } catch (err) { handleError(res, err, 'Failed to fetch sessions'); }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const session = await Session.create(req.body);
    // Recalculate subject progress
    const subjectSessions = await Session.find({ subjectId: req.body.subjectId });
    const totalMinutes = subjectSessions.reduce((sum, s) => sum + s.duration, 0);
    await Subject.findByIdAndUpdate(req.body.subjectId, { progress: Math.min(100, Math.round(totalMinutes / 3)) });
    const populated = await session.populate('subjectId', 'name color icon');
    res.status(201).json(populated);
  } catch (err) { handleError(res, err, 'Failed to log session'); }
});

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
app.get('/api/analytics', async (req, res) => {
  try {
    const now = new Date();
    const [allSessions, subjects, tasks, flashcards] = await Promise.all([
      Session.find(),
      Subject.find(),
      Task.find(),
      Flashcard.find(),
    ]);
    const weekSessions = allSessions.filter(s => new Date(s.date) >= new Date(now - 7 * 86400000));

    const subjectBreakdown = subjects.map(sub => {
      const subSessions = allSessions.filter(s => s.subjectId.toString() === sub._id.toString());
      const subTasks    = tasks.filter(t => t.subjectId.toString() === sub._id.toString());
      return { _id: sub._id, id: sub._id, name: sub.name, color: sub.color, icon: sub.icon, progress: sub.progress, totalTime: subSessions.reduce((sum, s) => sum + s.duration, 0), tasksDone: subTasks.filter(t => t.completed).length, tasksTotal: subTasks.length };
    });

    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now - i * 86400000);
      const dayStr = day.toISOString().split('T')[0];
      dailyData.push({ date: dayStr, minutes: allSessions.filter(s => new Date(s.date).toISOString().split('T')[0] === dayStr).reduce((sum, s) => sum + s.duration, 0), label: day.toLocaleDateString('en', { weekday: 'short' }) });
    }

    let streak = 0, checkDay = new Date(); checkDay.setHours(0, 0, 0, 0);
    while (allSessions.some(s => new Date(s.date).toISOString().split('T')[0] === checkDay.toISOString().split('T')[0])) {
      streak++; checkDay = new Date(checkDay.getTime() - 86400000);
    }

    res.json({ totalStudyTime: allSessions.reduce((sum, s) => sum + s.duration, 0), weekStudyTime: weekSessions.reduce((sum, s) => sum + s.duration, 0), subjectBreakdown, dailyData, dueCards: flashcards.filter(c => new Date(c.nextReview) <= now).length, completedTasks: tasks.filter(t => t.completed).length, totalTasks: tasks.length, streak, totalNotes: await Note.countDocuments(), totalCards: flashcards.length });
  } catch (err) { handleError(res, err, 'Failed to fetch analytics'); }
});

// ─── AI CHAT ─────────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  try {
    const [subjects, pendingTasks, dueCards] = await Promise.all([
      Subject.find().select('name'),
      Task.countDocuments({ completed: false }),
      Flashcard.countDocuments({ nextReview: { $lte: new Date() } }),
    ]);

    const systemPrompt = `You are ARIA (Adaptive Research & Intelligent Assistant), an intelligent AI study companion for university students. Help with: academic concepts, study plans, subject questions (Math, Physics, CS, Literature), mnemonics, motivation, summaries, practice quizzes. Student context: subjects = ${subjects.map(s => s.name).join(', ')}, pending tasks = ${pendingTasks}, due flashcards = ${dueCards}. Be warm, encouraging, and academically accurate.`;

    const historyContents = history.slice(-10).map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] }));
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_instruction: { parts: [{ text: systemPrompt }] }, contents: [...historyContents, { role: 'user', parts: [{ text: message }] }] }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const reply = data.candidates[0].content.parts[0].text;

    // Persist chat to MongoDB
    await ChatMessage.insertMany([{ role: 'user', content: message }, { role: 'assistant', content: reply }]);
    res.json({ reply });
  } catch (err) { handleError(res, err, 'AI chat failed'); }
});

// ─── AI SUMMARIZE ─────────────────────────────────────────────────────────────
app.post('/api/ai/summarize', async (req, res) => {
  const { content, title } = req.body;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: `Summarize this study note titled "${title}" in 3-4 concise bullet points:\n\n${content}` }] }] }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    res.json({ summary: data.candidates[0].content.parts[0].text });
  } catch (err) { handleError(res, err, 'AI summarize failed'); }
});

// ─── AI GENERATE FLASHCARDS ──────────────────────────────────────────────────
app.post('/api/ai/generate-flashcards', async (req, res) => {
  const { content, subjectId, count = 4 } = req.body;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: `Generate ${count} flashcard Q&A pairs. Return ONLY valid JSON array, no markdown:\n[{"question":"...","answer":"...","difficulty":"easy|medium|hard"}]\n\nContent:\n${content}` }] }] }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
    const cards = JSON.parse(text);
    const created = await Flashcard.insertMany(cards.map(c => ({ subjectId, ...c, nextReview: new Date(), interval: 1, easeFactor: 2.5, repetitions: 0 })));
    const populated = await Flashcard.populate(created, { path: 'subjectId', select: 'name color icon' });
    res.json({ cards: populated, count: created.length });
  } catch (err) { handleError(res, err, 'AI flashcard generation failed'); }
});

// ─── AUTH ────────────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, university, semester } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const user = await User.create({ name, email, password: hashed, university: university || 'University', semester: semester || 'Spring 2025', avatar: initials });
    const { password: _, ...safe } = user.toObject();
    res.status(201).json({ user: safe });
  } catch (err) { handleError(res, err, 'Registration failed'); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });
    const { password: _, ...safe } = user.toObject();
    res.json({ user: safe });
  } catch (err) { handleError(res, err, 'Login failed'); }
});

// ─── USER ─────────────────────────────────────────────────────────────────────
app.get('/api/user', async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) user = await User.create({ name: 'Student', university: 'University', semester: 'Spring 2025', avatar: 'ST' });
    res.json(user);
  } catch (err) { handleError(res, err, 'Failed to fetch user'); }
});

app.put('/api/user', async (req, res) => {
  try {
    let user = await User.findOne();
    user = user ? await User.findByIdAndUpdate(user._id, req.body, { new: true }) : await User.create(req.body);
    res.json(user);
  } catch (err) { handleError(res, err, 'Failed to update user'); }
});

// ─── CHAT HISTORY ─────────────────────────────────────────────────────────────
app.get('/api/chat/history', async (req, res) => {
  try {
    const history = await ChatMessage.find().sort({ createdAt: -1 }).limit(parseInt(req.query.limit) || 50);
    res.json(history.reverse());
  } catch (err) { handleError(res, err, 'Failed to fetch chat history'); }
});

app.delete('/api/chat/history', async (req, res) => {
  try { await ChatMessage.deleteMany({}); res.json({ success: true }); }
  catch (err) { handleError(res, err, 'Failed to clear history'); }
});

// ─── HEALTH & STATS ───────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', dbName: mongoose.connection.name, timestamp: new Date().toISOString(), version: '2.0.0' });
});

app.get('/api/db-stats', async (req, res) => {
  try {
    const [subjects, notes, flashcards, tasks, sessions, messages] = await Promise.all([Subject.countDocuments(), Note.countDocuments(), Flashcard.countDocuments(), Task.countDocuments(), Session.countDocuments(), ChatMessage.countDocuments()]);
    res.json({ subjects, notes, flashcards, tasks, sessions, messages, database: mongoose.connection.name });
  } catch (err) { handleError(res, err, 'Failed to fetch DB stats'); }
});

// ─── API-ONLY MODE (Frontend served separately on Vercel) ─────────────────────

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎓 StudyPal API v2.0 — MongoDB Edition`);
  console.log(`🚀 Server → http://localhost:${PORT}`);
  console.log(`📦 Database → ${MONGODB_URI}`);
  console.log(`\n💡 First time? Run: npm run seed\n`);
});
