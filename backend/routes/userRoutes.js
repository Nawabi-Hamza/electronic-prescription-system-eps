const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { registerUserSchema, updateUserHRSchema } = require('../validators/schemas');
const validateRequest = require('../middlewares/validateRequest');
const {  uploadProfileAndDocuments, getUserDocuments } = require('../middlewares/multer');
const { addUserSchema } = require('../validators/userSchemas');
const { default: cleanupFileOnError } = require('../middlewares/cleanUpFileOnError');
const { sanitizeInput } = require('../validators/sanitizeHtml');

// Protect all routes, allow only admin or manager to manage users
router.use(authMiddleware);
router.use(roleCheck(['hr']));
router.use(sanitizeInput)

router.get('/', userController.getAllUsers);           // GET /users  - list all users
router.post('/', validateRequest(registerUserSchema), userController.registerUser)
router.get('/:id', userController.getUserById);         // GET /users/:id - get user by id
router.put('/:id', userController.updateUser);           // PUT /users/:id - update user
router.delete('/:id', roleCheck(['owner']), userController.deleteUser);  

const createNextId = async (req, res, next) => {
    req.userCode = await userController.getNextUserCode();
    next();
}

router.post("/hr", validateRequest(addUserSchema), createNextId, uploadProfileAndDocuments(),
                userController.checkDulicateEmailPhoneGenUserCode, userController.AddUserHR);


router.get("/hr/:user_code", userController.getUserByUserCode);
router.delete("/hr/:user_code", userController.deleteUserHR);
router.put("/hr/:user_code", validateRequest(updateUserHRSchema), uploadProfileAndDocuments(),
                    userController.checkEmailOrPhone,userController.updateUserHR);
router.get("/hr/files/:user_code", getUserDocuments);

// DELETE /users/:id - delete user

module.exports = router;
