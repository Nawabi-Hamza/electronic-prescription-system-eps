const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { updatePassword, updateProfilePicture, ownerlogin, clientLogin, getUserFromTokenClient, getUserFromTokenOwner } = require("../controllers/authController")
const { loginSchema, updatePasswordSchema } = require("../validators/authSchema")
const validateSchema = require('../validators/validateSchema');

const authMiddleware = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/multer');
const { sanitizeInput } = require('../middlewares/sanitizeHtml');
const { ownerLoginLimiter, clientLoginLimiter, clientUploadFileLimiter } = require('../middlewares/rateLimit');

router.use(sanitizeInput)

const uploadProfilePicture = {
      fieldName: "profile",
      uploadDir: "profiles",
      maxFileSizeMB: 5,
      maxFiles: 1,
      multiple: false,
      allowedTypes: ["image/"],
      allowedExt: [".jpg", ".jpeg", ".png"],
      required: true
}

// Owner login have limit if 5 time enter wrong password it blocked for one day
router.post('/owner/login', ownerLoginLimiter, validateSchema(loginSchema), ownerlogin);
router.get('/owner/identify', authMiddleware, getUserFromTokenOwner);
router.put('/user/update-password', authMiddleware, validateSchema(updatePasswordSchema), updatePassword);
router.put('/user/update-profile', clientUploadFileLimiter, authMiddleware, uploadFile(uploadProfilePicture), updateProfilePicture);

router.post("/doctor/login", clientLoginLimiter, validateSchema(loginSchema), clientLogin)
router.get('/doctor/identify', authMiddleware, getUserFromTokenClient);


module.exports = router;
