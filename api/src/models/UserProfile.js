const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userProfileSchema = new mongoose.Schema(
  {
    userProfileId: {
      type: String,
      default: () => uuidv4(),
    },

    userId: {
      type: String,
      required: [true, "User ID is required."],
      ref: "users",
    },

    name: {
      type: String,
      required: [true, "User name is required! Please provide your name."],
      trim: true,
    },

    userDetails: {
      type: Object,
      default: null,
    },

    address: {
      type: String,
      default: null,
    },

    state: {
      type: String,
      default: null,
    },

    country: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userProfileSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

userProfileSchema.index({ userId: 1 });

userProfileSchema.pre("save", async function (next) {
  const User = mongoose.model("users");
  const userExists = await User.findOne({ userId: this.userId });
  if (!userExists) {
    return next(new Error("User ID does not exist."));
  }
  next();
});

module.exports = mongoose.model("user-profiles", userProfileSchema);
