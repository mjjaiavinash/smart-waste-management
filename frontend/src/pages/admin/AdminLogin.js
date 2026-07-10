import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(formData);
      const { token, user } = res.data;
      if (user.role !== 'admin') { setError('Access denied. Admins only.'); setLoading(false); return; }
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userId', user.id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Portal</h2>
          <p className="text-gray-500 mt-2">Sign in to access the admin dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10">
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 mb-6">
            <span className="text-purple-600 text-sm font-medium">🔐 Restricted access — Admins only</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400 transition text-sm"
                placeholder="Enter admin email" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400 transition text-sm pr-12"
                  placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 text-sm">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-sm disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500 text-sm">
            Not an admin?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">User Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
