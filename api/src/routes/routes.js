const express = require("express");
const router = express.Router();

// v1
router.use("/v1/auth", require("./v1/authRoutes"));

module.exports = router;
