import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Sessions = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('all');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [acceptedMatches, setAcceptedMatches] = useState([]);
  const [createForm, setCreateForm] = useState({ matchId: '', scheduledDate: '', scheduledTime: '', mode: 'ONLINE', meetingLink: '', location: '' });
  const [saving, setSaving] = useState(false);
  const [showRating, setShowRating] = useState(null);
  const [ratingForm, setRatingForm] = useState({ score: 5, feedback: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { loadSessions(); }, [tab]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const url = tab === 'all' ? '/sessions' : `/sessions?status=${tab.toUpperCase()}`;
      const res = await api.get(url);
      setSessions(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = async () => {
    try {
      const res = await api.get('/matches/accepted');
      setAcceptedMatches(res.data);
      setShowCreate(true);
    } catch (err) { console.error(err); }
  };

  const createSession = async () => {
    if (!createForm.matchId || !createForm.scheduledDate || !createForm.scheduledTime) return;
    setSaving(true);
    try {
      await api.post('/sessions', { ...createForm, matchId: Number(createForm.matchId) });
      setShowCreate(false);
      setCreateForm({ matchId: '', scheduledDate: '', scheduledTime: '', mode: 'ONLINE', meetingLink: '', location: '' });
      await loadSessions();
      flash('Session created!');
    } catch (err) { flash(err.response?.data?.message || 'Failed to create session', true); }
    finally { setSaving(false); }
  };

  const updateStatus = async (sessionId, status) => {
    try {
      await api.put(`/sessions/${sessionId}/status`, { status });
      await loadSessions();
      flash(`Session ${status.toLowerCase()}`);
    } catch (err) { flash(err.response?.data?.message || 'Failed to update', true); }
  };

  const submitRating = async () => {
    setSaving(true);
    try {
      await api.post('/ratings', { sessionId: showRating, score: ratingForm.score, feedback: ratingForm.feedback });
      setShowRating(null);
      setRatingForm({ score: 5, feedback: '' });
      await loadSessions();
      flash('Rating submitted!');
    } catch (err) { flash(err.response?.data?.message || 'Failed to submit rating', true); }
    finally { setSaving(false); }
  };

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const statusColors = {
    PENDING: 'bg-yellow-500/15 text-yellow-400',
    ACCEPTED: 'bg-blue-500/15 text-blue-400',
    COMPLETED: 'bg-green-500/15 text-green-400',
    CANCELLED: 'bg-red-500/15 text-red-400',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {msg && <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl glass text-sm text-primary-300 border border-primary-500/30 animate-fadeIn shadow-xl">{msg}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Sessions</h1>
          <p className="text-gray-400 mt-1">Schedule and manage your learning sessions</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25">
          + New Session
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((s) => {
            const otherName = s.requesterId === user?.id ? s.responderName : s.requesterName;
            const isRequester = s.requesterId === user?.id;
            const canRate = s.status === 'COMPLETED' && !(isRequester ? s.ratedByRequester : s.ratedByResponder);

            return (
              <div key={s.id} className="glass rounded-2xl p-5 hover:border-primary-500/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-base font-semibold text-white">{otherName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}>{s.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-2">
                      <span>📅 {s.scheduledDate}</span>
                      <span>🕐 {s.scheduledTime?.substring(0, 5)}</span>
                      <span>{s.mode === 'ONLINE' ? '💻 Online' : '📍 Offline'}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs bg-primary-500/10 text-primary-300">{s.requesterSkill}</span>
                      <span className="text-gray-600 text-xs">⇄</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-accent-500/10 text-accent-400">{s.responderSkill}</span>
                    </div>
                    {s.meetingLink && <p className="text-xs text-primary-400 mt-2 truncate">🔗 {s.meetingLink}</p>}
                    {s.location && <p className="text-xs text-gray-400 mt-1">📍 {s.location}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {s.status === 'PENDING' && (
                      <>
                        <button onClick={() => updateStatus(s.id, 'ACCEPTED')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-all">Accept</button>
                        <button onClick={() => updateStatus(s.id, 'CANCELLED')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">Cancel</button>
                      </>
                    )}
                    {s.status === 'ACCEPTED' && (
                      <>
                        <button onClick={() => updateStatus(s.id, 'COMPLETED')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all">Complete</button>
                        <button onClick={() => updateStatus(s.id, 'CANCELLED')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">Cancel</button>
                      </>
                    )}
                    {canRate && (
                      <button onClick={() => setShowRating(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 transition-all">⭐ Rate</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-semibold text-white mb-1">No sessions</h3>
          <p className="text-sm text-gray-400">Accept a match first, then schedule a session</p>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <h3 className="text-lg font-bold text-white mb-4">Schedule New Session</h3>
          <div className="space-y-4">
            <select value={createForm.matchId} onChange={(e) => setCreateForm({ ...createForm, matchId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
              <option value="">Select a match...</option>
              {acceptedMatches.map((m) => {
                const other = m.requesterId === user?.id ? m.responderName : m.requesterName;
                return <option key={m.id} value={m.id}>{other} — {m.requesterSkill} ⇄ {m.responderSkill}</option>;
              })}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={createForm.scheduledDate} onChange={(e) => setCreateForm({ ...createForm, scheduledDate: e.target.value })}
                className="px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              <input type="time" value={createForm.scheduledTime} onChange={(e) => setCreateForm({ ...createForm, scheduledTime: e.target.value })}
                className="px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            </div>
            <select value={createForm.mode} onChange={(e) => setCreateForm({ ...createForm, mode: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
            {createForm.mode === 'ONLINE' ? (
              <input type="url" value={createForm.meetingLink} onChange={(e) => setCreateForm({ ...createForm, meetingLink: e.target.value })}
                placeholder="Meeting link (e.g. Zoom, Google Meet)" className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            ) : (
              <input value={createForm.location} onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                placeholder="Location (e.g. Library, Room 201)" className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={createSession} disabled={saving || !createForm.matchId}
                className="flex-1 py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all disabled:opacity-50">
                {saving ? 'Creating...' : 'Schedule Session'}
              </button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Rating Modal */}
      {showRating && (
        <Modal onClose={() => setShowRating(null)}>
          <h3 className="text-lg font-bold text-white mb-4">Rate This Session</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Score</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRatingForm({ ...ratingForm, score: n })}
                    className={`w-10 h-10 rounded-lg text-lg transition-all ${ratingForm.score >= n ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-surface-900 text-gray-600 border border-white/10 hover:text-yellow-400'}`}>
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <textarea value={ratingForm.feedback} onChange={(e) => setRatingForm({ ...ratingForm, feedback: e.target.value })}
              placeholder="Share your experience (optional)" rows={3} className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            <div className="flex gap-3">
              <button onClick={submitRating} disabled={saving}
                className="flex-1 py-2.5 rounded-xl font-medium bg-gradient-to-r from-yellow-600 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-400 transition-all disabled:opacity-50">
                {saving ? 'Submitting...' : 'Submit Rating'}
              </button>
              <button onClick={() => setShowRating(null)} className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
    <div className="glass rounded-2xl p-6 w-full max-w-md animate-fadeIn" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export default Sessions;
