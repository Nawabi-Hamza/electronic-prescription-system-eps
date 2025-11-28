const express = require("express")
const router = express.Router();
const { sendWhatsAppMessage, getQRStatus, regenerateQR, sendWhatsAppGroupMessage, getWhatsAppGroups, sendWhatsAppMessageByApi } = require("../controllers/whatsApp");


// Middlewares
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { sanitizeInput } = require('../middlewares/sanitizeHtml');


// Auth & role middleware
router.use(sanitizeInput)
router.use(authMiddleware);
router.use(roleCheck(['manager']))


// WhatsApp Configuration 
router.get("/generate-qr", (req,res)=>{
    const status = getQRStatus()
    res.send(status)
})

router.post("/regenerate-qr", async (req, res) => {
  try {
    // regenerate QR and re-initialize client
    await regenerateQR();

    // Wait a short moment for the QR to be generated
    setTimeout(() => {
      const status = getQRStatus(); // get the new QR and connection status
      res.json({ success: true, ...status });
    }, 1000); // 1 second delay to allow QR generation

  } catch (err) {
    console.error("❌ Failed to regenerate QR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


router.post("/message/send", sendWhatsAppMessageByApi);

router.post("/message/group-send", sendWhatsAppGroupMessage);

// Fetch all groups
router.get("/groups", getWhatsAppGroups);

module.exports = router;
