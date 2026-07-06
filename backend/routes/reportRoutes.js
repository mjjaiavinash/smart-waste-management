const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
  deleteReport
} = require('../controllers/reportController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/', verifyToken, upload.single('image'), createReport);
router.get('/my', verifyToken, getMyReports);
router.get('/all', verifyAdmin, getAllReports);
router.put('/:id/status', verifyAdmin, updateReportStatus);
router.delete('/:id', verifyAdmin, deleteReport);

module.exports = router;
