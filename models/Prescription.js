const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicines: [
    {
      name: {
        type: String,
        required: true,
      },
      dosage: String,
      frequency: String,
      duration: String,
    },
  ],
  notes: {
    type: String,
    maxlength: 1000,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
