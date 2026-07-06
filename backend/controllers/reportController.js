const Report = require('../models/Report');
const User = require('../models/User');

const createReport = async (req, res) => {
  const { waste_type, description, location, latitude, longitude } = req.body;
  const user_id = req.user.id;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!waste_type || !description || !location)
    return res.status(400).json({ message: 'Waste type, description and location are required.' });

  try {
    const report = await Report.create({ user_id, waste_type, description, location, latitude, longitude, image });
    res.status(201).json({ message: 'Report submitted successfully!', reportId: report._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create report.', error: err.message });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports.', error: err.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('user_id', 'name email').sort({ createdAt: -1 });
    const formatted = reports.map(r => ({
      ...r.toObject(),
      user_name: r.user_id?.name,
      user_email: r.user_id?.email
    }));
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports.', error: err.message });
  }
};

const updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'In Progress', 'Completed'];
  if (!validStatuses.includes(status))
    return res.status(400).json({ message: 'Invalid status value.' });

  try {
    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    res.status(200).json({ message: `Report status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status.', error: err.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    res.status(200).json({ message: 'Report deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete report.', error: err.message });
  }
};

module.exports = { createReport, getMyReports, getAllReports, updateReportStatus, deleteReport };
