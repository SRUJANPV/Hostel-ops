import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      
      const response = await axios.get(`${API_URL}/api/complaints/all?${params}`, {
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

  const updateStatus = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/complaints/${complaintId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated successfully');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      console.error('Update status error:', error);
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

  const getStatusCount = (status) => {
    return complaints.filter(c => c.status === status).length;
  };

  if (loading && complaints.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaints...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Admin,</p>
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complaint Management</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{getStatusCount('in-progress')}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{getStatusCount('resolved')}</p>
              </div>
            </div>
            
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Complaints</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="">All Status</option>
                    <option value="pending">🕒 Pending</option>
                    <option value="in-progress">⚙️ In Progress</option>
                    <option value="resolved">✅ Resolved</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Category</label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    <option value="plumbing">🚰 Plumbing</option>
                    <option value="electrical">⚡ Electrical</option>
                    <option value="furniture">🪑 Furniture</option>
                    <option value="cleaning">🧹 Cleaning</option>
                    <option value="other">📌 Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Complaints List */}
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
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                                {complaint.status}
                              </span>
                              <select
                                value={complaint.status}
                                onChange={(e) => updateStatus(complaint.id, e.target.value)}
                                className="ml-2 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                            <div className="space-y-1">
                              <p><span className="font-medium text-gray-500">Student:</span> {complaint.username}</p>
                              <p><span className="font-medium text-gray-500">Room:</span> {complaint.room_number || 'N/A'}</p>
                              <p><span className="font-medium text-gray-500">Category:</span> {complaint.category}</p>
                            </div>
                            <div className="space-y-1">
                              <p><span className="font-medium text-gray-500">Priority:</span> 
                                <span className={`ml-1 ${getPriorityColor(complaint.priority)}`}>
                                  {complaint.priority}
                                </span>
                              </p>
                              <p><span className="font-medium text-gray-500">Submitted:</span> {new Date(complaint.created_at).toLocaleString()}</p>
                              {complaint.updated_at !== complaint.created_at && (
                                <p><span className="font-medium text-gray-500">Updated:</span> {new Date(complaint.updated_at).toLocaleString()}</p>
                              )}
                            </div>
                          </div>

                          <div className="mt-2">
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm">{complaint.description}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  {complaints.length === 0 && (
                    <li className="px-6 py-12 text-center text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="mt-2">No complaints found matching your filters</p>
                      <button
                        onClick={() => setFilters({ status: '', category: '' })}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear filters
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}