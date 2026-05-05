const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private/Doctor
const createPrescription = async (req, res, next) => {
  try {
    const { patient, medicines, notes } = req.body;

    // Check if user is a doctor
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      res.status(403);
      throw new Error('Only doctors can create prescriptions');
    }

    // Check if patient exists
    const patientExists = await User.findById(patient);
    if (!patientExists) {
      res.status(404);
      throw new Error('Patient not found');
    }

    const prescription = await Prescription.create({
      doctor: req.user._id,
      patient,
      medicines,
      notes,
    });

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('doctor', 'name email')
      .populate('patient', 'name email');

    res.status(201).json(populatedPrescription);
  } catch (error) {
    next(error);
  }
};

// @desc    Get prescriptions by patient ID
// @route   GET /api/prescriptions/:patientId
// @access  Private
const getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Check if user is the patient or a doctor or admin
    if (
      req.user._id.toString() !== patientId &&
      req.user.role !== 'doctor' &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to view these prescriptions');
    }

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor', 'name email')
      .populate('patient', 'name email')
      .sort('-date');

    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrescription,
  getPrescriptionsByPatient,
};
