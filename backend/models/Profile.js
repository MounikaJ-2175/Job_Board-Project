const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: String,
  location: String,
  skills: [String],
  experience: String,
  education: String,
  resumeUrl: String, 
  photoUrl: String,  
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
