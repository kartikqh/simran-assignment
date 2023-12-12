const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String},
  userType: { type: String, enum: ['Driver', 'Examiner', 'Admin'], required: true },
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  licenseNo: { type: String, default: '' },
  carInfo: {
    make: { type: String, default: '' },
    model: { type: String, default: '' },
    year: { type: String, default: '' },
    platno: { type: String, default: '' },
  },
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
    },
  testType:{
    type: String,
    enum:["G2","G", null]
  },
  comment:{
    type:String
  },
  status:{
    type: String,
    enum:["Pending","Pass", "Fail"],
    default:"Pending"
  }
});

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;