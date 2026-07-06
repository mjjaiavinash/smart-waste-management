const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  waste_type: { type: String, enum: ['Plastic', 'Organic', 'Metal', 'Medical', 'Other'], required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  image: { type: String, default: null },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
