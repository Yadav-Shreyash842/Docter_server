const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization'],
    trim: true,
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
    min: 0,
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please add consultation fee'],
    min: 0,
  },
  availableSlots: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      startTime: String,
      endTime: String,
    },
  ],
  bio: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
