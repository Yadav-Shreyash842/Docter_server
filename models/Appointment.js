const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please add appointment date'],
  },
  appointmentTime: {
    type: String,
    required: [true, 'Please add appointment time'],
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent double booking
appointmentSchema.index({ doctor: 1, appointmentDate: 1, appointmentTime: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
