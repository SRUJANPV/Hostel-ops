import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'plumbing',
    description: '',
    priority: 'medium'
  });

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/complaints/my-complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch { toast.error('Failed to fetch complaints'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/complaints', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Complaint submitted! 🎉');
      setShowForm(false);
      setFormData({ title: '', category: 'plumbing', description: '', priority: 'medium' });
      fetchComplaints();
    } catch { toast.error('Failed to submit complaint'); }
    finally { setSubmitting(false); }
  };

  const getStatusConfig = (status) => {
    const map = {
      'resolved': { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500', label: 'Resolved', ring: 'ring-emerald-500/20' },
      'in-progress': { bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500', label: 'In Progress', ring: 'ring-amber-500/20' },
      'rejected': { bg: 'bg-red-100 dark:bg-red-500/15', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500', label: 'Rejected', ring: 'ring-red-500/20' },
    };
    return map[status] || { bg: 'bg-slate-100 dark:bg-gray-700', text: 'text-slate-600 dark:text-gray-300', dot: 'bg-slate-400', label: 'Pending', ring: 'ring-slate-400/20' };
  };

  const getPriorityConfig = (p) => {
    const map = { high: { icon: '🔴', label: 'High' }, medium: { icon: '🟡', label: 'Medium' }, low: { icon: '🟢', label: 'Low' } };
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

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  const resolvedPercent = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500">
      {/* Navbar */}
      <nav className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg">🏠</div>
              <h1 className="text-xl font-bold text-white">HostelOps</h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 text-[10px] font-bold bg-white/20 text-white rounded-full uppercase tracking-wider">Student</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
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
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          {[
            { label: 'Total', value: stats.total, icon: '📊', gradient: 'from-indigo-500 to-purple-500', shadow: 'shadow-indigo-500/20' },
            { label: 'Pending', value: stats.pending, icon: '⏳', gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
            { label: 'In Progress', value: stats.inProgress, icon: '🔄', gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
            { label: 'Resolved', value: stats.resolved, icon: '✅', gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
          ].map((stat) => (
            <div key={stat.label} className={`group bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg ${stat.shadow} border border-slate-100 dark:border-gray-800 hover-lift card-shine animate-slide-up`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-lg shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resolution progress */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">Resolution Rate</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{resolvedPercent}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full gradient-primary transition-all duration-1000 ease-out"
              style={{ width: `${resolvedPercent}%` }}
            />
          </div>
        </div>

        {/* Header + New Complaint */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">My Complaints</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{complaints.length} total complaints submitted</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`group px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
              showForm
                ? 'bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-300'
                : 'gradient-primary text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5'
            }`}
          >
            {showForm ? '✕ Cancel' : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                New Complaint
              </span>
            )}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-gray-800 p-8 animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-lg shadow-lg shadow-indigo-500/25">📝</div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">New Complaint</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">Fill in the details below</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text" required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="plumbing">🔧 Plumbing</option>
                    <option value="electrical">⚡ Electrical</option>
                    <option value="furniture">🪑 Furniture</option>
                    <option value="cleaning">🧹 Cleaning</option>
                    <option value="other">📋 Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Priority</label>
                  <select
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  rows="4" required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 gradient-primary text-white font-bold rounded-xl hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Submitting...
                  </span>
                ) : 'Submit Complaint →'}
              </button>
            </form>
          </div>
        )}

        {/* Complaints list */}
        <div className="space-y-4">
          {complaints.map((complaint, i) => {
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
                <div className={`h-1 bg-gradient-to-r ${cat.color}`} />
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-lg shadow-lg flex-shrink-0`}>
                        {cat.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{complaint.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text} ring-1 ${status.ring}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                            {status.label}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400">
                            {priority.icon} {priority.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-gray-500 bg-slate-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(complaint.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <p className="mt-3 text-slate-600 dark:text-gray-400 text-sm leading-relaxed pl-15">{complaint.description}</p>
                </div>
              </div>
            );
          })}

          {complaints.length === 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-800 p-16 text-center animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-4xl mb-6 animate-bounce-in">📭</div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-gray-300">No complaints yet</h3>
              <p className="text-slate-500 dark:text-gray-500 mt-2 max-w-sm mx-auto">Click the "New Complaint" button above to submit your first complaint and start tracking.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
