const cors = require("cors");

const allowedOrigins = [
  process.env.FRONTEND_ADDRESS_1,   
  process.env.FRONTEND_ADDRESS_2,  
  process.env.FRONTEND_ADDRESS_3,   
  process.env.FRONTEND_ADDRESS_4
];

const corsConfig = cors({
  origin: function (origin, callback) {
    // allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // allow this origin
    } else {
      callback(new Error(`CORS blocked: Origin ${origin} is not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Range", "Cache-Control"],
  exposedHeaders: ["Content-Range"],
  credentials: true,
});

module.exports = { corsConfig };








// const cors = require("cors")

// // const corsConfig = cors("*")
// const allowedOrigins = [
//   process.env.FRONTEND_ADDRESS_1,
//   process.env.FRONTEND_ADDRESS_2,
//   "http://127.0.0.1",
//   "http://localhost"
// ];  

// const corsConfig = cors({
//     origin: function (origin, callback) { 
//       // allow requests with no origin (like Postman) if you want 
//       if (!origin) return callback(new Error('Invalid Origin Not allowed by CORS')); 
//       if (allowedOrigins.includes(origin)) { 
//         callback(null, true); // allow this origin 
//       } else { 
//         callback(new Error(`CORS blocked: Origin ${origin} is not allowed`)); // block all others 
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization", "Range", "Cache-Control"],
//     exposedHeaders: ["Content-Range"],
//     credentials: true,
// })


// module.exports = { corsConfig } 