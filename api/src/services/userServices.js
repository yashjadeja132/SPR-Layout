const User = require("../models/User");
const Company = require("../models/Company");

exports.createUser = async (payload) => {
  try {
    const companyExists = await Company.findOne({
      companyId: payload.companyId,
    }).notDeleted();
    if (!companyExists) {
      return { success: false, message: "Company does not exist." };
    }

    const user = await User.create(payload);
    return { success: true, user };
  } catch (error) {
    let errorMessage = "Error creating user.";

    if (error.code === 11000) {
      errorMessage = "Email already exists for this role.";
    } else if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    }

    return { success: false, error: error.message, message: errorMessage };
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findOne({ userId }).notDeleted();
    if (!user) return { success: false, message: "User not found" };
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error fetching user.",
    };
  }
};

exports.getUserByEmailAndRole = async (email, role) => {
  try {
    const user = await User.findOne({ email, role }).notDeleted();
    if (!user) return { success: false, message: "User not found" };
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error fetching user.",
    };
  }
};

exports.getAllUsers = async () => {
  try {
    const users = await User.find().notDeleted();
    return { success: true, users };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error fetching users.",
    };
  }
};

exports.updateUser = async (userId, updates) => {
  try {
    const user = await User.findOneAndUpdate({ userId }, updates, {
      new: true,
    }).notDeleted();
    if (!user) return { success: false, message: "User not found or deleted" };
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error updating user.",
    };
  }
};

exports.softDeleteUser = async (userId) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { isDeleted: true },
      { new: true }
    );
    if (!user) return { success: false, message: "User not found" };
    return { success: true, message: "User soft deleted successfully" };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error deleting user.",
    };
  }
};

exports.restoreUser = async (userId) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { isDeleted: false },
      { new: true }
    );
    if (!user)
      return { success: false, message: "User not found or already active" };
    return { success: true, message: "User restored successfully" };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error restoring user.",
    };
  }
};

exports.permanentlyDeleteUser = async (userId) => {
  try {
    const user = await User.findOneAndDelete({ userId });
    if (!user) return { success: false, message: "User not found" };
    return { success: true, message: "User permanently deleted" };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error deleting user permanently.",
    };
  }
};
