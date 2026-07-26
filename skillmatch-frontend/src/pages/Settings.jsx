import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Settings = () => {
  const { user, updateUser, logout, fetchUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    college: user?.college || '',
    availability: user?.availability || '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/me', form);
      await fetchUser();
      flash('Settings saved successfully!');
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to save', true);
    } finally {
      setSaving(false);
    }
  };

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-surface-900/80 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {msg && <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl glass text-sm text-primary-300 border border-primary-500/30 animate-fadeIn shadow-xl">{msg}</div>}

      <h1 className="text-3xl font-extrabold text-white mb-2">Settings</h1>
      <p className="text-gray-400 mb-8">Manage your account preferences</p>

      {/* Profile Settings */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-5">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">College</label>
            <input type="text" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })}
              placeholder="Your college" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3} placeholder="Tell others about yourself..." className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Availability</label>
            <input type="text" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}
              placeholder="e.g. Weekday evenings, weekends" className={inputClass} />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">Email</span>
            <span className="text-sm text-white">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <span className="text-sm text-gray-400">Member since</span>
            <span className="text-sm text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <span className="text-sm text-gray-400">Rating</span>
            <span className="text-sm text-yellow-400">⭐ {user?.averageRating?.toFixed(1) || '0.0'} ({user?.totalRatings || 0} ratings)</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-2xl p-6 border-red-500/20">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
        <p className="text-sm text-gray-400 mb-4">Logging out will clear your session. You can log back in anytime.</p>
        <button onClick={logout}
          className="px-6 py-2.5 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-all">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
