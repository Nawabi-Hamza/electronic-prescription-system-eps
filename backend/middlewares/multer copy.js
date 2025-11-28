const multer = require('multer');
const path = require("path")
const fs = require('fs')

// Set up multer to handle file uploads
const uploadImage = (directory)=>{
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads', file.fieldname);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Ensure proper file extension
    }
  });
  // Filter to allow only images
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(("Only image files are allowed!"), false);
    }
  };
  
  const upload = multer({ 
        storage: storage,
        fileFilter: fileFilter, // file should be image
        limits: { fileSize: 4 * 1024 * 1024 }, // limit file size 4mb
      }).single(directory); 
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File size exceeds 4 MB." });
        }
        return res.status(400).json({ message: err });
      }
      next();
    });
  };
}


const uploadProfileAndDocuments = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = req.userCode || "temp";
      let uploadDir;

      if (file.fieldname === "profile_pic") {
        uploadDir = path.join(path.resolve(), "uploads/emp_profiles");
      } else if (file.fieldname === "user_documents" || file.fieldname === "newDocuments") {
        uploadDir = path.join(path.resolve(), "uploads/documents", userId.toString());
      } else {
        return cb(new Error("Invalid field name"), null);
      }

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const userId = req.body.user_id || Date.now();

      // Track uploaded files for cleanup
      if (!req.uploadedFiles) req.uploadedFiles = [];

      if (file.fieldname === "profile_pic") {
        const filePath = path.join(path.resolve(), "uploads/emp_profiles", `${userId}${path.extname(file.originalname)}`);
        req.uploadedFiles.push(filePath);
        cb(null, `${userId}${path.extname(file.originalname)}`);
      } else {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const originalName = file.originalname.replace(/[^a-zA-Z0-9._]/g, "_");
        const filePath = path.join(path.resolve(), "uploads/documents", req.userCode || "temp", uniqueSuffix + "-" + originalName);
        req.uploadedFiles.push(filePath);
        cb(null, uniqueSuffix + "-" + originalName);
      }
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.fieldname === "profile_pic" && !file.mimetype.startsWith("image/")) {
      cb(new Error("Profile picture must be an image"), false);
    } else if (
      (file.fieldname === "user_documents" || file.fieldname === "newDocuments") &&
      !file.mimetype.startsWith("image/") &&
      file.mimetype !== "application/pdf"
    ) {
      cb(new Error("Documents must be images or PDFs"), false);
    } else {
      cb(null, true);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }).fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "newDocuments", maxCount: 5 },
    { name: "user_documents", maxCount: 5 },
  ]);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        // Delete all newly uploaded files
        if (req.uploadedFiles) {
          req.uploadedFiles.forEach((filePath) => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          });
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};


const getUserDocuments = (req, res) => {
  const userCode = req.params.user_code;
  const dir = path.join(__dirname, "../uploads/documents", userCode);

  if (!fs.existsSync(dir)) {
    return res.json([]); // no files
  }

  const files = fs.readdirSync(dir).map((filename) => ({ filename }));
  res.json(files);
};


const uploadDocuments = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;

      if (file.fieldname === "expense_file") {
        uploadDir = path.join(path.resolve(), "uploads/expenses_files");
      } else {
        return cb(new Error("Invalid field name"), null);
      }

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const date =  Date.now();
      const on = file.originalname.trim().split(".")[0]
      // Track uploaded files for cleanup
      if (!req.uploadedFiles) req.uploadedFiles = [];
      if (file.fieldname == "expense_file") {
        const filePath = path.join(path.resolve(), "uploads/expenses_files", `${date}_${path.extname(file.originalname)}`);
        req.uploadedFiles.push(filePath);
        cb(null, `${date}_${on}${path.extname(file.originalname)}`);
      } else {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const originalName = file.originalname.replace(/[^._]/g, "_");
        const filePath = path.join(path.resolve(), "uploads/expenses_files", uniqueSuffix + "-" + originalName);
        req.uploadedFiles.push(filePath);
        cb(null, uniqueSuffix + "-" + originalName);
      }
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      (file.fieldname === "expense_file") &&
      !file.mimetype.startsWith("image/") &&
      file.mimetype !== "application/pdf"
    ) {
      cb(new Error("Documents must be images or PDFs"), false);
    } else {
      cb(null, true);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }).fields([
    { name: "expense_file", maxCount: 1 },
  ]);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        // Delete all newly uploaded files
        if (req.uploadedFiles) {
          req.uploadedFiles.forEach((filePath) => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          });
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};


module.exports = { 
  uploadImage, 
  uploadProfileAndDocuments,
  getUserDocuments,
  uploadDocuments
 }  


