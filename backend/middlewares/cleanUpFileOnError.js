const fs = require("fs")

// Middleware to clean up uploaded file on error
const cleanupFileOnError = (req, res, next) => {
  res.on("finish", () => {
    // If response failed (>=400) and a file was uploaded
    if (res.statusCode >= 400 && req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Failed to delete file:", err);
          } else {
            console.log("Removed file due to error:", filePath);
          }
        });
      }
    }
  });
  next();
};

module.exports = { cleanupFileOnError };
