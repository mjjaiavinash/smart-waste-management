import React, { useState, useEffect } from 'react';
import { getAllUsers, createAdmin, deleteUser } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadAdmins(); }, []);

  const loadAdmins = async () => {
    try {
      const res = await getAllUsers();
      setAdmins(res.data.filter(u => u.role === 'admin'));
    } catch (err) {
      setError('Failed to load admins.');
    }
    setLoading(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      await createAdmin(formData);
      setSuccess('Admin created successfully!');
      setFormData({ name: '', email: '', password: '' });
      loadAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    try {
      await deleteUser(id);
      setAdmins(admins.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete admin.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Admins</h1>
          <p className="text-gray-500 mt-1">Create and manage admin accounts</p>
        </div>

        {/* Create Admin Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Create New Admin</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required
              placeholder="Full Name"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              placeholder="Email Address"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} required
              placeholder="Password"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50" />
            {error && <p className="md:col-span-3 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>}
            {success && <p className="md:col-span-3 text-green-600 text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-100">{success}</p>}
            <button type="submit" disabled={submitting}
              className="md:col-span-3 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm transition disabled:opacity-60">
              {submitting ? 'Creating...' : 'Create Admin'}
            </button>
          </form>
        </div>

        {/* Admins List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">All Admins</h2>
          </div>
          {loading ? <LoadingSpinner message="Loading admins..." /> : admins.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">👤</div>
              <p className="font-medium">No admins found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {admins.map((admin) => (
                <div key={admin._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-700">
                      {admin.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{admin.name}</p>
                      <p className="text-xs text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{new Date(admin.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => handleDelete(admin._id)}
                      className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-red-100">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;
