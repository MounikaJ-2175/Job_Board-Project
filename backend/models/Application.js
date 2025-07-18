const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    jobSeeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Rejected'],
      default: 'Applied',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
