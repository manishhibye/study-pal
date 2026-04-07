const mongoose = require('mongoose');

// ─── SUBJECT ──────────────────────────────────────────────────────────────────
const SubjectSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  color:    { type: String, default: '#6C63FF' },
  icon:     { type: String, default: '📚' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

// ─── NOTE ─────────────────────────────────────────────────────────────────────
const NoteSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title:     { type: String, required: true, trim: true },
  content:   { type: String, required: true },
  tags:      [{ type: String, trim: true }],
  pinned:    { type: Boolean, default: false },
}, { timestamps: true });

NoteSchema.index({ title: 'text', content: 'text', tags: 'text' });

// ─── FLASHCARD ────────────────────────────────────────────────────────────────
const FlashcardSchema = new mongoose.Schema({
  subjectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  question:    { type: String, required: true },
  answer:      { type: String, required: true },
  difficulty:  { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  nextReview:  { type: Date, default: Date.now },
  interval:    { type: Number, default: 1 },
  easeFactor:  { type: Number, default: 2.5 },
  repetitions: { type: Number, default: 0 },
}, { timestamps: true });

// ─── TASK ─────────────────────────────────────────────────────────────────────
const TaskSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title:     { type: String, required: true, trim: true },
  dueDate:   { type: Date, required: true },
  completed: { type: Boolean, default: false },
  priority:  { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
}, { timestamps: true });

// ─── STUDY SESSION ────────────────────────────────────────────────────────────
const SessionSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  duration:  { type: Number, required: true, min: 1 },
  type:      { type: String, enum: ['study', 'practice', 'review'], default: 'study' },
  date:      { type: Date, default: Date.now },
}, { timestamps: true });

// ─── USER ─────────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name:       { type: String, default: 'Alex Johnson' },
  university: { type: String, default: 'State University' },
  semester:   { type: String, default: 'Spring 2025' },
  avatar:     { type: String, default: 'AJ' },
  email:      { type: String, unique: true, sparse: true },
  password:   { type: String },
}, { timestamps: true });

// ─── CHAT MESSAGE ─────────────────────────────────────────────────────────────
const ChatMessageSchema = new mongoose.Schema({
  role:    { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = {
  Subject:     mongoose.model('Subject',     SubjectSchema),
  Note:        mongoose.model('Note',        NoteSchema),
  Flashcard:   mongoose.model('Flashcard',   FlashcardSchema),
  Task:        mongoose.model('Task',        TaskSchema),
  Session:     mongoose.model('Session',     SessionSchema),
  User:        mongoose.model('User',        UserSchema),
  ChatMessage: mongoose.model('ChatMessage', ChatMessageSchema),
};
