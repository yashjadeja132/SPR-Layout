const UserProfile = require("../models/UserProfile");
const User = require("../models/User");

exports.createUserProfile = async (payload) => {
  try {
    const userExists = await User.findOne({
      userId: payload.userId,
    }).notDeleted();
    if (!userExists) {
      return { success: false, message: "User does not exist." };
    }

    const userProfile = await UserProfile.create(payload);
    return { success: true, userProfile };
  } catch (error) {
    let errorMessage = "Error creating user profile.";

    if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    }

    return { success: false, error: error.message, message: errorMessage };
  }
};

exports.getUserProfileByUserId = async (userId) => {
  try {
    const userProfile = await UserProfile.findOne({ userId }).notDeleted();
    if (!userProfile)
      return { success: false, message: "User profile not found" };
    return { success: true, userProfile };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error fetching user profile.",
    };
  }
};

exports.getAllUserProfiles = async () => {
  try {
    const userProfiles = await UserProfile.find().notDeleted();
    return { success: true, userProfiles };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error fetching user profiles.",
    };
  }
};

exports.updateUserProfile = async (userId, updates) => {
  try {
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      updates,
      { new: true }
    ).notDeleted();
    if (!userProfile)
      return { success: false, message: "User profile not found or deleted" };
    return { success: true, userProfile };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error updating user profile.",
    };
  }
};

exports.softDeleteUserProfile = async (userId) => {
  try {
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { isDeleted: true },
      { new: true }
    );
    if (!userProfile)
      return { success: false, message: "User profile not found" };
    return { success: true, message: "User profile soft deleted successfully" };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error deleting user profile.",
    };
  }
};

exports.restoreUserProfile = async (userId) => {
  try {
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { isDeleted: false },
      { new: true }
    );
    if (!userProfile)
      return {
        success: false,
        message: "User profile not found or already active",
      };
    return { success: true, message: "User profile restored successfully" };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error restoring user profile.",
    };
  }
};

exports.permanentlyDeleteUserProfile = async (userId) => {
  try {
    const userProfile = await UserProfile.findOneAndDelete({ userId });
    if (!userProfile)
      return { success: false, message: "User profile not found" };
    return { success: true, message: "User profile permanently deleted" };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error deleting user profile permanently.",
    };
  }
};
