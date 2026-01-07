const express = require('express');
const router = express.Router();
const { getAllDetailsOfDoctor, updateTiming, addSpecialization, addAddress, deleteSpecialization, deleteAddress, paymentDone,
         addMedicine, getAllMedicine, deleteMedicine, getAllPaymentsOfDoctor, savePrescriptionHeader, 
         getPrescriptionHeader, updateClinicLogo,
         logoUploadMethod,
         updateSignature,
         getVisitorsAppointment,
         rejectVisitorAppointment,
         acceptVisitorAppointment} = require('../controllers/doctorController');

// Middlewares
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { sanitizeInput } = require('../middlewares/sanitizeHtml');
const { checkDoctorPayment } = require('../middlewares/checkDoctorPayment');
const validateSchema = require('../validators/validateSchema');
const { addMedicineSchema, prescriptionHeaderSchema, updateTimingSchema } = require('../validators/doctorSchema');
const { clientUpdateHeaderLimiter, clientUploadFileLimiter } = require('../middlewares/rateLimit');
const { uploadFile } = require('../middlewares/multer');
const { cleanupFileOnError } = require('../middlewares/cleanUpFileOnError');

// Auth & role middleware
router.use(authMiddleware);
router.use(roleCheck(['doctor']))
router.use(sanitizeInput)


const uploadClinicLogo = {
  fieldName: "clinic_logo",
  uploadDir: "clinic_logo",
  maxFileSizeMB: 5,
  maxFiles: 1,
  multiple: false,
  allowedTypes: ["image/"],
  allowedExt: [".jpg", ".jpeg", ".png"],
  required: true
};

const uploadDoctorSignature = {
  fieldName: "signature_logo",
  uploadDir: "doctor_signatures",
  maxFileSizeMB: 5,
  maxFiles: 1,
  multiple: false,
  allowedTypes: ["image/"],
  allowedExt: [".jpg", ".jpeg", ".png"],
  required: true
};




router.get("/profile/details", getAllDetailsOfDoctor)
router.get("/profile/payments", checkDoctorPayment, paymentDone)

router.put("/profile/update-timing", validateSchema(updateTimingSchema), updateTiming)

router.get("/payments", getAllPaymentsOfDoctor)


router.post("/profile/specialization", addSpecialization)
router.delete("/profile/specialization/:id", deleteSpecialization)

router.post("/profile/address", addAddress)
router.delete("/profile/address/:id", deleteAddress)

// Routes Need Check Payment Before Use
router.get("/medicine", checkDoctorPayment, getAllMedicine)
router.post("/medicine", validateSchema(addMedicineSchema), checkDoctorPayment, addMedicine)
router.delete("/medicine/:id", checkDoctorPayment, deleteMedicine)

// Prescription Header
router.get("/prescription/header", getPrescriptionHeader)
router.post("/prescription/header", clientUpdateHeaderLimiter, validateSchema(prescriptionHeaderSchema), checkDoctorPayment, savePrescriptionHeader);


router.post("/prescription/header/clinic-logo", clientUploadFileLimiter, cleanupFileOnError, checkDoctorPayment, uploadFile(uploadClinicLogo), updateClinicLogo);
router.post("/prescription/header/signature", clientUploadFileLimiter, cleanupFileOnError, checkDoctorPayment, uploadFile(uploadDoctorSignature), updateSignature);

router.get("/appointment", getVisitorsAppointment)
router.put("/appointment-reject/:id", rejectVisitorAppointment)
router.put("/appointment-accept/:id", acceptVisitorAppointment)

  



module.exports = router;


