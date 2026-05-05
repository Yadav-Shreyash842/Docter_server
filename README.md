# Doctor Appointment and Online Consultation System - Backend

A production-ready backend API for managing doctor appointments and online consultations built with Node.js, Express.js, MongoDB, and JWT authentication.

## Features

- User authentication (Register, Login, Profile)
- Role-based access control (Patient, Doctor, Admin)
- Doctor profile management
- Appointment booking with double-booking prevention
- Prescription management
- RESTful API design
- Input validation
- Error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for validation
- cors
- nodemailer

## Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment variables:
Edit `.env` file and update:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/doctor-appointment
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

3. Start MongoDB:
Make sure MongoDB is running on your system.

4. Run the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create doctor profile (Admin only)
- `PUT /api/doctors/:id` - Update doctor profile (Doctor/Admin)
- `DELETE /api/doctors/:id` - Delete doctor profile (Admin only)

### Appointments
- `POST /api/appointments/book` - Book appointment (Protected)
- `GET /api/appointments/patient` - Get patient appointments (Protected)
- `GET /api/appointments/doctor` - Get doctor appointments (Doctor only)
- `PUT /api/appointments/cancel/:id` - Cancel appointment (Protected)
- `PUT /api/appointments/complete/:id` - Complete appointment (Doctor only)

### Prescriptions
- `POST /api/prescriptions` - Create prescription (Doctor only)
- `GET /api/prescriptions/:patientId` - Get patient prescriptions (Protected)

## User Roles

- **patient**: Can book appointments, view own appointments and prescriptions
- **doctor**: Can manage appointments, create prescriptions, update own profile
- **admin**: Full access to all resources

## Authentication

Include JWT token in request headers:
```
Authorization: Bearer <token>
```

## Project Structure

```
server/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── doctorController.js
│   ├── appointmentController.js
│   └── prescriptionController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── models/
│   ├── User.js
│   ├── Doctor.js
│   ├── Appointment.js
│   └── Prescription.js
├── routes/
│   ├── authRoutes.js
│   ├── doctorRoutes.js
│   ├── appointmentRoutes.js
│   └── prescriptionRoutes.js
├── utils/
│   └── generateToken.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Example Requests

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

### Book Appointment
```json
POST /api/appointments/book
Headers: { "Authorization": "Bearer <token>" }
{
  "doctor": "doctorId",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "10:00 AM"
}
```

### Create Prescription
```json
POST /api/prescriptions
Headers: { "Authorization": "Bearer <token>" }
{
  "patient": "patientId",
  "medicines": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "5 days"
    }
  ],
  "notes": "Take after meals"
}
```

## License

ISC
