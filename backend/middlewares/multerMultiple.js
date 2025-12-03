const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/doctor"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + Math.random() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// module.exports = upload;


// Simple magic-byte signatures (hex) for basic protections
const FILE_SIGNATURES = {
  jpg: ["ffd8ffe0", "ffd8ffe1", "ffd8ffe2", "ffd8ffe3", "ffd8ffe8"],
  png: ["89504e47"],
  pdf: ["25504446"]
};

function getSignatureHex(buffer, length = 4) {
  return buffer.toString("hex", 0, length);
}

/**
 * fieldsConfig: [
 *  {
 *    fieldName: 'clinic_logo',
 *    uploadDir: 'clinic_logos',
 *    maxFiles: 1,
 *    maxFileSizeMB: 5,
 *    allowedExt: ['.jpg','.jpeg','.png'],
 *    allowedTypes: ['image/'],
 *    required: false
 *  },
 *  { ... }
 * ]
 */
function uploadMiddleware(fieldsConfig = []) {
  if (!Array.isArray(fieldsConfig)) fieldsConfig = [fieldsConfig];

  // Build multer "fields" descriptor
  const multerFields = fieldsConfig.map((f) => ({
    name: f.fieldName,
    maxCount: f.maxFiles || 1
  }));

  // Single shared storage that chooses folder per field
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const cfg = fieldsConfig.find((c) => c.fieldName === file.fieldname);
      if (!cfg) return cb(new Error("Invalid upload field"), null);

      const folder = path.join(process.cwd(), "uploads", cfg.uploadDir);
      try {
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      } catch (e) {
        return cb(e, null);
      }
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      // safe filename
      const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const unique = `${Date.now()}-${Math.round(Math.random()*1e6)}-${safe}`;
      cb(null, unique);
    }
  });

  // fileFilter uses per-field config
  const fileFilter = (req, file, cb) => {
    const cfg = fieldsConfig.find((c) => c.fieldName === file.fieldname);
    if (!cfg) return cb(new Error("Unexpected field"), false);

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = cfg.allowedExt || [".jpg", ".jpeg", ".png", ".pdf"];
    if (!allowedExt.includes(ext)) {
      return cb(new Error(`Invalid extension for ${file.fieldname}: ${ext}`), false);
    }

    const allowedTypes = cfg.allowedTypes || ["image/"];
    const mimeOk = allowedTypes.some((t) => file.mimetype.startsWith(t) || file.mimetype === t);
    if (!mimeOk) {
      return cb(new Error(`Invalid MIME type for ${file.fieldname}: ${file.mimetype}`), false);
    }

    cb(null, true);
  };

  // Choose largest maxFileSize across configs as multer global limit (per-file check will be enforced later)
  const globalMaxMB = Math.max(...fieldsConfig.map((c) => c.maxFileSizeMB || 5), 5);

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: globalMaxMB * 1024 * 1024 }
  }).fields(multerFields);

  // middleware
  return (req, res, next) => {
    upload(req, res, (err) => {
      // Multer errors
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, message: "File too large" });
        }
        return res.status(400).json({ success: false, message: err.message || "Upload error" });
      }

      // Now per-field checks: required, per-file size, magic bytes
      (async () => {
        try {
          for (const cfg of fieldsConfig) {
            const files = (req.files && req.files[cfg.fieldName]) || [];

            // required check
            if (cfg.required && files.length === 0) {
              return res.status(400).json({ success: false, message: `${cfg.fieldName} is required` });
            }

            // enforce per-file size if provided and also ext/mime already checked
            for (const file of files) {
              if (cfg.maxFileSizeMB) {
                const stat = fs.statSync(file.path);
                if (stat.size > cfg.maxFileSizeMB * 1024 * 1024) {
                  // delete file
                  try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
                  return res.status(400).json({
                    success: false,
                    message: `${cfg.fieldName} exceeds ${cfg.maxFileSizeMB}MB`
                  });
                }
              }

              // magic bytes: read first bytes
              const buffer = fs.readFileSync(file.path);
              const signature = getSignatureHex(buffer, 4);
              const ext = path.extname(file.filename).toLowerCase();

              let ok = false;
              if (ext === ".jpg" || ext === ".jpeg") {
                ok = FILE_SIGNATURES.jpg.includes(signature);
              } else if (ext === ".png") {
                ok = FILE_SIGNATURES.png.includes(signature);
              } else if (ext === ".pdf") {
                ok = FILE_SIGNATURES.pdf.some(sig => signature.startsWith(sig));
              } else {
                // for other extensions, skip strict check (or you can extend)
                ok = true;
              }

              if (!ok) {
                try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
                return res.status(400).json({
                  success: false,
                  message: `${cfg.fieldName} file content does not match its extension/type`
                });
              }
            }
          }

          // All checks passed
          return next();
        } catch (ex) {
          console.error("uploadMiddleware error:", ex);
          return res.status(500).json({ success: false, message: "File validation failed" });
        }
      })();
    });
  };
}

module.exports = { uploadMiddleware, upload };
