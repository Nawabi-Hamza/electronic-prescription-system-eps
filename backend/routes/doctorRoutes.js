const express = require('express');
const router = express.Router();
const { getAllDetailsOfDoctor, updateTiming, addSpecialization, addAddress, deleteSpecialization, deleteAddress, paymentDone, addMedicine, getAllMedicine, deleteMedicine } = require('../controllers/doctorController');

// Middlewares
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { sanitizeInput } = require('../middlewares/sanitizeHtml');
const { checkDoctorPayment } = require('../middlewares/checkDoctorPayment');
const validateSchema = require('../validators/validateSchema');
const { addMedicineSchema } = require('../validators/doctorSchema');

// Auth & role middleware
router.use(authMiddleware);
router.use(roleCheck(['doctor']))
router.use(sanitizeInput)


router.get("/profile/details", getAllDetailsOfDoctor)
router.get("/profile/payments", checkDoctorPayment, paymentDone)

router.put("/profile/update-timing", updateTiming)

router.post("/profile/specialization", addSpecialization)
router.delete("/profile/specialization/:id", deleteSpecialization)

router.post("/profile/address", addAddress)
router.delete("/profile/address/:id", deleteAddress)

// Routes Need Check Payment Before Use
router.get("/medicine", validateSchema(addMedicineSchema), checkDoctorPayment, getAllMedicine)
router.post("/medicine", validateSchema(addMedicineSchema), checkDoctorPayment, addMedicine)
router.delete("/medicine/:id", checkDoctorPayment, deleteMedicine)




module.exports = router;


