const express = require('express');
const { body } = require('express-validator');
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  cancelAppointment,
  completeAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Validation rules
const bookingValidation = [
  body('doctor').notEmpty().withMessage('Doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
];

router.post('/book', protect, bookingValidation, validate, bookAppointment);
router.get('/patient', protect, getPatientAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.put('/cancel/:id', protect, cancelAppointment);
router.put('/complete/:id', protect, authorize('doctor'), completeAppointment);

module.exports = router;
