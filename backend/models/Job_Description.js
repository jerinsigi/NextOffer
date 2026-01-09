const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  Fk_company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  job_title: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  location: {
    type: String
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  experience_required: {
    type: String
  },
  salary: {
    type: String
  },
  description: {
    type: String
  },
  skills: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  job_status: {
    type: String,
    enum: ['Active', 'Draft', 'Closed', 'Paused'],
    default: 'Draft'
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  applications_count: {
    type: Number,
    default: 0
  },
  shortlisted_count: {
    type: Number,
    default: 0
  },
  interviewed_count: {
    type: Number,
    default: 0
  },
  hired_count: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Job_Description', jobDescriptionSchema);
