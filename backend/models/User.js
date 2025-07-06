const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['jobSeeker', 'employer'], required: true },

  // Extra fields for Job Seeker
  location: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  resume: { type: String }, // Filename of uploaded resume

  // Optional: You can also add a field for bookmarked jobs
  bookmarkedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
