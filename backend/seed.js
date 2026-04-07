/**
 * seed.js — Populates MongoDB with sample data
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { Subject, Note, Flashcard, Task, Session, User } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/studypal';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Subject.deleteMany({}),
      Note.deleteMany({}),
      Flashcard.deleteMany({}),
      Task.deleteMany({}),
      Session.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create subjects
    const subjects = await Subject.insertMany([
      { name: 'Mathematics',      color: '#6C63FF', icon: 'Σ',  progress: 72 },
      { name: 'Physics',          color: '#FF6584', icon: '⚛',  progress: 58 },
      { name: 'Computer Science', color: '#43E97B', icon: '⌨',  progress: 85 },
      { name: 'Literature',       color: '#F9A825', icon: '📖', progress: 40 },
    ]);
    const [math, physics, cs, lit] = subjects;
    console.log('📚 Created 4 subjects');

    // Create notes
    await Note.insertMany([
      { subjectId: math._id, title: 'Calculus: Derivatives', content: "The derivative of f(x) = x^2 is f'(x) = 2x. Key rules: power rule, chain rule, product rule.", tags: ['calculus', 'derivatives'], pinned: true, createdAt: new Date(Date.now() - 86400000 * 3) },
      { subjectId: cs._id,   title: 'Big O Notation',        content: 'Big O describes algorithm complexity. O(1) constant, O(n) linear, O(n^2) quadratic, O(log n) logarithmic.', tags: ['algorithms', 'complexity'], createdAt: new Date(Date.now() - 86400000) },
      { subjectId: physics._id, title: "Newton's Laws",      content: '1st: Inertia. 2nd: F=ma. 3rd: Action-reaction. Foundation of classical mechanics.', tags: ['mechanics', 'laws'], createdAt: new Date(Date.now() - 86400000 * 7) },
      { subjectId: lit._id,  title: "Hamlet's Soliloquy",    content: 'To be or not to be — explores existentialism, mortality, and the nature of suffering. Hamlet contemplates action vs. inaction.', tags: ['shakespeare', 'soliloquy'], createdAt: new Date(Date.now() - 86400000 * 2) },
    ]);
    console.log('📝 Created 4 notes');

    // Create flashcards
    await Flashcard.insertMany([
      { subjectId: math._id,    question: 'What is the derivative of sin(x)?',    answer: 'cos(x)',              difficulty: 'medium', nextReview: new Date(), interval: 1, easeFactor: 2.5, repetitions: 0 },
      { subjectId: math._id,    question: 'What is the integral of 1/x?',          answer: 'ln|x| + C',           difficulty: 'hard',   nextReview: new Date(), interval: 1, easeFactor: 2.5, repetitions: 0 },
      { subjectId: cs._id,      question: 'What does CPU stand for?',              answer: 'Central Processing Unit', difficulty: 'easy', nextReview: new Date(Date.now() + 86400000 * 3), interval: 3, easeFactor: 2.5, repetitions: 2 },
      { subjectId: physics._id, question: 'What is the speed of light?',           answer: '299,792,458 m/s',     difficulty: 'medium', nextReview: new Date(), interval: 1, easeFactor: 2.5, repetitions: 0 },
      { subjectId: cs._id,      question: 'What is a binary search tree?',         answer: 'A tree where left child < parent < right child, enabling O(log n) search', difficulty: 'medium', nextReview: new Date(), interval: 1, easeFactor: 2.5, repetitions: 0 },
      { subjectId: math._id,    question: "What is Euler's formula?",              answer: 'e^(iπ) + 1 = 0',     difficulty: 'hard',   nextReview: new Date(), interval: 1, easeFactor: 2.5, repetitions: 0 },
    ]);
    console.log('🃏 Created 6 flashcards');

    // Create tasks
    await Task.insertMany([
      { subjectId: math._id,    title: 'Complete Chapter 5 Exercises',    dueDate: new Date(Date.now() + 86400000 * 2), completed: false, priority: 'high' },
      { subjectId: cs._id,      title: 'Build Linked List in Python',      dueDate: new Date(Date.now() + 86400000 * 1), completed: false, priority: 'medium' },
      { subjectId: physics._id, title: 'Lab Report - Wave Optics',         dueDate: new Date(Date.now() + 86400000 * 5), completed: true,  priority: 'high' },
      { subjectId: lit._id,     title: "Essay: Hamlet's Soliloquy Analysis", dueDate: new Date(Date.now() + 86400000 * 3), completed: false, priority: 'low' },
      { subjectId: cs._id,      title: 'Study sorting algorithms',         dueDate: new Date(Date.now() + 86400000 * 4), completed: false, priority: 'medium' },
    ]);
    console.log('✅ Created 5 tasks');

    // Create study sessions
    const sessionData = [
      { subjectId: math._id,    duration: 45,  type: 'study',    date: new Date(Date.now() - 86400000 * 1) },
      { subjectId: cs._id,      duration: 90,  type: 'practice', date: new Date(Date.now() - 86400000 * 2) },
      { subjectId: physics._id, duration: 30,  type: 'review',   date: new Date(Date.now() - 86400000 * 3) },
      { subjectId: math._id,    duration: 60,  type: 'study',    date: new Date(Date.now() - 86400000 * 4) },
      { subjectId: lit._id,     duration: 25,  type: 'study',    date: new Date(Date.now() - 86400000 * 5) },
      { subjectId: cs._id,      duration: 75,  type: 'practice', date: new Date(Date.now() - 86400000 * 6) },
      { subjectId: physics._id, duration: 50,  type: 'review',   date: new Date(Date.now() - 86400000 * 7) },
    ];
    await Session.insertMany(sessionData);
    console.log('⏱️  Created 7 study sessions');

    // Create default user
    await User.create({ name: 'Alex Johnson', university: 'State University', semester: 'Spring 2025', avatar: 'AJ' });
    console.log('👤 Created default user');

    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   • ${subjects.length} Subjects`);
    console.log('   • 4 Notes');
    console.log('   • 6 Flashcards');
    console.log('   • 5 Tasks');
    console.log('   • 7 Study Sessions');
    console.log('   • 1 User');

  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seed();
