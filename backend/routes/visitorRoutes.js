const express = require('express');
const router = express.Router();
const { createVisitAppointment, getDoctors, getDoctorTiming, getUserAppointments } = require('../controllers/visitorController');


// Middlewares
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { sanitizeInput } = require('../middlewares/sanitizeHtml');
const validateSchema = require('../validators/validateSchema');
const { appointmentSchema } = require('../validators/visitorSchema');
const { visitorTakeAppointmentLimit } = require('../middlewares/rateLimit');

// Auth & role middleware
router.use(sanitizeInput)



router.get("/doctors", getDoctors)
router.get("/doctor-timing/:id", getDoctorTiming)
// getUserAppointments
router.get("/appointment/:device_id",  getUserAppointments)
router.post("/appointment", visitorTakeAppointmentLimit, validateSchema(appointmentSchema), createVisitAppointment)

  



module.exports = router;


