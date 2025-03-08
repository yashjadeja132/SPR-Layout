const express = require("express");
const { register, login, verifyToken } = require("../../controllers/v1/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-token", verifyToken);

module.exports = router;
