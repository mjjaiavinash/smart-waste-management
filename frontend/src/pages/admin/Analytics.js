import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllReports } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed'];

const Analytics = () => {
  const [wasteTypeData, setWasteTypeData] = useState([]);
  const [dailyReportsData, setDailyReportsData] = useState([]);
  const [stats, setStats] = useState({ mostReportedType: '', mostReportedCount: 0, peakDay: '', resolutionRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllReports();
        const allReports = res.data;

        const wasteTypes = {};
        allReports.forEach(r => { wasteTypes[r.waste_type] = (wasteTypes[r.waste_type] || 0) + 1; });
        const wasteData = Object.keys(wasteTypes).map(key => ({ name: key, value: wasteTypes[key] }));
        setWasteTypeData(wasteData);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dailyCounts = {};
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        allReports.forEach(r => {
          const reportDate = new Date(r.createdAt);
          if (reportDate >= startOfWeek) {
            const day = days[reportDate.getDay()];
            dailyCounts[day] = (dailyCounts[day] || 0) + 1;
          }
        });
        setDailyReportsData(days.map(day => ({ day, reports: dailyCounts[day] || 0 })));

        const mostReported = wasteData.reduce((max, item) => item.value > max.value ? item : max, { name: 'N/A', value: 0 });
        const peakDay = days.reduce((max, day) => (dailyCounts[day] || 0) > (dailyCounts[max] || 0) ? day : max, days[0]);
        const completedCount = allReports.filter(r => r.status === 'Completed').length;
        const resolutionRate = allReports.length > 0 ? Math.round((completedCount / allReports.length) * 100) : 0;

        setStats({ mostReportedType: mostReported.name, mostReportedCount: mostReported.value, peakDay, resolutionRate });
      } catch (err) {
        console.error('Failed to load analytics.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Visual insights into waste management data</p>
        </div>

        {loading ? <LoadingSpinner message="Loading analytics..." /> : (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {[
                { label: 'Most Reported Type', value: stats.mostReportedType || 'N/A', sub: `${stats.mostReportedCount} reports`, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
                { label: 'Peak Day', value: stats.peakDay || 'N/A', sub: 'Most reports on this day', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { label: 'Resolution Rate', value: `${stats.resolutionRate}%`, sub: 'Reports completed', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} border rounded-2xl p-6`}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{s.label}</p>
                  <p className={`text-4xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Waste Types Distribution</h2>
                {wasteTypeData.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">No data available yet</div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={wasteTypeData} cx="50%" cy="50%" labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={90} dataKey="value">
                          {wasteTypeData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {wasteTypeData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index] }}></div>
                          <span className="text-xs text-gray-600 font-medium">{item.name}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Daily Reports This Week</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dailyReportsData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} cursor={{ fill: '#f0fdf4' }} />
                    <Bar dataKey="reports" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
