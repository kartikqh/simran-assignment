const mongoose = require('mongoose');

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
    id: String,
    date: String,
    time: String,
    isTimeAvailable: {
      type: Boolean,
      default: false
    },
    isAdded:{
      type: Boolean,
      default: false
    },

  });
  module.exports = mongoose.model('Appointment', appointmentSchema);