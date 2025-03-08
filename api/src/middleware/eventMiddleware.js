const EventLog = require("../models/EventLogs");

async function logUserEvent(
  userId,
  eventType,
  eventDescription = null,
  metadata = {}
) {
  try {
    await EventLog.create({
      userId,
      eventType,
      eventDescription,
      metadata,
    });
    console.log(`Event logged: ${eventType} for user ${userId}`);
  } catch (error) {
    console.error("Error logging event:", error);
  }
}

module.exports = { logUserEvent };
