import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [skillForm, setSkillForm] = useState({ skillName: '', proficiencyLevel: 'BEGINNER', description: '' });
  const [skillType, setSkillType] = useState('offered');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfile(res.data);
      setEditForm({ name: res.data.name, bio: res.data.bio || '', college: res.data.college || '', availability: res.data.availability || '' });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/users/me', editForm);
      await loadProfile();
      await fetchUser();
      setEditing(false);
      flash('Profile updated!');
    } catch (err) { flash(err.response?.data?.message || 'Update failed', true); }
    finally { setSaving(false); }
  };

  const uploadPicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/users/me/profile-picture', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await loadProfile();
      await fetchUser();
      flash('Photo updated!');
    } catch (err) { flash(err.response?.data?.message || 'Upload failed', true); }
  };

  const addSkill = async () => {
    if (!skillForm.skillName.trim()) return;
    setSaving(true);
    try {
      await api.post(`/skills/${skillType}`, skillForm);
      await loadProfile();
      setShowSkillModal(false);
      setSkillForm({ skillName: '', proficiencyLevel: 'BEGINNER', description: '' });
      flash('Skill added!');
    } catch (err) { flash(err.response?.data?.message || 'Failed to add skill', true); }
    finally { setSaving(false); }
  };

  const deleteSkill = async (type, id) => {
    try {
      await api.delete(`/skills/${type}/${id}`);
      await loadProfile();
      flash('Skill removed');
    } catch (err) { flash('Failed to remove skill', true); }
  };

  const flash = (text, isError = false) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {msg && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl glass text-sm text-primary-300 border border-primary-500/30 animate-fadeIn shadow-xl">
          {msg}
        </div>
      )}

      {/* Profile Header */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            {profile.profilePicture ? (
              <img src={`http://localhost:8080${profile.profilePicture}`} alt="" className="w-24 h-24 rounded-2xl object-cover border-2 border-primary-500/30" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
              <span className="text-white text-xs font-medium">Change</span>
              <input type="file" accept="image/*" onChange={uploadPicture} className="hidden" />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="space-y-3">
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-white/10 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                <input value={editForm.college} onChange={(e) => setEditForm({ ...editForm, college: e.target.value })} placeholder="College"
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                <textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Bio" rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-white/10 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                <input value={editForm.availability} onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })} placeholder="Availability (e.g. Weekday evenings)"
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                <div className="flex gap-2">
                  <button onClick={saveProfile} disabled={saving}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(false)} className="px-4 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold text-white">{profile.name}</h1>
                <p className="text-sm text-gray-400 mt-1">{profile.college || 'No college added'}</p>
                {profile.bio && <p className="text-sm text-gray-300 mt-2">{profile.bio}</p>}
                {profile.availability && <p className="text-xs text-gray-500 mt-1">🕐 {profile.availability}</p>}
                <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                  <span className="text-sm text-yellow-400">⭐ {profile.averageRating?.toFixed(1)} ({profile.totalRatings} ratings)</span>
                  <button onClick={() => setEditing(true)} className="text-sm text-primary-400 hover:text-primary-300 transition-colors">✏️ Edit</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Offered */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">🎓 Skills I Teach</h3>
            <button onClick={() => { setSkillType('offered'); setShowSkillModal(true); }}
              className="text-xs px-3 py-1 rounded-lg bg-primary-500/15 text-primary-300 hover:bg-primary-500/25 transition-colors">+ Add</button>
          </div>
          {profile.skillsOffered?.length > 0 ? (
            <div className="space-y-2">
              {profile.skillsOffered.map((s) => (
                <SkillTag key={s.id} skill={s} onDelete={() => deleteSkill('offered', s.id)} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No skills added yet</p>
          )}
        </div>

        {/* Wanted */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">📚 Skills I Want</h3>
            <button onClick={() => { setSkillType('wanted'); setShowSkillModal(true); }}
              className="text-xs px-3 py-1 rounded-lg bg-accent-500/15 text-accent-400 hover:bg-accent-500/25 transition-colors">+ Add</button>
          </div>
          {profile.skillsWanted?.length > 0 ? (
            <div className="space-y-2">
              {profile.skillsWanted.map((s) => (
                <SkillTag key={s.id} skill={s} onDelete={() => deleteSkill('wanted', s.id)} accent />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowSkillModal(false)}>
          <div className="glass rounded-2xl p-6 w-full max-w-md animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">
              Add {skillType === 'offered' ? 'Skill I Teach' : 'Skill I Want'}
            </h3>
            <div className="space-y-4">
              <input value={skillForm.skillName} onChange={(e) => setSkillForm({ ...skillForm, skillName: e.target.value })}
                placeholder="Skill name (e.g. Java, Photoshop)" className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              <select value={skillForm.proficiencyLevel} onChange={(e) => setSkillForm({ ...skillForm, proficiencyLevel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
              <textarea value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                placeholder="Brief description (optional)" rows={2} className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              <div className="flex gap-3">
                <button onClick={addSkill} disabled={saving || !skillForm.skillName.trim()}
                  className="flex-1 py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add Skill'}
                </button>
                <button onClick={() => setShowSkillModal(false)} className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SkillTag = ({ skill, onDelete, accent = false }) => (
  <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${accent ? 'bg-accent-500/10 border border-accent-500/15' : 'bg-primary-500/10 border border-primary-500/15'}`}>
    <div>
      <span className={`text-sm font-medium ${accent ? 'text-accent-300' : 'text-primary-300'}`}>{skill.skillName}</span>
      <span className="text-xs text-gray-500 ml-2">{skill.proficiencyLevel}</span>
    </div>
    <button onClick={onDelete} className="text-gray-500 hover:text-red-400 transition-colors text-sm ml-2">✕</button>
  </div>
);

export default Profile;
