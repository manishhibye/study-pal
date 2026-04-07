import { useState, useEffect, useRef, useCallback } from "react";

const API = "http://localhost:3001/api";

// ─── API HELPERS ─────────────────────────────────────────────────────────────
const api = {
  get: (path) => fetch(`${API}${path}`).then(r => r.json()),
  post: (path, data) => fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  put: (path, data) => fetch(`${API}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  del: (path) => fetch(`${API}${path}`, { method: 'DELETE' }).then(r => r.json()),
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    book: "M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
    card: "M2 3h20v14H2z M8 21h8 M12 17v4",
    check: "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
    chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
    chart: "M18 20V10 M12 20V4 M6 20v-6",
    timer: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
    brain: "M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7H4a2 2 0 00-2 2v2a2 2 0 002 2h.5A2.5 2.5 0 017 15.5v0A2.5 2.5 0 019.5 18h5a2.5 2.5 0 002.5-2.5v0a2.5 2.5 0 012.5-2.5H20a2 2 0 002-2V9a2 2 0 00-2-2h-.5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2z",
    plus: "M12 5v14 M5 12h14",
    x: "M18 6L6 18 M6 6l12 12",
    pin: "M12 17v5 M5 17h14v-2a7 7 0 00-14 0v2z M12 3a4 4 0 100 8 4 4 0 000-8z",
    trash: "M3 6h18 M8 6V4h8v2 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    lightning: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    search: "M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    send: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
    refresh: "M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
    sun: "M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",
    moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    award: "M12 15a7 7 0 100-14 7 7 0 000 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12",
    zap: "M13 2L3 14h9l-1 8 10-12h-9z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(icons[name] || "").split(" M").map((d, i) => <path key={i} d={i === 0 ? d : "M" + d} />)}
    </svg>
  );
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ subjects, onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/analytics').then(setAnalytics);
    api.get('/tasks?completed=false').then(t => setTasks(t.slice(0, 5)));
  }, []);

  const maxMinutes = analytics?.dailyData ? Math.max(...analytics.dailyData.map(d => d.minutes), 1) : 1;

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', borderRadius: 20, padding: '32px 36px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(108,99,255,0.15)' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 120, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,101,132,0.1)' }} />
        <div style={{ position: 'relative' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 6 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Alex! 👋</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
            {analytics?.dueCards > 0 ? `You have ${analytics.dueCards} flashcard${analytics.dueCards > 1 ? 's' : ''} due for review. ` : 'All flashcards reviewed! '}
            {analytics?.streak > 0 ? `🔥 ${analytics.streak} day streak!` : 'Start your study streak today!'}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'This Week', value: `${Math.floor((analytics?.weekStudyTime || 0) / 60)}h ${(analytics?.weekStudyTime || 0) % 60}m`, icon: 'timer', color: '#6C63FF' },
          { label: 'Tasks Done', value: `${analytics?.completedTasks || 0}/${analytics?.totalTasks || 0}`, icon: 'check', color: '#43E97B' },
          { label: 'Cards Due', value: analytics?.dueCards || 0, icon: 'card', color: '#FF6584' },
          { label: 'Day Streak', value: `${analytics?.streak || 0} 🔥`, icon: 'zap', color: '#F9A825' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--card)', borderRadius: 16, padding: '20px 22px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{stat.label}</span>
              <div style={{ color: stat.color }}><Icon name={stat.icon} size={18} /></div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Study Chart */}
          <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Weekly Study Activity</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {analytics?.dailyData?.map(day => (
                <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', background: day.minutes > 0 ? 'linear-gradient(180deg, #6C63FF, #9B94FF)' : 'var(--border)', borderRadius: '6px 6px 0 0', height: `${Math.max((day.minutes / maxMinutes) * 100, day.minutes > 0 ? 8 : 4)}px`, transition: 'height 0.5s ease', position: 'relative' }}>
                    {day.minutes > 0 && <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{day.minutes}m</div>}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>My Subjects</h3>
              <button onClick={() => onNavigate('subjects')} style={{ fontSize: 13, color: '#6C63FF', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {subjects.map(sub => (
                <div key={sub.id} onClick={() => onNavigate('notes', sub.id)} style={{ background: 'var(--bg)', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', border: `1px solid ${sub.color}22`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${sub.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${sub.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{sub.icon}</div>
                    <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: 14 }}>{sub.name}</span>
                  </div>
                  <div style={{ background: 'var(--border)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${sub.progress}%`, height: '100%', background: sub.color, borderRadius: 999, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>{sub.progress}% complete</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>Upcoming Tasks</h3>
              <button onClick={() => onNavigate('tasks')} style={{ fontSize: 13, color: '#6C63FF', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tasks.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>All caught up! 🎉</p> :
                tasks.map(task => {
                  const daysLeft = Math.ceil((new Date(task.dueDate) - Date.now()) / 86400000);
                  const sub = subjects.find(s => s._id === task.subjectId);
                  const pColors = { high: '#FF6584', medium: '#F9A825', low: '#43E97B' };
                  return (
                    <div key={task._id} style={{ background: 'var(--bg)', borderRadius: 12, padding: '12px 14px', borderLeft: `3px solid ${pColors[task.priority]}` }}>
                      <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{task.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub?.name}</span>
                        <span style={{ fontSize: 12, color: daysLeft <= 1 ? '#FF6584' : daysLeft <= 3 ? '#F9A825' : 'var(--text-muted)', fontWeight: 500 }}>
                          {daysLeft <= 0 ? 'Overdue!' : daysLeft === 1 ? 'Due tomorrow' : `${daysLeft}d left`}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Review Flashcards', icon: 'card', color: '#FF6584', page: 'flashcards' },
                { label: 'Start Study Timer', icon: 'timer', color: '#6C63FF', page: 'pomodoro' },
                { label: 'Chat with ARIA', icon: 'chat', color: '#43E97B', page: 'chat' },
                { label: 'Add New Note', icon: 'book', color: '#F9A825', page: 'notes' },
              ].map(action => (
                <button key={action.label} onClick={() => onNavigate(action.page)} style={{ background: `${action.color}11`, border: `1px solid ${action.color}33`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${action.color}22`}
                  onMouseLeave={e => e.currentTarget.style.background = `${action.color}11`}>
                  <div style={{ color: action.color }}><Icon name={action.icon} size={18} /></div>
                  <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NOTES ───────────────────────────────────────────────────────────────────
function Notes({ subjects }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSub, setFilterSub] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', subjectId: '', tags: '' });
  const [aiSummary, setAiSummary] = useState({});
  const [loadingSummary, setLoadingSummary] = useState({});
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    let url = '/notes?';
    if (filterSub) url += `subjectId=${filterSub}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    api.get(url).then(setNotes);
  };

  useEffect(() => { load(); }, [filterSub, search]);

  const save = async () => {
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (editing) { await api.put(`/notes/${editing}`, data); }
    else { await api.post('/notes', data); }
    setEditing(null); setForm({ title: '', content: '', subjectId: '', tags: '' }); setShowForm(false); load();
  };

  const summarize = async (note) => {
    setLoadingSummary(p => ({ ...p, [note.id]: true }));
    const res = await api.post('/ai/summarize', { content: note.content, title: note.title });
    setAiSummary(p => ({ ...p, [note.id]: res.summary }));
    setLoadingSummary(p => ({ ...p, [note.id]: false }));
  };

  const startEdit = (note) => {
    setEditing(note._id);
    setForm({ title: note.title, content: note.content, subjectId: note.subjectId?._id || note.subjectId, tags: note.tags.join(', ') });
    setShowForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700 }}>📓 Study Notes</h2>
        <button onClick={() => { setEditing(null); setForm({ title: '', content: '', subjectId: '', tags: '' }); setShowForm(true); }} style={{ background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}>
          <Icon name="plus" size={16} /> New Note
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icon name="search" size={16} /></div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px 10px 38px', color: 'var(--text)', fontSize: 14, boxSizing: 'border-box' }} />
        </div>
        <select value={filterSub} onChange={e => setFilterSub(e.target.value)} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: 'var(--text)', marginBottom: 16, fontSize: 16 }}>{editing ? 'Edit Note' : 'New Note'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Note title" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }} />
            <select value={form.subjectId} onChange={e => setForm(p => ({ ...p, subjectId: e.target.value }))} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }}>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Write your notes here..." rows={6} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }} />
            <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma-separated)" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} style={{ background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>Save Note</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {notes.map(note => {
          const sub = note.subjectId?._id ? note.subjectId : subjects.find(s => s._id === note.subjectId);
          return (
            <div key={note._id} style={{ background: 'var(--card)', border: `1px solid var(--border)`, borderRadius: 16, padding: 20, position: 'relative', borderTop: `3px solid ${sub?.color || '#6C63FF'}` }}>
              {note.pinned && <div style={{ position: 'absolute', top: 12, right: 12, color: '#F9A825' }}><Icon name="pin" size={14} /></div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: `${sub?.color || '#6C63FF'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{sub?.icon}</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub?.name}</span>
              </div>
              <h4 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{note.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{note.content.slice(0, 120)}{note.content.length > 120 ? '...' : ''}</p>

              {aiSummary[note.id] && (
                <div style={{ background: '#6C63FF11', border: '1px solid #6C63FF33', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 13, color: 'var(--text)' }}>
                  <div style={{ color: '#6C63FF', fontWeight: 600, marginBottom: 6, fontSize: 12 }}>✨ AI Summary</div>
                  <div style={{ whiteSpace: 'pre-line' }}>{aiSummary[note.id]}</div>
                </div>
              )}

              {note.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {note.tags.map(tag => <span key={tag} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', fontSize: 12, color: 'var(--text-muted)' }}>#{tag}</span>)}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => summarize(note)} disabled={loadingSummary[note.id]} style={{ background: '#6C63FF11', color: '#6C63FF', border: '1px solid #6C63FF33', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                  {loadingSummary[note.id] ? '...' : '✨ Summarize'}
                </button>
                <button onClick={() => startEdit(note)} style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}><Icon name="edit" size={14} /></button>
                <button onClick={() => api.put(`/notes/${note._id}`, { pinned: !note.pinned }).then(load)} style={{ background: 'var(--bg)', color: note.pinned ? '#F9A825' : 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}><Icon name="pin" size={14} /></button>
                <button onClick={() => api.del(`/notes/${note._id}`).then(load)} style={{ background: 'var(--bg)', color: '#FF6584', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', marginLeft: 'auto' }}><Icon name="trash" size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FLASHCARDS ──────────────────────────────────────────────────────────────
function Flashcards({ subjects }) {
  const [cards, setCards] = useState([]);
  const [filterSub, setFilterSub] = useState('');
  const [studyMode, setStudyMode] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', subjectId: '', difficulty: 'medium' });
  const [showForm, setShowForm] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [generating, setGenerating] = useState(false);

  const load = () => {
    let url = '/flashcards?';
    if (filterSub) url += `subjectId=${filterSub}&`;
    api.get(url).then(setCards);
  };

  useEffect(() => { load(); }, [filterSub]);

  const addCard = async () => {
    await api.post('/flashcards', { ...form });
    setForm({ question: '', answer: '', subjectId: '', difficulty: 'medium' });
    setShowForm(false); load();
  };

  const review = async (quality) => {
    await api.post(`/flashcards/${cards[currentIdx].id}/review`, { quality });
    if (currentIdx + 1 >= cards.length) { setStudyMode(false); setCurrentIdx(0); load(); }
    else { setCurrentIdx(p => p + 1); setFlipped(false); }
  };

  const generateAI = async () => {
    if (!aiContent || !form.subjectId) return;
    setGenerating(true);
    await api.post('/ai/generate-flashcards', { content: aiContent, subjectId: form.subjectId, count: 4 });
    setGenerating(false); setAiContent(''); load();
  };

  const dueCards = cards.filter(c => new Date(c.nextReview) <= new Date());
  const diffColors = { easy: '#43E97B', medium: '#F9A825', hard: '#FF6584' };

  if (studyMode && cards.length > 0) {
    const card = cards[currentIdx % cards.length];
    const sub = card.subjectId?._id ? card.subjectId : subjects.find(s => s._id === card.subjectId);
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700 }}>Study Mode</h2>
          <button onClick={() => { setStudyMode(false); setCurrentIdx(0); setFlipped(false); }} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', color: 'var(--text)' }}>Exit</button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16, color: 'var(--text-muted)' }}>{currentIdx + 1} / {cards.length} cards</div>
        <div onClick={() => setFlipped(p => !p)} style={{ background: 'var(--card)', border: `2px solid ${sub?.color || '#6C63FF'}44`, borderRadius: 20, padding: '48px 40px', textAlign: 'center', cursor: 'pointer', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>{flipped ? 'Answer' : 'Question — Click to reveal'}</div>
          <div style={{ fontSize: 22, color: 'var(--text)', fontWeight: 600, lineHeight: 1.5 }}>{flipped ? card.answer : card.question}</div>
          <div style={{ marginTop: 16, padding: '4px 12px', background: `${diffColors[card.difficulty]}22`, color: diffColors[card.difficulty], borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{card.difficulty}</div>
        </div>
        {flipped && (
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ label: 'Again', quality: 0, color: '#FF6584' }, { label: 'Hard', quality: 2, color: '#F9A825' }, { label: 'Good', quality: 3, color: '#6C63FF' }, { label: 'Easy', quality: 5, color: '#43E97B' }].map(btn => (
              <button key={btn.label} onClick={() => review(btn.quality)} style={{ flex: 1, background: `${btn.color}22`, color: btn.color, border: `1px solid ${btn.color}44`, borderRadius: 12, padding: '14px', cursor: 'pointer', fontWeight: 600, fontSize: 15, transition: 'all 0.2s' }}>{btn.label}</button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700 }}>🃏 Flashcards</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          {dueCards.length > 0 && <button onClick={() => { setStudyMode(true); setCurrentIdx(0); setFlipped(false); }} style={{ background: 'linear-gradient(135deg, #FF6584, #FF8A65)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Review {dueCards.length} Due Cards 🔥</button>}
          <button onClick={() => { setStudyMode(true); setCurrentIdx(0); setFlipped(false); }} style={{ background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Study All</button>
          <button onClick={() => setShowForm(p => !p)} style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="plus" size={16} /> Add Card</button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <select value={filterSub} onChange={e => setFilterSub(e.target.value)} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', color: 'var(--text)', fontSize: 14 }}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 16px', color: 'var(--text-muted)', fontSize: 14 }}>{cards.length} cards total • {dueCards.length} due</div>
      </div>

      {/* Forms */}
      {showForm && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: 'var(--text)', fontSize: 16, marginBottom: 16 }}>Add Flashcard</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <select value={form.subjectId} onChange={e => setForm(p => ({ ...p, subjectId: e.target.value }))} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }}>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <input value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="Question" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }} />
            <input value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} placeholder="Answer" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }} />
            <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }}>
              <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={addCard} style={{ background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>Add Card</button>
              <button onClick={() => setShowForm(false)} style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <h4 style={{ color: 'var(--text)', fontSize: 14, marginBottom: 10 }}>✨ AI Generate from Content</h4>
            <textarea value={aiContent} onChange={e => setAiContent(e.target.value)} placeholder="Paste your study content and AI will generate flashcards..." rows={4} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <button onClick={generateAI} disabled={generating || !aiContent || !form.subjectId} style={{ marginTop: 10, background: generating ? 'var(--border)' : 'linear-gradient(135deg, #6C63FF, #9B94FF)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: generating ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
              {generating ? 'Generating...' : '✨ Generate 4 Flashcards'}
            </button>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {cards.map(card => {
          const sub = card.subjectId?._id ? card.subjectId : subjects.find(s => s._id === card.subjectId);
          const isDue = new Date(card.nextReview) <= new Date();
          return (
            <div key={card._id} style={{ background: 'var(--card)', border: `1px solid ${isDue ? '#FF658444' : 'var(--border)'}`, borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ background: `${diffColors[card.difficulty]}22`, color: diffColors[card.difficulty], borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{card.difficulty}</span>
                  {isDue && <span style={{ background: '#FF658422', color: '#FF6584', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>Due</span>}
                </div>
                <button onClick={() => api.del(`/flashcards/${card._id}`).then(load)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Icon name="trash" size={14} /></button>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Q: <span style={{ color: 'var(--text)', fontWeight: 500 }}>{card.question}</span></div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>A: <span style={{ color: '#43E97B', fontWeight: 500 }}>{card.answer}</span></div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub?.name} • {card.repetitions} reps</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TASKS ───────────────────────────────────────────────────────────────────
function Tasks({ subjects }) {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', subjectId: '', dueDate: '', priority: 'medium' });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = () => api.get('/tasks').then(setTasks);
  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.post('/tasks', { ...form });
    setForm({ title: '', subjectId: '', dueDate: '', priority: 'medium' });
    setShowForm(false); load();
  };

  const toggle = async (task) => {
    await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    load();
  };

  const filtered = tasks.filter(t => filter === 'all' ? true : filter === 'done' ? t.completed : !t.completed);
  const pColors = { high: '#FF6584', medium: '#F9A825', low: '#43E97B' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700 }}>✅ Tasks</h2>
        <button onClick={() => setShowForm(p => !p)} style={{ background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}><Icon name="plus" size={16} /> Add Task</button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['all', 'pending', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? '#6C63FF' : 'var(--card)', color: filter === f ? '#fff' : 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 500, textTransform: 'capitalize', fontSize: 14 }}>{f} {f === 'pending' ? `(${tasks.filter(t => !t.completed).length})` : f === 'done' ? `(${tasks.filter(t => t.completed).length})` : `(${tasks.length})`}</button>
        ))}
      </div>

      {showForm && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Task title" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <select value={form.subjectId} onChange={e => setForm(p => ({ ...p, subjectId: e.target.value }))} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }}>
                <option value="">Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }} />
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={add} style={{ background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>Add Task</button>
              <button onClick={() => setShowForm(false)} style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(task => {
          const sub = task.subjectId?._id ? task.subjectId : subjects.find(s => s._id === task.subjectId);
          const daysLeft = Math.ceil((new Date(task.dueDate) - Date.now()) / 86400000);
          return (
            <div key={task._id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, opacity: task.completed ? 0.6 : 1 }}>
              <div onClick={() => toggle(task)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${task.completed ? '#43E97B' : 'var(--border)'}`, background: task.completed ? '#43E97B' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {task.completed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: 15, textDecoration: task.completed ? 'line-through' : 'none', marginBottom: 4 }}>{task.title}</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {sub && <span style={{ background: `${sub.color}22`, color: sub.color, borderRadius: 6, padding: '2px 8px', fontSize: 12 }}>{sub.name}</span>}
                  <span style={{ fontSize: 12, color: daysLeft < 0 ? '#FF6584' : daysLeft <= 2 ? '#F9A825' : 'var(--text-muted)' }}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: `${pColors[task.priority]}22`, color: pColors[task.priority], borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{task.priority}</span>
                <button onClick={() => api.del(`/tasks/${task._id}`).then(load)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF658466' }}><Icon name="trash" size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── POMODORO TIMER ──────────────────────────────────────────────────────────
function Pomodoro({ subjects }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('work');
  const [sessions, setSessions] = useState(0);
  const [selectedSub, setSelectedSub] = useState('');
  const [settings, setSettings] = useState({ workDuration: 25, breakDuration: 5, longBreakDuration: 15 });
  const intervalRef = useRef(null);

  const totalTime = phase === 'work' ? settings.workDuration * 60 : phase === 'break' ? settings.breakDuration * 60 : settings.longBreakDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (phase === 'work') {
              const newSessions = sessions + 1;
              setSessions(newSessions);
              if (selectedSub) api.post('/sessions', { subjectId: parseInt(selectedSub), duration: settings.workDuration, type: 'study' });
              if (newSessions % 4 === 0) { setPhase('longBreak'); return settings.longBreakDuration * 60; }
              else { setPhase('break'); return settings.breakDuration * 60; }
            } else { setPhase('work'); return settings.workDuration * 60; }
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, phase, sessions]);

  const reset = () => { clearInterval(intervalRef.current); setIsRunning(false); setTimeLeft(settings.workDuration * 60); setPhase('work'); };

  const circumference = 2 * Math.PI * 90;
  const strokeDash = circumference - (progress / 100) * circumference;
  const phaseColor = phase === 'work' ? '#6C63FF' : phase === 'break' ? '#43E97B' : '#F9A825';

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>⏱️ Pomodoro Timer</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {['work', 'break', 'longBreak'].map(p => (
          <button key={p} onClick={() => { setPhase(p); setIsRunning(false); setTimeLeft((p === 'work' ? settings.workDuration : p === 'break' ? settings.breakDuration : settings.longBreakDuration) * 60); }}
            style={{ flex: 1, background: phase === p ? phaseColor : 'var(--card)', color: phase === p ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px', cursor: 'pointer', fontWeight: 500, fontSize: 13, transition: 'all 0.2s' }}>
            {p === 'work' ? 'Focus' : p === 'break' ? 'Break' : 'Long Break'}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="110" cy="110" r="90" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle cx="110" cy="110" r="90" fill="none" stroke={phaseColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDash} style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums', letterSpacing: -2 }}>{mins}:{secs}</div>
            <div style={{ fontSize: 14, color: phaseColor, fontWeight: 600, textTransform: 'capitalize' }}>{phase === 'longBreak' ? 'Long Break' : phase}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>Session #{sessions + 1} • {sessions} completed today</div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
        <button onClick={() => setIsRunning(p => !p)} style={{ background: phaseColor, color: '#fff', border: 'none', borderRadius: 14, padding: '14px 40px', cursor: 'pointer', fontWeight: 700, fontSize: 17, minWidth: 140 }}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 24px', cursor: 'pointer', fontWeight: 600 }}><Icon name="refresh" size={18} /></button>
      </div>

      {/* Subject Select */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, marginBottom: 20 }}>
        <label style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8, display: 'block' }}>Studying for:</label>
        <select value={selectedSub} onChange={e => setSelectedSub(e.target.value)} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }}>
          <option value="">Select a subject</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.icon} {s.name}</option>)}
        </select>
      </div>

      {/* Settings */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
        <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 14, fontSize: 14 }}>⚙️ Timer Settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[['Work', 'workDuration'], ['Break', 'breakDuration'], ['Long Break', 'longBreakDuration']].map(([label, key]) => (
            <div key={key}>
              <label style={{ color: 'var(--text-muted)', fontSize: 12, display: 'block', marginBottom: 6 }}>{label} (min)</label>
              <input type="number" min="1" max="60" value={settings[key]} onChange={e => { const v = parseInt(e.target.value); setSettings(p => ({ ...p, [key]: v })); if (!isRunning) setTimeLeft(v * 60); }} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px', color: 'var(--text)', fontSize: 15, textAlign: 'center', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI CHAT ─────────────────────────────────────────────────────────────────
function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm **ARIA** — your AI study companion! 🎓\n\nI can help you:\n- Explain any academic concept\n- Create study plans\n- Quiz you on any subject\n- Generate memory tricks\n- Answer questions on Math, Physics, CS, Literature, and more!\n\nWhat would you like to study today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const quickPrompts = [
    "Explain the Chain Rule in calculus",
    "Quiz me on Newton's Laws",
    "Create a study plan for next week",
    "What is Big O notation?",
    "Give me a mnemonic for the periodic table",
  ];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await api.post('/chat', { message: msg, history: messages.slice(-10) });
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again.' }]);
    }
    setLoading(false);
  };

  const formatMsg = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:var(--border);padding:2px 6px;border-radius:4px;font-size:13px">$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
        <div>
          <h2 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700 }}>ARIA — AI Study Companion</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Powered by Claude • Always ready to help</div>
        </div>
        <div style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%', background: '#43E97B', boxShadow: '0 0 8px #43E97B' }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 4, marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #6C63FF, #9B94FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>🤖</div>}
            <div style={{ maxWidth: '75%', background: msg.role === 'user' ? 'linear-gradient(135deg, #6C63FF, #9B94FF)' : 'var(--card)', color: msg.role === 'user' ? '#fff' : 'var(--text)', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '12px 16px', fontSize: 14, lineHeight: 1.7, border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none' }} dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }} />
            {msg.role === 'user' && <div style={{ width: 36, height: 36, borderRadius: 12, background: '#6C63FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>👤</div>}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #6C63FF, #9B94FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', padding: '14px 18px', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#6C63FF', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {quickPrompts.map(p => (
          <button key={p} onClick={() => send(p)} style={{ background: '#6C63FF11', color: '#9B94FF', border: '1px solid #6C63FF33', borderRadius: 20, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#6C63FF22'}
            onMouseLeave={e => e.currentTarget.style.background = '#6C63FF11'}>
            {p}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder="Ask ARIA anything about your studies..." style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 18px', color: 'var(--text)', fontSize: 15, fontFamily: 'inherit' }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ background: input.trim() && !loading ? 'linear-gradient(135deg, #6C63FF, #9B94FF)' : 'var(--border)', color: '#fff', border: 'none', borderRadius: 14, padding: '0 22px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
          <Icon name="send" size={20} />
        </button>
      </div>

      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
function Analytics({ subjects }) {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/analytics').then(setData); }, []);
  if (!data) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Loading analytics...</div>;

  const maxMinutes = Math.max(...data.dailyData.map(d => d.minutes), 1);

  return (
    <div>
      <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>📊 Analytics</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Study Time', value: `${Math.floor(data.totalStudyTime / 60)}h ${data.totalStudyTime % 60}m`, color: '#6C63FF', icon: 'timer' },
          { label: 'This Week', value: `${Math.floor(data.weekStudyTime / 60)}h ${data.weekStudyTime % 60}m`, color: '#43E97B', icon: 'chart' },
          { label: 'Tasks Complete', value: `${data.completedTasks}/${data.totalTasks}`, color: '#F9A825', icon: 'check' },
          { label: 'Day Streak', value: `${data.streak} days 🔥`, color: '#FF6584', icon: 'lightning' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ color: s.color, marginBottom: 8 }}><Icon name={s.icon} size={22} /></div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Daily Chart */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Daily Study Minutes</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
            {data.dailyData.map(day => (
              <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{day.minutes}m</div>
                <div style={{ width: '100%', background: day.minutes > 0 ? 'linear-gradient(180deg, #6C63FF, #9B94FF)' : 'var(--border)', borderRadius: '6px 6px 0 0', height: `${Math.max((day.minutes / maxMinutes) * 100, 4)}px` }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Breakdown */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Subject Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data.subjectBreakdown.map(sub => (
              <div key={sub.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>{sub.icon} {sub.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{sub.totalTime}m • {sub.tasksDone}/{sub.tasksTotal} tasks</span>
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${sub.progress}%`, height: '100%', background: sub.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ─── LOGIN PAGE ──────────────────────────────────────────────────────────────
function LoginPage({ darkMode, mode, setMode, onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', university: '', semester: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      onAuth(data.user);
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', background: '#1e1e2e', border: '1px solid #2a2a3a', borderRadius: 12, padding: '12px 16px', color: '#f0f0f5', fontSize: 14, marginBottom: 14, boxSizing: 'border-box' };
  const labelStyle = { display: 'block', color: '#666680', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', -apple-system, sans-serif", padding: 16 }}>
      <style>{`* { margin:0; padding:0; box-sizing:border-box; } input:focus { border-color: #6C63FF !important; outline: none; }`}</style>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px' }}>🎓</div>
          <h1 style={{ color: '#f0f0f5', fontSize: 28, fontWeight: 700 }}>StudyPal</h1>
          <p style={{ color: '#666680', fontSize: 14, marginTop: 6 }}>Your AI-powered study companion</p>
        </div>

        {/* Card */}
        <div style={{ background: '#16161f', borderRadius: 20, padding: 32, border: '1px solid #2a2a3a' }}>
          <h2 style={{ color: '#f0f0f5', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: '#666680', fontSize: 14, marginBottom: 28 }}>
            {mode === 'login' ? 'Sign in to continue studying' : 'Join StudyPal and start learning'}
          </p>

          {error && (
            <div style={{ background: '#FF658422', border: '1px solid #FF658455', borderRadius: 10, padding: '10px 14px', color: '#FF6584', fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} type="text" placeholder="Alex Johnson" value={form.name} onChange={set('name')} required />
              </>
            )}

            <label style={labelStyle}>Email Address</label>
            <input style={inputStyle} type="email" placeholder="you@university.edu" value={form.email} onChange={set('email')} required />

            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" placeholder={mode === 'login' ? 'Your password' : 'At least 6 characters'} value={form.password} onChange={set('password')} required minLength={mode === 'register' ? 6 : undefined} />

            {mode === 'register' && (
              <>
                <label style={labelStyle}>University <span style={{ color: '#444' }}>(optional)</span></label>
                <input style={inputStyle} type="text" placeholder="State University" value={form.university} onChange={set('university')} />
                <label style={labelStyle}>Semester <span style={{ color: '#444' }}>(optional)</span></label>
                <input style={{ ...inputStyle, marginBottom: 0 }} type="text" placeholder="Spring 2025" value={form.semester} onChange={set('semester')} />
              </>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#444' : 'linear-gradient(135deg, #6C63FF, #FF6584)', border: 'none', borderRadius: 12, padding: '13px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 24 }}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Toggle */}
        <p style={{ textAlign: 'center', color: '#666680', fontSize: 14, marginTop: 20 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={{ background: 'none', border: 'none', color: '#6C63FF', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [subjects, setSubjects] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studypal_user')); } catch { return null; }
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (authUser) api.get('/subjects').then(setSubjects).catch(() => {});
  }, [authUser]);

  const navigate = (p) => setPage(p);

  const handleLogout = () => {
    localStorage.removeItem('studypal_user');
    setAuthUser(null);
    setPage('dashboard');
  };

  if (!authUser) {
    return <LoginPage darkMode={darkMode} mode={authMode} setMode={setAuthMode} onAuth={user => {
      localStorage.setItem('studypal_user', JSON.stringify(user));
      setAuthUser(user);
    }} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'notes', label: 'Notes', icon: 'book' },
    { id: 'flashcards', label: 'Flashcards', icon: 'card' },
    { id: 'tasks', label: 'Tasks', icon: 'check' },
    { id: 'pomodoro', label: 'Timer', icon: 'timer' },
    { id: 'chat', label: 'ARIA AI', icon: 'chat' },
    { id: 'analytics', label: 'Analytics', icon: 'chart' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0e0e16' : '#f5f5f7', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --bg: ${darkMode ? '#0e0e16' : '#f5f5f7'}; --card: ${darkMode ? '#16161f' : '#ffffff'}; --border: ${darkMode ? '#2a2a3a' : '#e5e5ea'}; --text: ${darkMode ? '#f0f0f5' : '#1a1a2e'}; --text-muted: ${darkMode ? '#666680' : '#8e8ea0'}; }
        input, select, textarea { outline: none; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 240, background: darkMode ? '#0b0b13' : '#fff', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎓</div>
            <div>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16 }}>StudyPal</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>AI Companion</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflow: 'auto' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, border: 'none', cursor: 'pointer', marginBottom: 4, background: page === item.id ? '#6C63FF22' : 'transparent', color: page === item.id ? '#6C63FF' : 'var(--text-muted)', fontWeight: page === item.id ? 600 : 400, fontSize: 14, transition: 'all 0.15s', textAlign: 'left' }}
              onMouseEnter={e => { if (page !== item.id) e.currentTarget.style.background = 'var(--border)'; }}
              onMouseLeave={e => { if (page !== item.id) e.currentTarget.style.background = 'transparent'; }}>
              <Icon name={item.icon} size={18} />
              {item.label}
              {item.id === 'chat' && <span style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', borderRadius: 999, padding: '2px 7px', fontSize: 10, fontWeight: 700 }}>AI</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{authUser?.avatar || 'U'}</div>
            <div>
              <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{authUser?.name || 'Student'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{authUser?.semester || 'Spring 2025'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setDarkMode(p => !p)} style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Icon name={darkMode ? 'sun' : 'moon'} size={15} /> {darkMode ? 'Light' : 'Dark'}
            </button>
            <button onClick={handleLogout} style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px', cursor: 'pointer', color: '#FF6584', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              ⏻ Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 240, padding: '32px 36px', minHeight: '100vh', overflow: 'auto' }}>
        {page === 'dashboard' && <Dashboard subjects={subjects} onNavigate={navigate} />}
        {page === 'notes' && <Notes subjects={subjects} />}
        {page === 'flashcards' && <Flashcards subjects={subjects} />}
        {page === 'tasks' && <Tasks subjects={subjects} />}
        {page === 'pomodoro' && <Pomodoro subjects={subjects} />}
        {page === 'chat' && <Chat />}
        {page === 'analytics' && <Analytics subjects={subjects} />}
      </div>
    </div>
  );
}
