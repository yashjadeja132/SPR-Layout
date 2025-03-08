const express = require("express");
const router = express.Router();
require("../config/env");

// v1
router.use("/v1/auth", require("./v1/authRoutes"));
router.use("/v1/user", require("./v1/userRoutes"));
router.use("/v1/ticket", require("./v1/ticketRoutes"));

module.exports = router;
