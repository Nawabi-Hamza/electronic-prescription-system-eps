import multer from "multer";
import path from "path";

// ----------------------
// Allowed file types
// ----------------------
const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

// ----------------------
// Storage for clinic logo
// ----------------------
const clinicLogoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/clinic_logo/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "clinic-" + unique + ext);
  }
});

// ----------------------
// Storage for signature logo
// ----------------------
const signatureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/signature_logo/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "signature-" + unique + ext);
  }
});

// ----------------------
// File filter
// ----------------------
const fileFilter = (req, file, cb) => {
  if (!allowedImageTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type — only PNG, JPG, JPEG, PDF allowed"));
  }
  cb(null, true);
};

// ----------------------
// Create upload handlers
// ----------------------
const uploadClinicLogo = multer({
  storage: clinicLogoStorage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 } // 4 MB
}).single("clinic_logo");

const uploadSignatureLogo = multer({
  storage: signatureStorage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 } // 4 MB
}).single("signature_logo");

// ----------------------
// Combined middleware
// ----------------------
export const uploadPrescriptionFiles = (req, res, next) => {

  uploadClinicLogo(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    uploadSignatureLogo(req, res, (err2) => {
      if (err2) return res.status(400).json({ success: false, message: err2.message });

      next();
    });

  });

};
