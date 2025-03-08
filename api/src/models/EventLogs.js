const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const eventLogSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      default: () => uuidv4(),
    },

    userId: {
      type: String,
      required: true,
      ref: "User",
    },

    eventType: {
      type: String,
      required: true,
      enum: [
        "REGISTRATION",
        "LOGIN",
        "LOGOUT",
        "UPDATE_PROFILE",
        "CREATE_TICKET",
        "ADMIN_UPDATE_USER",
        "ADMIN_DELETE_USER",
        "UPDATE_TICKET",
        "DELETE_TICKET",
        "ADMIN_ADD_USER",
      ],
    },

    eventDescription: {
      type: String,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

eventLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("EventLog", eventLogSchema);
