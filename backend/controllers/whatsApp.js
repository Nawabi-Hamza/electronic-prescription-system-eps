const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs/promises"); // use promise-based fs

let latestQR = null;
let client = null;

// ✅ Initialize WhatsApp client safely
async function initClient() {
  console.log("🔍 Checking WhatsApp connection...");
  client = new Client({
    authStrategy: new LocalAuth({
      clientId: "manager",
      dataPath: path.join(__dirname, "../.wwebjs_auth"),
    }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", async (qr) => {
    latestQR = qr;
    console.log("📲 QR code ready to scan");
  });

  client.on("ready", () => {
    console.log("✅ WhatsApp connected!");
    latestQR = null;
  });

  client.on("auth_failure", (msg) => {
    console.error("❌ Auth failed:", msg);
    latestQR = null;
  });

  client.on("disconnected", async (reason) => {
    console.log("⚠️ WhatsApp disconnected:", reason);
    try {
      await client.destroy();
    } catch (err) {
      console.error("Error destroying client:", err.message);
    }
    initClient(); // reinitialize safely
  });
  try{
    await client.initialize();
  }catch(err){
    console.log("🚫 internet error for connecting whatsapp")
  }
}

// Start the client
initClient();

// Get QR / connection status
const getQRStatus = (req, res) => {
  if (client && client.info && client.info.wid) {
    return ({ qr: null, connected: true });
  }
  return ({ qr: latestQR, connected: false });
};


// whatsapp.js
const getWhatsAppGroups = async (req, res) => {
  try {
    if (!client.info) {
      return res.status(400).json({ message: "WhatsApp not connected" });
    }

    const chats = await client.getChats();
    const groups = chats
      .filter(chat => chat.isGroup)
      .map(group => ({
        id: group.id._serialized,
        name: group.name,
        membersCount: group.participants.length
      }));

    res.json({ success: true, groups });
  } catch (err) {
    console.error("Failed to fetch groups:", err);
    res.status(500).json({ error: err.message || "Failed to fetch groups" });
  }
};

// module.exports = {  /*, other functions like sendWhatsAppMessage */ };

// Send WhatsApp message safely
const sendWhatsAppMessage = async (phone, message) => {
  try{
    if (!client.info) throw new Error("WhatsApp not connected");
  
    let cleanNumber = phone.replace(/\D/g, "");
    if (!cleanNumber.startsWith("93")) {
      if (cleanNumber.startsWith("0")) cleanNumber = "93" + cleanNumber.slice(1);
      else throw new Error("❌ Phone number must start with 0 or 93");
    }
  
    await client.sendMessage(cleanNumber + "@c.us", message);
    console.log(`✅ Message sent to ${cleanNumber}`);
  }catch(err){
    console.log("Something wrong with whatsapp...")
  }

};
const sendWhatsAppMessageByApi = async (req, res) => {
  try {
    const { phone, message } = req.body;
    if(!phone || !message) res.status(500).json({ error: "Phone and message are required !"})
    // Check if WhatsApp client is connected
    if (!client?.info) {
      console.log(`❌ WhatsApp not connected. Cannot send message to ${phone}`);
      res.status(500).json({ error: "Whats app is not connected!" });
    }

    // Clean and validate phone number
    let cleanNumber = phone.replace(/\D/g, "");
    if (!cleanNumber.startsWith("93")) {
      if (cleanNumber.startsWith("0")) cleanNumber = "93" + cleanNumber.slice(1);
      else {
        console.log(`❌ Invalid phone number: ${phone}`);
        return;
      }
    }

    // Send message
    await client.sendMessage(cleanNumber + "@c.us", message);
    console.log(`✅ Message sent to ${cleanNumber}`);
    res.json({ success: true });
  } catch (error) {
    console.error(`❌ Failed to send WhatsApp message to ${phone}:`, error.message);
  }
};

// Send message to a WhatsApp group safely
const sendWhatsAppGroupMessage = async (req, res) => {
  try {
    const { groupId, message } = req.body;

    if (!groupId || !message) {
      return res.status(400).json({ error: "groupId and message are required" });
    }

    // Check if WhatsApp client is connected
    if (!client?.info) {
      console.log("❌ WhatsApp not connected. Cannot send group message.");
      return res.status(400).json({ error: "WhatsApp is not connected" });
    }

    // Ensure groupId format
    const formattedGroupId = groupId.endsWith("@g.us") ? groupId : `${groupId}@g.us`;

    await client.sendMessage(formattedGroupId, message);
    res.json({ success: true, message: `Message sent to group ${formattedGroupId}` });
  } catch (err) {
    console.error("❌ Failed to send group message:", err.message);
    res.status(500).json({ error: err.message || "Failed to send message" });
  }
};


// Safely remove a folder
const removeFolder = async (folderPath) => {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log(`✅ Successfully deleted folder: ${folderPath}`);
  } catch (err) {
    console.error(`❌ Error deleting folder: ${err.message}`);
  }
};

// Regenerate QR manually
const regenerateQR = async () => {
  try {
    // destroy client first
    if (client) {
      await client.destroy();
      client = null;
    }

    // remove old session folders
    await removeFolder(path.join(__dirname, "../.wwebjs_auth"));
    await removeFolder(path.join(__dirname, "../.wwebjs_cache"));

    latestQR = null;
    await initClient(); // reinitialize client and generate new QR
    return { success: true };
  } catch (err) {
    console.error("❌ Failed to regenerate QR:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  getQRStatus,
  sendWhatsAppMessage,
  regenerateQR,
  sendWhatsAppGroupMessage,
  getWhatsAppGroups,
  sendWhatsAppMessageByApi
};
