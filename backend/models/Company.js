const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  description: String,
  website: String,
  logoUrl: String,
  location: String
});

module.exports = mongoose.model('Company', companySchema);
