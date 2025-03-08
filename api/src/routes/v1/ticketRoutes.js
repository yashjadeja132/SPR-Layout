const express = require("express");
const {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
} = require("../../controllers/v1/ticketController");

const { protect } = require("../../middleware/authMiddleware");
const { restrictTo } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getTickets);

router.post("/", protect, createTicket);

router.put(
  "/:ticketId",
  protect,
  restrictTo("super-admin", "admin"),
  updateTicket
);

router.delete(
  "/:ticketId",
  protect,
  restrictTo("super-admin", "admin"),
  deleteTicket
);

module.exports = router;
