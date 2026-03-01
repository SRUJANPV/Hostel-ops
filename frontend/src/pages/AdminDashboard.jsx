import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState({ status: 'all', category: 'all' });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/complaints/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch { toast.error('Failed to fetch complaints'); }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/complaints/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Status updated to ${status} ✅`);
      fetchComplaints();
    } catch { toast.error('Failed to update'); }
    finally { setUpdatingId(null); }
  };

  const getStatusConfig = (status) => {
    const map = {
      'resolved': { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500', label: 'Resolved', ring: 'ring-emerald-500/20', gradient: 'from-emerald-500 to-teal-500' },
      'in-progress': { bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500', label: 'In Progress', ring: 'ring-amber-500/20', gradient: 'from-amber-500 to-orange-500' },
      'rejected': { bg: 'bg-red-100 dark:bg-red-500/15', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500', label: 'Rejected', ring: 'ring-red-500/20', gradient: 'from-red-500 to-pink-500' },
    };
    return map[status] || { bg: 'bg-slate-100 dark:bg-gray-700', text: 'text-slate-600 dark:text-gray-300', dot: 'bg-slate-400', label: 'Pending', ring: 'ring-slate-400/20', gradient: 'from-slate-400 to-gray-400' };
  };

  const getPriorityConfig = (p) => {
    const map = { high: { icon: '🔴', label: 'High', color: 'text-red-600 dark:text-red-400' }, medium: { icon: '🟡', label: 'Medium', color: 'text-amber-600 dark:text-amber-400' }, low: { icon: '🟢', label: 'Low', color: 'text-emerald-600 dark:text-emerald-400' } };
    return map[p] || map.medium;
  };

  const getCategoryConfig = (c) => {
    const map = {
      plumbing: { icon: '🔧', color: 'from-blue-500 to-cyan-500' },
      electrical: { icon: '⚡', color: 'from-yellow-500 to-orange-500' },
      furniture: { icon: '🪑', color: 'from-amber-600 to-yellow-600' },
      cleaning: { icon: '🧹', color: 'from-emerald-500 to-teal-500' },
    };
    return map[c] || { icon: '📋', color: 'from-slate-500 to-gray-500' };
  };

  const filteredComplaints = complaints.filter(c => {
    if (filter.status !== 'all' && c.status !== filter.status) return false;
    if (filter.category !== 'all' && c.category !== filter.category) return false;
    return true;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
  };

  const resolvedPercent = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500">
      {/* Navbar */}
      <nav className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-lg border border-white/10">🛡️</div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/30 text-indigo-200 rounded-full uppercase tracking-wider border border-indigo-400/20">Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white/90 text-sm font-medium">{user?.username}</span>
              </div>
              <button onClick={logout} className="px-3.5 py-1.5 text-sm font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 stagger-children">
          {[
            { label: 'Total', value: stats.total, icon: '📊', gradient: 'from-indigo-500 to-purple-500', shadow: 'shadow-indigo-500/20' },
            { label: 'Pending', value: stats.pending, icon: '⏳', gradient: 'from-slate-400 to-gray-500', shadow: 'shadow-slate-400/20' },
            { label: 'In Progress', value: stats.inProgress, icon: '🔄', gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
            { label: 'Resolved', value: stats.resolved, icon: '✅', gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
            { label: 'Rejected', value: stats.rejected, icon: '❌', gradient: 'from-red-500 to-pink-500', shadow: 'shadow-red-500/20' },
          ].map((stat) => (
            <div key={stat.label} className={`group bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg ${stat.shadow} border border-slate-100 dark:border-gray-800 hover-lift card-shine animate-slide-up`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-2xl font-black text-slate-800 dark:text-white">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">{stat.label}</div>
                </div>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-sm shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resolution rate bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-700 dark:text-gray-300">Overall Resolution Rate</span>
              <span className="text-xs text-slate-400 dark:text-gray-500">({stats.resolved} of {stats.total})</span>
            </div>
            <span className={`text-sm font-black ${resolvedPercent >= 70 ? 'text-emerald-500' : resolvedPercent >= 40 ? 'text-amber-500' : 'text-red-500'}`}>{resolvedPercent}%</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative" style={{ width: `${resolvedPercent}%` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-800 p-5 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-sm">🔍</div>
              <span className="text-sm font-bold text-slate-700 dark:text-gray-300">Filters</span>
            </div>
            <div className="flex flex-wrap gap-3 flex-1">
              <select
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="resolved">✅ Resolved</option>
                <option value="rejected">❌ Rejected</option>
              </select>
              <select
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                <option value="plumbing">🔧 Plumbing</option>
                <option value="electrical">⚡ Electrical</option>
                <option value="furniture">🪑 Furniture</option>
                <option value="cleaning">🧹 Cleaning</option>
                <option value="other">📋 Other</option>
              </select>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto bg-slate-50 dark:bg-gray-800 px-3 py-2 rounded-xl">
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                {filteredComplaints.length}
              </span>
              <span className="text-xs text-slate-400 dark:text-gray-500">of {complaints.length} shown</span>
            </div>
          </div>
        </div>

        {/* Complaints */}
        <div className="space-y-4">
          {filteredComplaints.map((complaint, i) => {
            const status = getStatusConfig(complaint.status);
            const priority = getPriorityConfig(complaint.priority);
            const cat = getCategoryConfig(complaint.category);
            return (
              <div
                key={complaint.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Colored top bar */}
                <div className={`h-1 bg-gradient-to-r ${status.gradient}`} />
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-lg shadow-lg flex-shrink-0`}>
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{complaint.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text} ring-1 ${status.ring}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                            {status.label}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-gray-800 ${priority.color}`}>
                            {priority.icon} {priority.label}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-gray-500 capitalize bg-slate-50 dark:bg-gray-800 px-2.5 py-1 rounded-full font-medium">
                            {complaint.category}
                          </span>
                        </div>
                        <p className="mt-3 text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{complaint.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-[9px] text-white font-bold">
                              {(complaint.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{complaint.username || 'Unknown'}</span>
                          </div>
                          {complaint.room_number && (
                            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500">
                              🚪 <span className="font-medium">Room {complaint.room_number}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {new Date(complaint.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status update */}
                    <div className="flex-shrink-0 lg:ml-4">
                      <div className="relative">
                        <select
                          value={complaint.status}
                          onChange={(e) => updateStatus(complaint.id, e.target.value)}
                          disabled={updatingId === complaint.id}
                          className={`appearance-none pl-4 pr-10 py-3 rounded-xl border-2 text-sm font-bold cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                            updatingId === complaint.id
                              ? 'opacity-60 cursor-wait border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-400'
                              : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500'
                          }`}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="in-progress">🔄 In Progress</option>
                          <option value="resolved">✅ Resolved</option>
                          <option value="rejected">❌ Rejected</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          {updatingId === complaint.id ? (
                            <svg className="animate-spin h-4 w-4 text-indigo-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          ) : (
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredComplaints.length === 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-800 p-16 text-center animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-4xl mb-6 animate-bounce-in">📭</div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-gray-300">No complaints found</h3>
              <p className="text-slate-500 dark:text-gray-500 mt-2 max-w-sm mx-auto">Try adjusting the filters to see more results.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
