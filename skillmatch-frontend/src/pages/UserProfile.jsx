import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const [userRes, ratingsRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/ratings/user/${id}`),
      ]);
      setProfile(userRes.data);
      setRatings(ratingsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!profile) return <div className="min-h-[70vh] flex items-center justify-center"><p className="text-gray-400">User not found</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {profile.profilePicture ? (
            <img src={`http://localhost:8080${profile.profilePicture}`} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-500/30" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-white">{profile.name}</h1>
            <p className="text-sm text-gray-400 mt-1">{profile.college || 'No college'}</p>
            {profile.bio && <p className="text-sm text-gray-300 mt-2">{profile.bio}</p>}
            {profile.availability && <p className="text-xs text-gray-500 mt-1">🕐 {profile.availability}</p>}
            <p className="text-sm text-yellow-400 mt-2">⭐ {profile.averageRating?.toFixed(1)} ({profile.totalRatings} ratings)</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">🎓 Teaches</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skillsOffered?.length > 0 ? profile.skillsOffered.map((s) => (
              <span key={s.id} className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/15 text-primary-300 border border-primary-500/20">{s.skillName}</span>
            )) : <p className="text-xs text-gray-500">No skills</p>}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">📚 Wants to Learn</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skillsWanted?.length > 0 ? profile.skillsWanted.map((s) => (
              <span key={s.id} className="px-3 py-1 rounded-full text-xs font-medium bg-accent-500/15 text-accent-400 border border-accent-500/20">{s.skillName}</span>
            )) : <p className="text-xs text-gray-500">No skills</p>}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {ratings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">💬 Reviews ({ratings.length})</h3>
          <div className="space-y-3">
            {ratings.map((r) => (
              <div key={r.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{r.raterName}</span>
                  <span className="text-sm text-yellow-400">{'⭐'.repeat(r.score)}</span>
                </div>
                {r.feedback && <p className="text-sm text-gray-400">{r.feedback}</p>}
                <p className="text-xs text-gray-600 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
