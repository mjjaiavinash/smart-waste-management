import React from 'react';

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300`}>
      <div className="absolute -right-4 -top-4 text-8xl opacity-10 group-hover:opacity-20 transition">{icon}</div>
      <div className="relative">
        <p className="text-sm font-semibold opacity-90 uppercase tracking-wide">{title}</p>
        <p className="text-4xl font-extrabold mt-2">{value}</p>
      </div>
      <div className="mt-4 text-3xl">{icon}</div>
    </div>
  );
};

export default DashboardCard;
