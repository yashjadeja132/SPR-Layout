const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: () => uuidv4(),
    },

    email: {
      type: String,
      required: [
        true,
        "E-mail is required! Please provide a valid e-mail address.",
      ],
      lowercase: [true, "E-mail must be in lowercase format."],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid e-mail address.",
      ],
    },

    password: {
      type: String,
      required: [
        true,
        "Password is required! Please provide a secure password.",
      ],
      minlength: [6, "Password length must be at least 6 characters."],
    },

    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "admin", "super-admin"],
        message: "Role must be one of 'user', 'super-admin, or 'admin'.",
      },
    },

    isTrial: {
      type: Boolean,
      default: true,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual("userProfile", {
  ref: "user-profiles",
  localField: "userId",
  foreignField: "userId",
  justOne: true,
});

userSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

userSchema.index({ email: 1 });

module.exports = mongoose.model("users", userSchema);
