const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const Job = require('../models/Job');

// 📌 Apply to a Job (JobSeeker only)
router.post('/apply/:jobId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jobSeeker') {
      return res.status(403).json({ message: 'Only job seekers can apply for jobs' });
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      jobSeeker: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: req.params.jobId,
      jobSeeker: req.user.id,
    });

    const saved = await application.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get applicants for a specific job (Employer only)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applicants = await Application.find({ job: job._id })
      .populate('jobSeeker', 'username email location bio skills resume')
      .sort({ createdAt: -1 });

    res.json(applicants);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applicants' });
  }
});

// 📌 Update application status (Employer only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update status for this application' });
    }

    application.status = req.body.status;
    await application.save();

    res.json({ message: 'Status updated', application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ NEW: Get all jobs applied by current job seeker
router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jobSeeker') {
      return res.status(403).json({ message: 'Only job seekers can view their applications' });
    }

    const applications = await Application.find({ jobSeeker: req.user.id })
      .populate('job') // populates job details
      .sort({ createdAt: -1 });

    const appliedJobs = applications.map(app => ({ job: app.job }));
    res.json(appliedJobs);
  } catch (err) {
    console.error('GET /applications/my error:', err);
    res.status(500).json({ message: 'Failed to fetch applied jobs' });
  }
});

module.exports = router;
