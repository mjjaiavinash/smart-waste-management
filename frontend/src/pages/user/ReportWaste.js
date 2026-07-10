import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { createReport } from '../../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationPicker = ({ onSelect }) => {
  useMapEvents({
    click(e) { onSelect(e.latlng); }
  });
  return null;
};

const ReportWaste = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ wasteType: '', description: '', location: '' });
  const [coords, setCoords] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMapSelect = async (latlng) => {
    setCoords(latlng);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`);
      const data = await res.json();
      setFormData(prev => ({ ...prev, location: data.display_name || `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}` }));
    } catch {
      setFormData(prev => ({ ...prev, location: `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}` }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      data.append('waste_type', formData.wasteType);
      data.append('description', formData.description);
      data.append('location', formData.location);
      if (coords) { data.append('latitude', coords.lat); data.append('longitude', coords.lng); }
      if (imageFile) data.append('image', imageFile);
      await createReport(data);
      setSubmitted(true);
      setTimeout(() => navigate('/my-reports'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Report Submitted!</h2>
          <p className="text-gray-500">Your waste report has been submitted successfully. Our team will take action soon.</p>
          <p className="text-sm text-gray-400 mt-4">Redirecting to My Reports...</p>
        </div>
      </div>
    );
  }

  const wasteTypes = [
    { value: 'Plastic', icon: '🥤', label: 'Plastic' },
    { value: 'Organic', icon: '🍎', label: 'Organic' },
    { value: 'Metal', icon: '🔩', label: 'Metal' },
    { value: 'Medical', icon: '💉', label: 'Medical' },
    { value: 'Other', icon: '🗑️', label: 'Other' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Report Waste Issue</h1>
          <p className="text-gray-500 mt-1">Help us keep the city clean by reporting waste</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Waste Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Waste Type <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-5 gap-2">
                {wasteTypes.map(({ value, icon, label }) => (
                  <button key={value} type="button" onClick={() => setFormData({ ...formData, wasteType: value })}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition text-xs font-semibold ${formData.wasteType === value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <span className="text-2xl mb-1">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-sm placeholder-gray-400 transition resize-none"
                placeholder="Describe the waste issue in detail..." />
            </div>

            {/* Map Location Picker */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Pin Location on Map <span className="text-red-500">*</span>
                <span className="text-xs text-gray-400 font-normal ml-2">Click on the map to select location</span>
              </label>
              <div className="rounded-xl overflow-hidden border border-gray-200 mb-2" style={{ height: '280px' }}>
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker onSelect={handleMapSelect} />
                  {coords && <Marker position={coords} />}
                </MapContainer>
              </div>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-sm placeholder-gray-400 transition"
                placeholder="Location will auto-fill when you click the map, or type manually" />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Photo (Optional)</label>
              <div className={`border-2 border-dashed rounded-xl transition cursor-pointer ${imagePreview ? 'border-green-300' : 'border-gray-200 hover:border-green-300'}`}
                onClick={() => document.getElementById('imageInput').click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full rounded-xl object-contain max-h-64" />
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-3xl mb-2 text-gray-300">📷</div>
                    <p className="text-sm text-gray-500 font-medium">Click to upload a photo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP supported</p>
                  </div>
                )}
              </div>
              <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {imagePreview && (
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium">Remove photo</button>
              )}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}

            <button type="submit" disabled={loading || !formData.wasteType}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-sm disabled:opacity-60">
              {loading ? 'Submitting report...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportWaste;
