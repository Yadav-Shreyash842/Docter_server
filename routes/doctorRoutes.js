const express = require('express');
const { body } = require('express-validator');
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Validation rules
const doctorValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('experience').isNumeric().withMessage('Experience must be a number'),
  body('consultationFee').isNumeric().withMessage('Consultation fee must be a number'),
];

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, authorize('admin'), doctorValidation, validate, createDoctor);
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
