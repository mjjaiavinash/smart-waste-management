import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllReports } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('token');
  const [stats, setStats] = useState({ total: 0, resolved: 0 });

  useEffect(() => {
    if (role === 'admin') { navigate('/dashboard'); return; }
    getAllReports().then(res => {
      const reports = res.data;
      setStats({
        total: reports.length,
        resolved: reports.filter(r => r.status === 'Completed').length,
      });
    }).catch(() => {});
  }, []);

  if (role === 'admin') return null;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white opacity-5 rounded-full"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center text-white">
          <span className="inline-flex items-center gap-2 bg-white bg-opacity-15 border border-white border-opacity-20 rounded-full px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
            Trusted by 10,000+ citizens across 25 cities
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Smart Waste<br />
            <span className="text-green-200">Management System</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Report waste issues instantly, track resolutions in real-time, and help create a cleaner environment for everyone.
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            {!isLoggedIn ? (
              <>
                <button onClick={() => navigate('/register')}
                  className="bg-white text-green-700 px-8 py-3.5 rounded-xl font-bold hover:bg-green-50 transition shadow-lg text-base">
                  Get Started Free →
                </button>
                <button onClick={() => navigate('/login')}
                  className="bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white hover:text-green-700 transition text-base">
                  User Login
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/report')}
                className="bg-white text-green-700 px-10 py-3.5 rounded-xl font-bold hover:bg-green-50 transition shadow-lg text-base">
                Report Waste Now →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: stats.total || '1,240', label: 'Reports Submitted', icon: '📊' },
              { value: stats.resolved || '980', label: 'Issues Resolved', icon: '✅' },
              { value: '50+', label: 'Active Workers', icon: '👷' },
              { value: '25', label: 'Cities Covered', icon: '🏙️' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Features</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">Why Choose Us?</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">A smarter, faster way to manage waste and keep your city clean</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📝', title: 'Easy Waste Reporting', desc: 'Submit waste complaints with description, location and photo in just a few clicks.', bg: 'bg-green-50', iconBg: 'bg-green-600' },
            { icon: '📋', title: 'Track Your Reports', desc: 'Monitor all your submitted reports and their real-time status — Pending, In Progress or Completed.', bg: 'bg-blue-50', iconBg: 'bg-blue-600' },
            { icon: '🛡️', title: 'Admin Management', desc: 'Admins can view all reports, update statuses and manage resolved issues from a dedicated dashboard.', bg: 'bg-purple-50', iconBg: 'bg-purple-600' },
          ].map((f, i) => (
            <div key={i} className={`${f.bg} rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300`}>
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-xl text-white mb-5 shadow-md`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Process</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register & Login', desc: 'Create a free account and login to access the reporting system.' },
              { step: '02', title: 'Submit a Report', desc: 'Fill in the waste type, location, description and upload a photo.' },
              { step: '03', title: 'Track Progress', desc: 'Monitor your report status as our team resolves the issue.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-5">
                <div className="text-4xl font-extrabold text-green-100 leading-none select-none">{s.step}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <section className="bg-gradient-to-r from-green-600 to-emerald-500 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-white">
            <h2 className="text-4xl font-extrabold mb-4">Ready to make a difference?</h2>
            <p className="text-green-100 mb-8 text-lg max-w-xl mx-auto">Join thousands of citizens helping keep our cities clean and sustainable.</p>
            <button onClick={() => navigate('/register')}
              className="bg-white text-green-700 px-10 py-4 rounded-xl font-bold hover:bg-green-50 transition shadow-lg text-lg">
              Sign Up Free Today →
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
