const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Book appointment
// @route   POST /api/appointments/book
// @access  Private
const bookAppointment = async (req, res, next) => {
  try {
    const { doctor, appointmentDate, appointmentTime } = req.body;

    // Check if doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate,
      appointmentTime,
      status: { $ne: 'cancelled' },
    });

    if (existingAppointment) {
      res.status(400);
      throw new Error('This slot is already booked');
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      appointmentDate,
      appointmentTime,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' },
      });

    res.status(201).json(populatedAppointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient appointments
// @route   GET /api/appointments/patient
// @access  Private
const getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('patient', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort('-createdAt');

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor
// @access  Private/Doctor
const getDoctorAppointments = async (req, res, next) => {
  try {
    // Find doctor profile for the logged-in user
    const doctor = await Doctor.findOne({ userId: req.user._id });

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor profile not found');
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort('-createdAt');

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/cancel/:id
// @access  Private
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    // Check if user is the patient or doctor
    const doctor = await Doctor.findById(appointment.doctor);
    const isPatient = appointment.patient.toString() === req.user._id.toString();
    const isDoctor = doctor && doctor.userId.toString() === req.user._id.toString();

    if (!isPatient && !isDoctor && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to cancel this appointment');
    }

    if (appointment.status === 'completed') {
      res.status(400);
      throw new Error('Cannot cancel completed appointment');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Complete appointment
// @route   PUT /api/appointments/complete/:id
// @access  Private/Doctor
const completeAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    // Check if user is the doctor
    const doctor = await Doctor.findById(appointment.doctor);
    if (!doctor || doctor.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to complete this appointment');
    }

    if (appointment.status === 'cancelled') {
      res.status(400);
      throw new Error('Cannot complete cancelled appointment');
    }

    appointment.status = 'completed';
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  cancelAppointment,
  completeAppointment,
};
