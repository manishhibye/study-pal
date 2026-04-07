# 🎓 StudyPal — Intelligent Study Companion
### Full-Stack App: React + Node.js + **MongoDB** + Claude AI

---

## 🗄️ Database: MongoDB + Mongoose

This version uses **MongoDB** as the persistent database with **Mongoose ODM**.

### Collections (Tables)
| Collection     | Description                          |
|---------------|--------------------------------------|
| `subjects`    | Study subjects (Math, Physics, etc.) |
| `notes`       | Study notes with full-text search    |
| `flashcards`  | Spaced-repetition flashcards (SM-2)  |
| `tasks`       | To-do tasks with due dates           |
| `sessions`    | Pomodoro/study session logs          |
| `users`       | User profile                         |
| `chatmessages`| ARIA AI conversation history         |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local) OR MongoDB Atlas (cloud)
- Anthropic API Key

### 1. Install MongoDB locally
```bash
# macOS
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install -y mongodb
sudo systemctl start mongod

# Or use MongoDB Atlas (free cloud): https://mongodb.com/atlas
```

### 2. Clone & Install
```bash
# Backend
cd study-companion/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and ANTHROPIC_API_KEY
```

### 4. Seed the Database
```bash
cd backend
npm run seed
# Creates sample subjects, notes, flashcards, tasks, sessions
```

### 5. Start the App
```bash
# Terminal 1 — Backend (port 3001)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

Open **http://localhost:3000** ✅

---

## 🔌 MongoDB Connection Options

### Option A: Local MongoDB
```env
MONGO_URI=mongodb://localhost:27017/studypal
```

### Option B: MongoDB Atlas (Free Cloud)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster → Connect → Get connection string
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/studypal
```

### Option C: Docker
```bash
docker run -d -p 27017:27017 --name studypal-mongo mongo:7
```

---

## 🏗️ Architecture

```
study-companion/
├── backend/
│   ├── server.js        ← Express API (all routes, MongoDB queries)
│   ├── models.js        ← Mongoose schemas & models
│   ├── seed.js          ← Database seeder (npm run seed)
│   ├── .env.example     ← Environment variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx      ← All React components
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 📡 API Reference

### Subjects
```
GET    /api/subjects           List all subjects
POST   /api/subjects           Create subject
PUT    /api/subjects/:id       Update subject
DELETE /api/subjects/:id       Delete + cascade delete all related data
```

### Notes
```
GET    /api/notes?subjectId=&search=   List / full-text search
GET    /api/notes/:id                  Get single note
POST   /api/notes                      Create note
PUT    /api/notes/:id                  Update note
DELETE /api/notes/:id                  Delete note
```

### Flashcards (SM-2 Spaced Repetition)
```
GET    /api/flashcards?subjectId=&due=true   List cards (filter by due)
POST   /api/flashcards                        Create card
POST   /api/flashcards/:id/review            Submit review (quality: 0-5)
DELETE /api/flashcards/:id                   Delete card
```

### Tasks
```
GET    /api/tasks?subjectId=&completed=   List tasks
POST   /api/tasks                          Create task
PUT    /api/tasks/:id                      Update/complete task
DELETE /api/tasks/:id                      Delete task
```

### Sessions & Analytics
```
GET    /api/sessions?days=7    Recent study sessions
POST   /api/sessions           Log new session
GET    /api/analytics          Full analytics (aggregation pipelines)
```

### AI (Claude)
```
POST   /api/chat                      Chat with ARIA
GET    /api/chat/history              Fetch chat history
POST   /api/ai/summarize              Summarize a note
POST   /api/ai/generate-flashcards   AI-generate flashcards from text
```

### Misc
```
GET    /api/user       Get user profile
PUT    /api/user       Update user profile
GET    /api/health     Server + DB status check
```

---

## 🧬 Mongoose Schema Highlights

### Note — Full-Text Search Index
```js
NoteSchema.index({ title: 'text', content: 'text', tags: 'text' });
// Enables: Note.find({ $text: { $search: "calculus" } })
```

### Flashcard — SM-2 Algorithm Fields
```js
nextReview:  Date    // When to show next
interval:    Number  // Days until next review
easeFactor:  Number  // How easy (default 2.5)
repetitions: Number  // Times reviewed successfully
```

### Analytics — MongoDB Aggregation Pipeline
```js
// Total study time
Session.aggregate([
  { $group: { _id: null, total: { $sum: '$duration' } } }
])

// Daily breakdown
Session.aggregate([
  { $match: { date: { $gte: weekStart } } },
  { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, minutes: { $sum: '$duration' } } },
  { $sort: { '_id': 1 } }
])
```

---

## 🛠️ Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React 18 + Vite 5   |
| Backend    | Node.js + Express 4 |
| Database   | **MongoDB 7**       |
| ODM        | **Mongoose 8**      |
| AI         | Claude Sonnet (Anthropic) |
| Algorithm  | SM-2 Spaced Repetition |

---

## 📄 License
MIT — Free for educational and personal use.
