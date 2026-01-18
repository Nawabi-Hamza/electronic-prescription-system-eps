const multer = require("multer");
const path = require("path");
const fs = require("fs");

const filePath = process.env.FILE_PATH
// Magic byte signatures for stronger detection
const FILE_SIGNATURES = {
  jpg: ["ffd8ffe0", "ffd8ffe1", "ffd8ffe2", "ffd8ffe3", "ffd8ffe8"],
  png: ["89504e47"],
  pdf: ["25504446"]
};

function getFileSignature(buffer) {
  return buffer.toString("hex", 0, 4);
}

function uploadFile({
  fieldName,
  uploadDir,
  maxFileSizeMB = 5,
  maxFiles = 1,
  allowedTypes = ["image/"],     // allowed MIME groups
  allowedExt = [".jpg", ".jpeg", ".png", ".pdf"], // allowed extensions
  multiple = false,
  required = false // 🔥 NEW PARAMETER
}) {

  // 1️⃣ Storage rules
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // const folder = path.join(path.resolve(), "uploads", uploadDir);
      const folder = path.join(path.resolve(), filePath, uploadDir);
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9._]/g, "_");
      cb(null, unique);
    }
  });

  // 2️⃣ File validation
  const fileFilter = (req, file, cb) => {

    // Check extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
      return cb(new Error("Invalid file extension"), false);
    }

    // Check MIME type
    const mimeOk = allowedTypes.some(type =>
      file.mimetype.startsWith(type) || file.mimetype === type
    );
    if (!mimeOk) {
      return cb(new Error("Invalid MIME type"), false);
    }

    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxFileSizeMB * 1024 * 1024 }
  });

  // 3️⃣ Single/multiple selection
  const handler = multiple
    ? upload.array(fieldName, maxFiles)
    : upload.single(fieldName);

  // 4️⃣ Middleware return
  return async (req, res, next) => {
    handler(req, res, async (err) => {

      // Multer validation errors
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: `File too large. Max ${maxFileSizeMB}MB allowed.`
          });
        }
        return res.status(400).json({ message: err.message });
      }

      // ---------------------------------------
      // 🔥 NEW: Required file check
      // ---------------------------------------
      if (required) {
        if (multiple) {
          if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "File is required" });
          }
        } else {
          if (!req.file) {
            return res.status(400).json({ message: "File is required" });
          }
        }
      }

      // ---------------------------------------
      // 5️⃣ Deep Security: Check MAGIC BYTES
      // ---------------------------------------
      const files = multiple ? req.files : req.file ? [req.file] : [];

      // No file? (optional) skip magic check
      if (!files || files.length === 0) return next();

      try {
        for (const file of files) {
          const fileBuffer = fs.readFileSync(file.path);
          const signature = getFileSignature(fileBuffer);
          const ext = path.extname(file.filename).toLowerCase();

          let validSignature = false;

          if (ext === ".jpg" || ext === ".jpeg") {
            validSignature = FILE_SIGNATURES.jpg.includes(signature);
          }
          else if (ext === ".png") {
            validSignature = FILE_SIGNATURES.png.includes(signature);
          }
          else if (ext === ".pdf") {
            validSignature = FILE_SIGNATURES.pdf.some(sig => signature.startsWith(sig));
          }

          if (!validSignature) {
            fs.unlinkSync(file.path);
            return res.status(400).json({
              message: "File content does not match its type"
            });
          }
        }
      } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "File validation failed" });
      }

      return next();
    });
  };
}




// function uploadFile({
//   fieldName,
//   uploadDir,
//   maxFileSizeMB = 5,
//   maxFiles = 1,
//   allowedTypes = ["image/"],     // allowed MIME groups
//   allowedExt = [".jpg", ".jpeg", ".png", ".pdf"], // allowed extensions
//   multiple = false,
// }) {

//   // 1️⃣ Storage rules
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const folder = path.join(path.resolve(), "uploads", uploadDir);
//       if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
//       cb(null, folder);
//     },
//     filename: (req, file, cb) => {
//       const unique = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9._]/g, "_");
//       cb(null, unique);
//     }
//   });

//   // 2️⃣ File validation
//   const fileFilter = (req, file, cb) => {

//     // Check extension
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (!allowedExt.includes(ext)) {
//       return cb(new Error("Invalid file extension"), false);
//     }

//     // Check MIME type
//     const mimeOk = allowedTypes.some(type =>
//       file.mimetype.startsWith(type) || file.mimetype === type
//     );
//     if (!mimeOk) {
//       return cb(new Error("Invalid MIME type"), false);
//     }

//     cb(null, true);
//   };

//   const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: maxFileSizeMB * 1024 * 1024 }
//   });

//   // 3️⃣ Single/multiple selection
//   const handler = multiple
//     ? upload.array(fieldName, maxFiles)
//     : upload.single(fieldName);

//   // 4️⃣ Middleware return
//   return async (req, res, next) => {
//     handler(req, res, async (err) => {

//       // Multer validation errors
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).json({ message: `File too large. Max ${maxFileSizeMB}MB allowed.` });
//         }
//         return res.status(400).json({ message: err.message });
//       }

//       // -------------------------
//       // 5️⃣ Deep Security: Check MAGIC BYTES
//       // -------------------------
//       const files = multiple ? req.files : [req.file];

//       if (!files) return next(); // no file? skip

//       try {
//         for (const file of files) {
//           const fileBuffer = fs.readFileSync(file.path);
//           const signature = getFileSignature(fileBuffer);
//           const ext = path.extname(file.filename).toLowerCase();

//           let validSignature = false;

//           if (ext === ".jpg" || ext === ".jpeg") {
//             validSignature = FILE_SIGNATURES.jpg.includes(signature);
//           }
//           else if (ext === ".png") {
//             validSignature = FILE_SIGNATURES.png.includes(signature);
//           }
//           else if (ext === ".pdf") {
//             validSignature = FILE_SIGNATURES.pdf.some(sig => signature.startsWith(sig));
//           }

//           if (!validSignature) {
//             fs.unlinkSync(file.path); // Delete dangerous file
//             return res.status(400).json({ message: "File content does not match its type" });
//           }
//         }
//       } catch (e) {
//         console.log(e);
//         return res.status(500).json({ message: "File validation failed" });
//       }

//       return next();
//     });
//   };
// }

module.exports = { uploadFile };



// Simple Of Using 
// app.post(
//   "/documents",
//   uploadFile({
//     fieldName: "docs",
//     uploadDir: "documents",
//     multiple: true,
//     maxFiles: 5,
//     allowedTypes: ["image/", "application/pdf"],
//     allowedExt: [".jpg", ".jpeg", ".png", ".pdf"]
//   }),
//   (req, res) => res.send("Uploaded")
// );
