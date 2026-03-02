import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';

// Get API URL from environment variable or use localhost as fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Register() {
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    room_number: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, { ...formData, role });
      toast.success('Account created! Please login 🎉');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-950 transition-colors duration-500">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden" style={{background: 'linear-gradient(135deg, #f093fb 0%, #764ba2 50%, #667eea 100%)', backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite'}}>
        {/* Animated orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-16 right-16 w-72 h-72 bg-white/10 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-24 left-16 w-64 h-64 bg-cyan-300/10 rounded-full blur-2xl animate-float-delayed" />
          <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-pink-200/10 rounded-full blur-lg animate-float-slow" />
          <div className="absolute bottom-10 right-32 w-28 h-28 bg-yellow-300/10 rounded-full blur-lg animate-pulse-slow" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white max-w-xl">
          <div className="animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-8 animate-glow">
              ✨
            </div>
            <h1 className="text-6xl font-black mb-4 leading-tight">
              Join the<br/>
              <span className="text-white/80">Community</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-12 max-w-md">
              Create your account and be part of a smarter hostel management experience.
            </p>
          </div>

          <div className="space-y-4 animate-fade-in">
            {[
              { icon: '🚀', title: 'Quick Setup', desc: 'Get started in under a minute' },
              { icon: '🔔', title: 'Stay Updated', desc: 'Real-time complaint tracking' },
              { icon: '🛡️', title: 'Secure', desc: 'Your data is always protected' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover-lift animate-slide-up">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="font-bold text-sm">{item.title}</div>
                  <div className="text-white/50 text-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-8 relative">
        <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark opacity-50" />

        <div className="w-full max-w-md relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-xl">✨</div>
              <span className="text-xl font-bold text-gradient-accent">HostelOps</span>
            </div>
            <div className="lg:ml-auto">
              <ThemeToggle />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/30 dark:shadow-black/30 p-8 sm:p-10 border border-white/50 dark:border-gray-800/50 animate-scale-in">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Create account</h2>
              <p className="text-slate-500 dark:text-gray-400 mt-2">Start managing your hostel experience</p>
            </div>

            {/* Role toggle */}
            <div className="relative flex bg-slate-100 dark:bg-gray-800/80 rounded-2xl p-1.5 mb-8">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-500 ease-out ${
                  role === 'student' ? 'left-1.5 gradient-primary shadow-lg shadow-indigo-500/25' : 'left-[calc(50%+3px)] gradient-accent shadow-lg shadow-pink-500/25'
                }`}
              />
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`relative z-10 flex-1 py-3 text-sm font-bold rounded-xl transition-colors duration-300 ${
                  role === 'student' ? 'text-white' : 'text-slate-500 dark:text-gray-400'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`relative z-10 flex-1 py-3 text-sm font-bold rounded-xl transition-colors duration-300 ${
                  role === 'admin' ? 'text-white' : 'text-slate-500 dark:text-gray-400'
                }`}
              >
                🛡️ Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">👤</span>
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Email address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">✉️</span>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                    <input
                      type="password"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                      placeholder="••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Room No.</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🚪</span>
                    <input
                      type="text"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                      placeholder="101"
                      value={formData.room_number}
                      onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`relative w-full py-4 px-4 text-white font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 mt-2 overflow-hidden ${
                  loading ? 'opacity-80 cursor-wait' : 'hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0'
                } ${role === 'student' ? 'gradient-primary' : 'gradient-accent'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-gray-700" />
              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-gray-700" />
            </div>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors underline decoration-2 decoration-indigo-200 dark:decoration-indigo-800 underline-offset-4 hover:decoration-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
