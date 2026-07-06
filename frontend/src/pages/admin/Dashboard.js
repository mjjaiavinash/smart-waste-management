import React, { useState, useEffect } from 'react';
import { getAllReports, getAllUsers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const StatCard = ({ title, value, icon, color, bg }) => (
  <div className={`${bg} rounded-2xl p-6 border border-gray-100`}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</span>
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white text-lg shadow-sm`}>{icon}</div>
    </div>
    <p className="text-4xl font-extrabold text-gray-900">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalReports: 0, pendingReports: 0, inProgressReports: 0, completedReports: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminName = localStorage.getItem('userName');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllReports();
        const reports = res.data;
        setStats({
          totalReports: reports.length,
          pendingReports: reports.filter(r => r.status === 'Pending').length,
          inProgressReports: reports.filter(r => r.status === 'In Progress').length,
          completedReports: reports.filter(r => r.status === 'Completed').length,
        });
        setRecentReports(reports.slice(0, 8));
        const usersRes = await getAllUsers();
        setUsers(usersRes.data.filter(u => u.role === 'user'));
      } catch (err) {
        console.error('Failed to load dashboard data.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statusStyle = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-green-50 text-green-700 border-green-200',
  };

  const wasteIcons = { Plastic: '🥤', Organic: '🍎', Metal: '🔩', Medical: '💉', Other: '🗑️' };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, <span className="text-green-600 font-semibold">{adminName}</span></p>
          </div>
          <button onClick={() => navigate('/admin/reports')}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
            View All Reports →
          </button>
        </div>

        {loading ? <LoadingSpinner message="Loading dashboard..." /> : (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <StatCard title="Total Reports" value={stats.totalReports} icon="📊" color="bg-blue-600" bg="bg-white" />
              <StatCard title="Pending" value={stats.pendingReports} icon="⏳" color="bg-yellow-500" bg="bg-white" />
              <StatCard title="In Progress" value={stats.inProgressReports} icon="🔄" color="bg-indigo-500" bg="bg-white" />
              <StatCard title="Completed" value={stats.completedReports} icon="✅" color="bg-green-600" bg="bg-white" />
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Reports</h2>
                <button onClick={() => navigate('/admin/reports')} className="text-sm text-green-600 hover:text-green-700 font-semibold">View all →</button>
              </div>
              {recentReports.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-medium">No reports yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentReports.map((report) => (
                    <div key={report._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">
                          {wasteIcons[report.waste_type] || '🗑️'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{report.waste_type} — {report.location}</p>
                          <p className="text-xs text-gray-400 mt-0.5">by {report.user_name} · #{report._id?.slice(-6)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle[report.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {report.status}
                        </span>
                        <span className="text-xs text-gray-400 hidden sm:block">{new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registered Users */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Registered Users</h2>
              </div>
              {users.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-3">👥</div>
                  <p className="font-medium">No users yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
