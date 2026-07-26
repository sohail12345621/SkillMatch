import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setDashboard(res.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const d = dashboard;
  const profile = d?.user;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-gray-400 mt-1">Here's your skill exchange overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🤝" label="Total Matches" value={d?.totalMatches || 0} color="from-primary-500/20 to-primary-600/10" />
        <StatCard icon="📅" label="Total Sessions" value={d?.totalSessions || 0} color="from-accent-500/20 to-accent-600/10" />
        <StatCard icon="📚" label="Skills Offered" value={profile?.skillsOffered?.length || 0} color="from-emerald-500/20 to-emerald-600/10" />
        <StatCard icon="⭐" label="Rating" value={profile?.averageRating?.toFixed(1) || '0.0'} color="from-amber-500/20 to-amber-600/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggested Matches */}
        <div className="lg:col-span-2">
          <SectionHeader title="Suggested Matches" icon="🎯" link="/matches" linkText="View All" />
          {d?.suggestedMatches?.length > 0 ? (
            <div className="space-y-3">
              {d.suggestedMatches.slice(0, 4).map((match) => (
                <MatchCard key={match.id} match={match} currentUserId={user?.id} />
              ))}
            </div>
          ) : (
            <EmptyState message="No matches yet. Add more skills to get matched!" icon="🔍" />
          )}
        </div>

        {/* My Skills */}
        <div>
          <SectionHeader title="My Skills" icon="💡" link="/profile" linkText="Manage" />
          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">I Can Teach</h4>
              {profile?.skillsOffered?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered.map((s) => (
                    <span key={s.id} className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/15 text-primary-300 border border-primary-500/20">
                      {s.skillName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added yet</p>
              )}
            </div>
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">I Want to Learn</h4>
              {profile?.skillsWanted?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skillsWanted.map((s) => (
                    <span key={s.id} className="px-3 py-1 rounded-full text-xs font-medium bg-accent-500/15 text-accent-400 border border-accent-500/20">
                      {s.skillName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added yet</p>
              )}
            </div>
            <Link to="/profile" className="block text-center text-sm text-primary-400 hover:text-primary-300 pt-2 transition-colors">
              + Add Skills
            </Link>
          </div>
        </div>
      </div>

      {/* Sessions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Upcoming Sessions */}
        <div>
          <SectionHeader title="Upcoming Sessions" icon="📅" link="/sessions" linkText="View All" />
          {d?.upcomingSessions?.length > 0 ? (
            <div className="space-y-3">
              {d.upcomingSessions.slice(0, 3).map((s) => (
                <SessionCard key={s.id} session={s} currentUserId={user?.id} />
              ))}
            </div>
          ) : (
            <EmptyState message="No upcoming sessions" icon="📅" />
          )}
        </div>

        {/* Completed Sessions */}
        <div>
          <SectionHeader title="Completed Sessions" icon="✅" link="/sessions" linkText="View All" />
          {d?.completedSessions?.length > 0 ? (
            <div className="space-y-3">
              {d.completedSessions.slice(0, 3).map((s) => (
                <SessionCard key={s.id} session={s} currentUserId={user?.id} />
              ))}
            </div>
          ) : (
            <EmptyState message="No completed sessions yet" icon="✅" />
          )}
        </div>
      </div>
    </div>
  );
};

// ===== Sub-components =====

const StatCard = ({ icon, label, value, color }) => (
  <div className={`glass rounded-2xl p-5 bg-gradient-to-br ${color}`}>
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-gray-400 mt-0.5">{label}</div>
  </div>
);

const SectionHeader = ({ title, icon, link, linkText }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-white">
      <span className="mr-2">{icon}</span>{title}
    </h3>
    {link && (
      <Link to={link} className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
        {linkText} →
      </Link>
    )}
  </div>
);

const MatchCard = ({ match, currentUserId }) => {
  const isRequester = match.requesterId === currentUserId;
  const other = isRequester
    ? { name: match.responderName, college: match.responderCollege, rating: match.responderRating, pic: match.responderProfilePicture }
    : { name: match.requesterName, college: match.requesterCollege, rating: match.requesterRating, pic: match.requesterProfilePicture };
  const theyTeach = isRequester ? match.responderSkill : match.requesterSkill;
  const theyLearn = isRequester ? match.requesterSkill : match.responderSkill;

  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4 hover:border-primary-500/30 transition-all group">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
        {other.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{other.name}</p>
        <p className="text-xs text-gray-500">{other.college || 'No college'} {other.rating > 0 && `· ⭐ ${other.rating.toFixed(1)}`}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-primary-300">Teaches <span className="font-medium">{theyTeach}</span></p>
        <p className="text-xs text-accent-400">Wants <span className="font-medium">{theyLearn}</span></p>
      </div>
    </div>
  );
};

const SessionCard = ({ session, currentUserId }) => {
  const otherName = session.requesterId === currentUserId ? session.responderName : session.requesterName;
  const statusColors = {
    PENDING: 'bg-yellow-500/15 text-yellow-400',
    ACCEPTED: 'bg-blue-500/15 text-blue-400',
    COMPLETED: 'bg-green-500/15 text-green-400',
    CANCELLED: 'bg-red-500/15 text-red-400',
  };
  return (
    <div className="glass rounded-xl p-4 hover:border-primary-500/30 transition-all">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-white">{otherName}</p>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
          {session.status}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>📅 {session.scheduledDate}</span>
        <span>🕐 {session.scheduledTime?.substring(0, 5)}</span>
        <span>{session.mode === 'ONLINE' ? '💻 Online' : '📍 Offline'}</span>
      </div>
    </div>
  );
};

const EmptyState = ({ message, icon }) => (
  <div className="glass rounded-2xl p-8 text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

const Loader = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Dashboard;
