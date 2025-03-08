const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },

    userId: {
      type: String,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Technical Support",
        "Billing & Payment",
        "General Inquiry",
        "Feature Request",
      ],
    },

    status: {
      type: String,
      default: "Open",
      enum: ["Open", "In Progress", "Resolved", "Closed"],
    },

    priority: {
      type: String,
      default: "Medium",
      enum: ["Low", "Medium", "High", "Critical"],
    },

    assignee: {
      type: String,
      ref: "User",
      default: null,
    },

    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    resolutionNotes: {
      type: String,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexing for faster searches
ticketSchema.index({ userId: 1, status: 1, priority: -1 });

module.exports = mongoose.model("Ticket", ticketSchema);
