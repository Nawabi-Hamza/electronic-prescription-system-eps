const express = require('express');
const router = express.Router();
const { createVisitAppointment, getDoctors } = require('../controllers/visitorController');


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
router.post("/appointment", visitorTakeAppointmentLimit, validateSchema(appointmentSchema), createVisitAppointment)

// router.get("/profile/details", getAllDetailsOfDoctor)


// router.delete("/profile/specialization/:id", deleteSpecialization)

// router.post("/profile/address", addAddress)
// router.delete("/profile/address/:id", deleteAddress)

  



module.exports = router;


