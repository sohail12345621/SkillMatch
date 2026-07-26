import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('users');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      let res;
      if (tab === 'users') {
        res = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
      } else {
        res = await api.get(`/skills/search?query=${encodeURIComponent(query)}`);
      }
      setResults(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-2">Search</h1>
      <p className="text-gray-400 mb-6">Find users by name, college, or search for specific skills</p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={tab === 'users' ? 'Search by name or college...' : 'Search by skill name...'}
              className="w-full px-4 py-3 pl-10 rounded-xl bg-surface-900/80 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button type="submit" disabled={loading || !query.trim()}
            className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all disabled:opacity-50">
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-6 w-fit">
        <button onClick={() => switchTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'users' ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:text-white'}`}>
          👤 Users
        </button>
        <button onClick={() => switchTab('skills')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'skills' ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:text-white'}`}>
          💡 Skills
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : searched && results.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-1">No results found</h3>
          <p className="text-sm text-gray-400">Try a different search term</p>
        </div>
      ) : tab === 'users' ? (
        <div className="space-y-3">
          {results.map((u) => (
            <Link key={u.id} to={`/users/${u.id}`} className="block glass rounded-xl p-4 hover:border-primary-500/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shrink-0">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">{u.name}</h3>
                  <p className="text-xs text-gray-500">{u.college || 'No college'} {u.averageRating > 0 && `· ⭐ ${u.averageRating.toFixed(1)}`}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0 max-w-[200px]">
                  {u.skillsOffered?.slice(0, 3).map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded-full text-xs bg-primary-500/15 text-primary-300">{s.skillName}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((s, i) => (
            <div key={`${s.id}-${i}`} className="glass rounded-xl p-4 hover:border-primary-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-white">{s.skillName}</span>
                  <span className="text-xs text-gray-500 ml-2">{s.proficiencyLevel}</span>
                  {s.description && <p className="text-xs text-gray-400 mt-1">{s.description}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">by <span className="text-primary-300">{s.userName}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prompt if not searched yet */}
      {!searched && !loading && (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-1">Discover Skills & People</h3>
          <p className="text-sm text-gray-400">Search by user name, college, or skill to find exchange partners</p>
        </div>
      )}
    </div>
  );
};

export default Search;
