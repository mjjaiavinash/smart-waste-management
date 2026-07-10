import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getAllReports } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'Completed': 'bg-green-100 text-green-700 border-green-200',
};

const wasteIcons = { Plastic: '🥤', Organic: '🍎', Metal: '🔩', Medical: '💉', Other: '🗑️' };

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getAllReports()
      .then(res => setReports(res.data.filter(r => r.latitude && r.longitude)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? reports : reports.filter(r => r.status === filter);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Map View</h1>
            <p className="text-gray-500 mt-1">All waste report locations on the map</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Pending', 'In Progress', 'Completed'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === s ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {s} {s === 'All' ? `(${reports.length})` : `(${reports.filter(r => r.status === s).length})`}
              </button>
            ))}
          </div>
        </div>

        {loading ? <LoadingSpinner message="Loading map..." /> : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6" style={{ height: '520px' }}>
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filtered.map((report) => (
                  <Marker key={report._id} position={[report.latitude, report.longitude]}>
                    <Popup>
                      <div className="min-w-[180px]">
                        <div className="font-bold text-gray-900 mb-1">
                          {wasteIcons[report.waste_type]} {report.waste_type}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{report.location}</p>
                        <p className="text-xs text-gray-600 mb-2">{report.description?.slice(0, 80)}...</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusColors[report.status]}`}>
                          {report.status}
                        </span>
                        {report.user_name && <p className="text-xs text-gray-400 mt-1">by {report.user_name}</p>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="font-medium">No reports with location data found</p>
                <p className="text-sm mt-1">Reports need to be submitted with map pin to appear here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MapView;
