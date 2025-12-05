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
  required_skills: {
    type: String
  },
  experience_required: {
    type: String
  },
  job_status: {
    type: String
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  }
});

module.exports = mongoose.model('Job_Description', jobDescriptionSchema);
