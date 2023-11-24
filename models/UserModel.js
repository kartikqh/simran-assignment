const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String},
  userType: { type: String, enum: ['Driver', 'Examiner', 'Admin'], required: true },
  firstname: { type: String, default: 'First Name' },
  lastname: { type: String, default: 'Last Name' },
  licenseNo: { type: String, default: 'License Number' },
  carInfo: {
    make: { type: String, default: 'Make' },
    model: { type: String, default: 'Model' },
    year: { type: String, default: 'Year' },
    platno: { type: String, default: 'Plate Number' },
  },
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'   
    },
});

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;