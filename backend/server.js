require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const { logger } = require("./middlewares/logger");
const routes = require("./routesPath");
const { limitAPR } = require("./middlewares/rateLimit");
const { corsConfig } = require("./middlewares/cors");

const app = express();

// ====== Global Middleware ======
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(logger);
app.use(limitAPR)
app.use(corsConfig)



// ====== Block Requests Without Allowed Origin (Postman, Burp Suit) ======
const allowedOrigins = [
  process.env.FRONTEND_ADDRESS_1,
  process.env.FRONTEND_ADDRESS_2,
  process.env.FRONTEND_ADDRESS_3,
  process.env.FRONTEND_ADDRESS_4,
];  
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) return next();
  res.status(403).json({ message: "Access denied" });
});

// ====== Routes ======
// app.get("/", (_, res) => res.send("PaikarSoft EPS API System"));
app.use("/api", routes);
// app.use("/api/v1/uploads", express.static( path.join(__dirname, "uploads"), { maxAge: "10d", etag: true, immutable: true,} ));
const filePath = process.env.FILE_PATH
// app.use("/api/v1/uploads", express.static( path.join(__dirname, filePath), { maxAge: "10d", etag: true, immutable: true,} ));
// app.use(
//   "/api/v1/uploads",
//   express.static(path.join(process.cwd(), filePath), {
//     maxAge: "10d",
//     etag: true,
//     immutable: true,
//   })
// );
app.use(
  "/api/v1/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    maxAge: "7d",
    etag: true,
    immutable: true,
  })
);

// ====== 404 Handler ======
app.use((req, res) => res.status(404).json({ error: "Not Found", message: `Route ${req.originalUrl} does not exist` }));

// ====== Error Handler ======
app.use(errorHandler);

// ====== Server Start ======
// const PORT = process.env.SERVER_PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`\x1b[34m✅ Server running → http://localhost:${PORT}\x1b[0m`);
//   console.log(`\x1b[34m📁 Serving images from: ${path.join(__dirname, "uploads")}\x1b[0m`);
// });


module.exports = app;
