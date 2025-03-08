const express = require("express");

const {
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  updateUserByAdmin,
  deleteUserByAdmin,
  addUserByAdmin,
  getDashboardData,
} = require("../../controllers/v1/userController");

const { protect } = require("../../middleware/authMiddleware");
const { restrictTo } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getDashboardData);
router.get("/all", protect, restrictTo("super-admin"), getAllUsers);
router.get("/profile", protect, getUserProfile);

router.post("/", protect, restrictTo("super-admin"), addUserByAdmin);

router.put("/profile", protect, updateUserProfile);
router.put("/:userId", protect, restrictTo("super-admin"), updateUserByAdmin);

router.delete(
  "/:userId",
  protect,
  restrictTo("super-admin"),
  deleteUserByAdmin
);

module.exports = router;
