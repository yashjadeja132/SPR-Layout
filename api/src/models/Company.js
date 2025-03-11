const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const companySchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      default: () => uuidv4(),
      immutable: true,
    },

    companyName: {
      type: String,
      required: [true, "Company name is required!"],
      unique: true,
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

companySchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

companySchema.pre(["find", "findOne", "findOneAndUpdate"], function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("companies", companySchema);
