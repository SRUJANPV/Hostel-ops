import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    category: 'plumbing',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/complaints/my-complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
      console.error('Fetch complaints error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/complaints`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Complaint submitted successfully');
      setShowForm(false);
      setFormData({ title: '', category: 'plumbing', description: '', priority: 'medium' });
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
      console.error('Submit complaint error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 font-semibold';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (loading && complaints.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome,</p>
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                {user?.room_number && (
                  <p className="text-xs text-gray-500">Room: {user.room_number}</p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Complaints</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              {showForm ? (
                <>Cancel</>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Complaint
                </>
              )}
            </button>
          </div>

          {showForm && (
            <div className="mb-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Submit New Complaint</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Brief title of your complaint"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="plumbing">🚰 Plumbing</option>
                      <option value="electrical">⚡ Electrical</option>
                      <option value="furniture">🪑 Furniture</option>
                      <option value="cleaning">🧹 Cleaning</option>
                      <option value="other">📌 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows="4"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your complaint in detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit Complaint
                </button>
              </form>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading...</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <li key={complaint.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-4">
                          <span className="flex items-center">
                            <span className="font-medium mr-1">Category:</span> 
                            {complaint.category}
                          </span>
                          <span className={`flex items-center font-medium ${getPriorityColor(complaint.priority)}`}>
                            <span className="mr-1">Priority:</span> 
                            {complaint.priority}
                          </span>
                          <span className="flex items-center">
                            <span className="font-medium mr-1">Submitted:</span> 
                            {new Date(complaint.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600 bg-gray-50 p-3 rounded-md">{complaint.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
                {complaints.length === 0 && (
                  <li className="px-6 py-12 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2">No complaints submitted yet</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Submit your first complaint
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}