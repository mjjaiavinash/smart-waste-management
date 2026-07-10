import React, { useState, useEffect } from 'react';
import ReportCard from '../../components/ReportCard';
import { getMyReports } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getMyReports();
        setReports(res.data);
      } catch (err) {
        setError('Failed to load reports.');
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  const filtered = filter === 'All' ? reports : reports.filter(r => r.status === filter);

  return (
    <div className="bg-gray-100 py-10 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Reports</h1>
            <p className="text-gray-500 mt-1">Track all your submitted waste reports</p>
          </div>
          <button onClick={() => navigate('/report')}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
            + New Report
          </button>
        </div>

        {/* Stats */}
        {!loading && reports.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: reports.length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
              { label: 'Pending', value: reports.filter(r => r.status === 'Pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' },
              { label: 'In Progress', value: reports.filter(r => r.status === 'In Progress').length, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
              { label: 'Completed', value: reports.filter(r => r.status === 'Completed').length, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} border rounded-xl p-4 text-center`}>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter */}
        {!loading && reports.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {['All', 'Pending', 'In Progress', 'Completed'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === s ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {s}
              </button>
            ))}
          </div>
        )}

        {loading ? <LoadingSpinner message="Loading your reports..." /> : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-500 mb-6 text-sm">{filter === 'All' ? "You haven't submitted any waste reports yet." : `No ${filter} reports found.`}</p>
            {filter === 'All' && (
              <button onClick={() => navigate('/report')}
                className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition">
                Submit Your First Report
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((report) => <ReportCard key={report._id} report={report} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
