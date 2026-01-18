const os = require("os");

const ALLOWED_MACS = [
  "28-16-AD-D1-C9-6E",
  "28-16-AD-D1-C9-72",
  "0A-00-27-00-00-18",
  "0A-00-27-00-00-0E"
];

// normalize mac → AA-BB-CC-DD-EE-FF
function normalizeMac(mac) {
  return mac.replace(/:/g, "-").toUpperCase();
}

// get server macs ONCE
function getServerMacs() {
  const nets = os.networkInterfaces();
  const macs = new Set();

  for (const iface of Object.values(nets)) {
    for (const net of iface) {
      if (!net.internal && net.mac && net.mac !== "00:00:00:00:00:00") {
        macs.add(normalizeMac(net.mac));
      }
    }
  }

  return [...macs];
}

// cache at startup
const SERVER_MACS = getServerMacs();

// console.log("Server MACs:", SERVER_MACS);

const macGuard = (req, res, next) => {
  const allowed = SERVER_MACS.some(mac =>
    ALLOWED_MACS.includes(mac)
  );

  if (!allowed) {
    console.error("❌ License violation: Unauthorized machine", SERVER_MACS);
    return res.status(403).json({
      message: "Access denied: unauthorized machine",
    });
  }

  next();
};

module.exports = { macGuard };
