const express = require("express");
const {
  getUserProfile,
  getAllUsers,
  updateUserProfile,
} = require("../../controllers/v1/userController");
const { protect } = require("../../middleware/authMiddleware");
const { restrictTo } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get("/all", protect, restrictTo("super-admin"), getAllUsers);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
