const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description:{
    type: String,
  },
  date: {
    type: String,
    required: true
  },
  time:{
    type: String
  },
  link:{
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
 
  organizedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
});

const Conferences = mongoose.model('Conferences', conferenceSchema);

module.exports = Conferences;
