const express = require("express")
const version = express()

// import routes
//////////////////////////////////////////
const authRoute = require("./routes/authRoutes")
const ownerRoute = require("./routes/ownerRoutes")
const doctorRoute = require("./routes/doctorRoutes")
const visitorRoute = require("./routes/visitorRoutes")


version.use("/v1/auth", authRoute)
version.use("/v1/owner", ownerRoute)
version.use("/v1/doctor", doctorRoute)
version.use("/v1/visitor", visitorRoute)
////////////////////////////////////////////


module.exports = version;