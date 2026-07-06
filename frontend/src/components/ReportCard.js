import React from 'react';

const ReportCard = ({ report }) => {
  const statusStyle = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-green-50 text-green-700 border-green-200',
  };

  const wasteIcons = { Plastic: '🥤', Organic: '🍎', Metal: '🔩', Medical: '💉', Other: '🗑️' };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {report.image && (
        <div className="overflow-hidden bg-gray-50">
          <img src={`http://localhost:5000${report.image}`} alt="Waste" className="w-full object-contain max-h-56" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-lg">
              {wasteIcons[report.waste_type] || '🗑️'}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{report.waste_type}</h3>
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-32">📍 {report.location}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle[report.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {report.status}
          </span>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{report.description}</p>

        <div className="flex justify-between items-center pt-3 border-t border-gray-50 text-xs text-gray-400">
          <span className="font-semibold">#{report._id?.slice(-6)}</span>
          <span>{new Date(report.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
