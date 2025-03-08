const sendMail = require("../../helpers/email");
const { logUserEvent } = require("../../middleware/eventMiddleware");
const Tickets = require("../../models/Tickets");
const User = require("../../models/User");
const {
  ticketSchema,
  updateTicketSchema,
} = require("../../validators/ticketValidation");

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

exports.getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets;

    if (user.role === "super-admin") {
      tickets = await Tickets.find({ isDeleted: false });
    } else {
      tickets = await Tickets.find({ userId: user.userId, isDeleted: false });
    }

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Validate request body
    const { error, value } = updateTicketSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    // Find ticket
    const ticket = await Tickets.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Update ticket fields
    Object.assign(ticket, value);
    await ticket.save();

    // Log event
    logUserEvent(
      req.user.userId,
      "UPDATE_TICKET",
      `User ${req.user.email} updated ticket ${ticketId}`,
      ticket
    );

    const user = await User.findOne({
      userId: ticket.userId,
      isNotificationActive: true,
    });

    if (user) {
      // Prepare email details
      const mailOptions = {
        from: process.env.NODE_MAILER_USER,
        to: user.email,
        subject: `Ticket Update: ${ticket.subject || "No Subject"}`,
        html: `
      <p>Dear User,</p>
      <p>Your ticket with ID <b>${ticketId}</b> has been updated.</p>
        <p><b>Status:</b> ${ticket.status}</p>
        <p><b>Updated By:</b> ${req.user.name}</p>
        <p>For more details, please log in to your account.</p>
        <p>Best Regards,</p>
        <p>Your Support Team</p>
        `,
      };
    }

    // Send email notification
    await sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully, email notification sent",
      ticket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const user = req.user; // Authenticated user
    const { ticketId } = req.params; // Ticket ID from request

    // Find the ticket
    const ticket = await Tickets.findOne({ _id: ticketId });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Check if the ticket is already deleted
    if (ticket.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Ticket is already deleted",
      });
    }

    // Soft delete the ticket
    await Tickets.findByIdAndUpdate(
      ticketId,
      { $set: { isDeleted: true } },
      { new: true }
    );

    logUserEvent(
      user.userId,
      "DELETE_TICKET",
      `User ${user.email} deleted ticket ${ticketId}`
    );

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
