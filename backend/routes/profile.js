const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Setup Multer for resume upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('bookmarkedJobs');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/', auth, async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/profile/upload-resume
 * @desc    Upload resume PDF for job seekers
 * @access  Private
 */
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { resume: req.file.filename },
      { new: true }
    );

    res.json({ message: 'Resume uploaded successfully', file: req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

/**
 * @route   GET /api/profile/company
 * @desc    Get employer's company profile
 * @access  Private
 */
router.get('/company', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user || user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      companyName: user.companyName || '',
      companyDescription: user.bio || '',
      location: user.location || '',
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load company profile' });
  }
});

module.exports = router;
