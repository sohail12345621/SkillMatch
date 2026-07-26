import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Matches = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('suggested');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { loadMatches(); }, [tab]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      let res;
      if (tab === 'suggested') {
        res = await api.get('/matches/suggestions');
      } else if (tab === 'accepted') {
        res = await api.get('/matches/accepted');
      } else {
        res = await api.get('/matches');
      }
      setMatches(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (matchId, action) => {
    setActionLoading(matchId);
    try {
      await api.post(`/matches/${matchId}/${action}`);
      await loadMatches();
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  const tabs = [
    { key: 'suggested', label: 'Suggested', icon: '🎯' },
    { key: 'accepted', label: 'Accepted', icon: '✅' },
    { key: 'all', label: 'All', icon: '📋' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-2">Matches</h1>
      <p className="text-gray-400 mb-6">Find skill exchange partners and manage your matches</p>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-6 w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:text-white'}`}>
            <span className="mr-1.5">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map((match) => {
            const isRequester = match.requesterId === user?.id;
            const other = isRequester
              ? { id: match.responderId, name: match.responderName, email: match.responderEmail, college: match.responderCollege, rating: match.responderRating, pic: match.responderProfilePicture }
              : { id: match.requesterId, name: match.requesterName, email: match.requesterEmail, college: match.requesterCollege, rating: match.requesterRating, pic: match.requesterProfilePicture };
            const theyTeach = isRequester ? match.responderSkill : match.requesterSkill;
            const theyLearn = isRequester ? match.requesterSkill : match.responderSkill;

            const statusColors = {
              SUGGESTED: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
              ACCEPTED: 'bg-green-500/15 text-green-400 border-green-500/20',
              REJECTED: 'bg-red-500/15 text-red-400 border-red-500/20',
            };

            return (
              <div key={match.id} className="glass rounded-2xl p-5 hover:border-primary-500/30 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {other.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-white">{other.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[match.status]}`}>
                        {match.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{other.college || 'No college'} {other.rating > 0 && `· ⭐ ${other.rating.toFixed(1)}`}</p>

                    {/* Skill Exchange */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-500/15 text-primary-300 border border-primary-500/20">
                        Teaches: {theyTeach}
                      </span>
                      <span className="text-gray-600">⇄</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-accent-500/15 text-accent-400 border border-accent-500/20">
                        Wants: {theyLearn}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {match.status === 'SUGGESTED' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleAction(match.id, 'accept')} disabled={actionLoading === match.id}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25 transition-all disabled:opacity-50">
                        ✓ Accept
                      </button>
                      <button onClick={() => handleAction(match.id, 'reject')} disabled={actionLoading === match.id}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-all disabled:opacity-50">
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">{tab === 'suggested' ? '🔍' : tab === 'accepted' ? '🤝' : '📋'}</div>
          <h3 className="text-lg font-semibold text-white mb-1">No {tab} matches</h3>
          <p className="text-sm text-gray-400">
            {tab === 'suggested' ? 'Add more skills to your profile to discover matches!' : 'Accept suggested matches to see them here.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Matches;
