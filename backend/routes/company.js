const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Company = require('../models/Company');

// Get current employer's company profile
router.get('/me', auth, async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company profile
router.put('/me', auth, async (req, res) => {
  try {
    const updates = req.body;
    const company = await Company.findOneAndUpdate(
      { user: req.user.id },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
