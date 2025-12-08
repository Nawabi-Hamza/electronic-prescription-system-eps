const rateLimit = require("express-rate-limit");

const limitAPR = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: Number(process.env.LIMIT_ACCESS_API) || 1000,
    message: {
      status: 429,
      error: "Too many requests",
      message: "You’ve reached the request limit. Please try again in an hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
})

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 5,
  message: { message: '⏳ Too many login attempts, try again in 60s.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // ✅ successful logins don't count
});

const ownerLoginLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hour
  max: 5,
  message: { message: '⏳ Too many login attempts, try again in 24 Hour.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // ✅ successful logins don't count
});

const clientLoginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: '⏳ Too many login attempts, try again in 1 Hour.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // ✅ successful logins don't count
});

const clientUploadFileLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hour
  max: 3,
  message: { message: '⏳ Your limit reach 3 time upload files, your can upload file tomorrow after 24 Hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const clientUpdateHeaderLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hour
  max: 5,
  message: { message: '⏳ Your limit reach 5 time upload files, your can upload file tomorrow after 24 Hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const visitorTakeAppointmentLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // user can submit 5 appointments per day
  message: {
    status: false,
    message: "⏳ You have reached the daily limit of 5 appointments. Try again after 24 hours."
  },
  standardHeaders: true,
  legacyHeaders: false,
});


module.exports = {
    limitAPR,
    loginLimiter,
    ownerLoginLimiter,
    clientLoginLimiter,
    clientUploadFileLimiter,
    clientUpdateHeaderLimiter,
    visitorTakeAppointmentLimit

}