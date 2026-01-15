const express = require('express');
const router = express.Router();

// Middlewares
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { sanitizeInput } = require('../middlewares/sanitizeHtml');
const { cleanupFileOnError } = require('../middlewares/cleanUpFileOnError'); // remove file if there happen error in next middleware
const { uploadFile } = require('../middlewares/multer');
const {  addNewDoctor, deleteDoctor, showAllDoctors, showSingleDoctors, addPaymentForDoctor, getDoctorPaymentsByYearMonth, getDoctorsWithoutPayment, updateDoctor, getDoctorStatusSummary } = require('../controllers/ownerController');

// Validation
const { addDoctorSchema, addDoctorPaymentSchema, updateDoctorSchema } = require('../validators/ownerSchema');
const validateSchema = require('../validators/validateSchema');

// Auth & role middleware
router.use(authMiddleware);
router.use(roleCheck(['owner']))
router.use(sanitizeInput)

const uploadDoctorProfilePicture = {
    fieldName: "profile",
    uploadDir: "profiles"
}

router.get("/dashboard", getDoctorStatusSummary);

router.get("/users", showAllDoctors);
router.get("/users/:user_id", showSingleDoctors);
router.post("/users", cleanupFileOnError, uploadFile(uploadDoctorProfilePicture), validateSchema(addDoctorSchema) , addNewDoctor)
router.put("/users/:user_id", validateSchema(updateDoctorSchema), updateDoctor);
router.delete("/users/:user_id" , deleteDoctor)


router.get("/payments/filter", getDoctorPaymentsByYearMonth)
router.get("/payments/unpaid/filter", getDoctorsWithoutPayment);
router.post("/payments", validateSchema(addDoctorPaymentSchema) , addPaymentForDoctor)

// router.post(
//   "/documents",
//   uploadFile({
//     fieldName: "docs",
//     uploadDir: "documents_test",
//     maxFileSizeMB: 5,
//     maxFiles: 3,
//     multiple: true,
//     allowedTypes: ["image/", "application/pdf"],
//     allowedExt: [".jpg", ".jpeg", ".png", ".pdf"]
//   }),
//   (req, res) => res.send(req.files)
// );

// router.post(
//   "/document",
//   uploadFile({
//     fieldName: "docs",
//     uploadDir: "documents_test",
//     maxFileSizeMB: 5,
//     maxFiles: 1,
//     multiple: false,
//     allowedTypes: ["image/", "application/pdf"],
//     allowedExt: [".jpg", ".jpeg", ".png", ".pdf"]
//   }),
//   (req, res) => res.send(req.file)
// );

module.exports = router;





// Upload File Simple
// it upload file in uploads/document_test
// uploadFile({
//   fieldName: "docs",
//   uploadDir: "documents_test",
//   maxFileSizeMB: 5,
//   maxFiles: 3,
//   multiple: true,
//   allowedTypes: ["image/", "application/pdf"],
//   allowedExt: [".jpg", ".jpeg", ".png", ".pdf"]
// })