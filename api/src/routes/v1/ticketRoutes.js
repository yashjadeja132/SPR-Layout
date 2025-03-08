const express = require("express");
const {
  createTicket,
  getAllTickets,
  getTickets,
} = require("../../controllers/v1/ticketController");
const { protect } = require("../../middleware/authMiddleware");
const { restrictTo } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/all", protect, restrictTo("super-admin"), getAllTickets);
router.get("/", protect, getTickets);

module.exports = router;
