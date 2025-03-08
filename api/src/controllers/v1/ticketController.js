const { logUserEvent } = require("../../middleware/eventMiddleware");
const Tickets = require("../../models/Tickets");
const { ticketSchema } = require("../../validators/ticketValidation");

exports.createTicket = async (req, res) => {
  try {
    const { error, value } = ticketSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const userId = req.user.userId;

    const newTicket = await Tickets.create({ userId, ...value });

    logUserEvent(
      req.user.userId,
      "CREATE_TICKET",
      `User ${req.user.email} create new ticket`,
      newTicket
    );

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Tickets.find();

    res.status(200).json({ success: true, count: tickets.length, tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const user = req.user;

    const tickets = await Tickets.find({ userId: user.userId });

    res.status(200).json({ success: true, count: tickets.length, tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
