const express = require('express');
const router = express.Router();

const { sanitizeInput } = require('../middlewares/sanitizeHtml');
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { hesabPayPayment, verifyPayment } = require('../controllers/paymentController');

router.use(authMiddleware);
router.use(roleCheck(['doctor']));
router.use(sanitizeInput)

// Create checkout session
router.post("/hesabpay-checkout-session", hesabPayPayment);


router.get('/payment-success', verifyPayment);
router.get('/payment-failed', verifyPayment);


module.exports = router;
