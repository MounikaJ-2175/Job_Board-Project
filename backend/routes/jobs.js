const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

// ✅ POST job
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post jobs' });
    }

    const { title, company, description, location, jobType, experienceLevel, salary } = req.body;

    if (!title || !company || !description || !location || !jobType || !experienceLevel || !salary) {
      return res.status(400).json({ message: 'All job fields are required' });
    }

    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('POST /jobs error:', err);
    res.status(500).json({ message: 'Server error while posting job' });
  }
});

// ✅ GET all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', 'username email');
    res.json(jobs);
  } catch (err) {
    console.error('GET /jobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET my jobs - Moved ABOVE /:id
router.get('/mine', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('GET /jobs/mine error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET job by ID with validation
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'username email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('GET /jobs/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT update job
router.put('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const user = await User.findById(req.user.id);
    if (user.role !== 'employer' || job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (err) {
    console.error('PUT /jobs/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ DELETE job
router.delete('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const user = await User.findById(req.user.id);
    if (user.role !== 'employer' || job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('DELETE /jobs/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET applicants for job
router.get('/:id/applicants', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const applications = await Application.find({ job: job._id }).populate('jobSeeker', 'username email skills experienceLevel resume');
    const formatted = applications.map(app => ({ _id: app._id, user: app.jobSeeker }));
    res.json(formatted);
  } catch (err) {
    console.error('GET /jobs/:id/applicants error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Apply to job
router.post('/:id/apply', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  try {
    if (req.user.role !== 'jobSeeker') {
      return res.status(403).json({ message: 'Only job seekers can apply' });
    }

    const existing = await Application.findOne({ job: req.params.id, jobSeeker: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'Already applied' });
    }

    const app = new Application({ job: req.params.id, jobSeeker: req.user.id });
    await app.save();
    res.status(201).json({ message: 'Application submitted' });
  } catch (err) {
    console.error('POST /jobs/:id/apply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
  
});

module.exports = router;
