import React, { useState, useEffect } from 'react';
import { getAllReports, updateReportStatus, deleteReport } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      const res = await getAllReports();
      setReports(res.data);
    } catch (err) {
      setError('Failed to load reports.');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateReportStatus(id, newStatus);
      setReports(reports.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await deleteReport(id);
      setReports(reports.filter(r => r._id !== id));
    } catch (err) {
      alert('Failed to delete report.');
    }
  };

  const statusStyle = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-green-50 text-green-700 border-green-200',
  };

  const wasteIcons = { Plastic: '🥤', Organic: '🍎', Metal: '🔩', Medical: '💉', Other: '🗑️' };

  const filterCounts = {
    All: reports.length,
    Pending: reports.filter(r => r.status === 'Pending').length,
    'In Progress': reports.filter(r => r.status === 'In Progress').length,
    Completed: reports.filter(r => r.status === 'Completed').length,
  };

  const filteredReports = filter === 'All' ? reports : reports.filter(r => r.status === filter);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Reports</h1>
          <p className="text-gray-500 mt-1">View, update and manage all waste reports</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <button key={status} onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${filter === status ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {status}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filter === status ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {filterCounts[status]}
              </span>
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner message="Loading reports..." /> : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-sm">{error}</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['ID', 'User', 'Waste Type', 'Location', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-400">#{report._id?.slice(-6)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                            {report.user_name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{report.user_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span>{wasteIcons[report.waste_type] || '🗑️'}</span>
                          <span className="text-sm font-medium text-gray-700">{report.waste_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{report.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle[report.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select value={report.status} onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
                            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-green-500 bg-white text-gray-700">
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <button onClick={() => handleDelete(report._id)}
                            className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-red-100">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredReports.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p className="font-medium">No reports found for "{filter}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
