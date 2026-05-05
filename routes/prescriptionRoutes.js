const express = require('express');
const { body } = require('express-validator');
const {
  createPrescription,
  getPrescriptionsByPatient,
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Validation rules
const prescriptionValidation = [
  body('patient').notEmpty().withMessage('Patient ID is required'),
  body('medicines').isArray({ min: 1 }).withMessage('At least one medicine is required'),
  body('medicines.*.name').notEmpty().withMessage('Medicine name is required'),
];

router.post('/', protect, authorize('doctor'), prescriptionValidation, validate, createPrescription);
router.get('/:patientId', protect, getPrescriptionsByPatient);

module.exports = router;
