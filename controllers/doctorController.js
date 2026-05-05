const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email');
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');

    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404);
      throw new Error('Doctor not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res, next) => {
  try {
    const { userId, specialization, experience, consultationFee, availableSlots, bio } = req.body;

    // Check if user exists and has doctor role
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.role !== 'doctor') {
      res.status(400);
      throw new Error('User must have doctor role');
    }

    // Check if doctor profile already exists
    const doctorExists = await Doctor.findOne({ userId });
    if (doctorExists) {
      res.status(400);
      throw new Error('Doctor profile already exists');
    }

    const doctor = await Doctor.create({
      userId,
      specialization,
      experience,
      consultationFee,
      availableSlots,
      bio,
    });

    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Doctor/Admin
const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    // Check if user is the doctor or admin
    if (req.user.role !== 'admin' && doctor.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this profile');
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('userId', 'name email');

    res.json(updatedDoctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor profile
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
