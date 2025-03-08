const { logUserEvent } = require("../../middleware/eventMiddleware");
const User = require("../../models/User");
const UserProfile = require("../../models/UserProfile");
const { updateUserProfileSchema } = require("../../validators/userValidation");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const { userRole = "user" } = req.query;

    const users = await User.find({ role: userRole }).select("-password");

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userProfile = await UserProfile.findOne({ userId: user.userId });

    if (!userProfile) {
      return res
        .status(404)
        .json({ success: false, message: "User profile not found" });
    }

    res.status(200).json({
      success: true,

      userProfile: {
        role: user.role,
        email: user.email,
        userId: user.userId,
        name: userProfile.name,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = req.user; // Authenticated user from middleware
    const { error, value } = updateUserProfileSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { name, email, role, password } = value;

    // Find user and profile
    const userProfile = await UserProfile.findOne({ userId: user.userId });
    const userAccount = await User.findOne({ userId: user.userId });

    if (!userProfile || !userAccount) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Prevent non-admins from updating roles
    if (role && user.role !== "admin" && user.role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied: Only admins can change roles",
      });
    }

    // Check if email is already taken (excluding current user)
    if (email && email !== userAccount.email) {
      const existingUser = await User.findOne({
        email,
        isActive: true,
        isDeleted: false,
        userId: { $ne: user.userId }, // Exclude current user
      }).lean();

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "E-mail is already registered!",
        });
      }
    }

    // Hash password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { userId: user.userId },
      {
        ...(email && { email }),
        ...(hashedPassword && { password: hashedPassword }),
        ...(role && { role }),
      },
      { new: true, runValidators: true }
    );

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: user.userId },
      { ...(name && { name }) },
      { new: true, runValidators: true }
    );

    logUserEvent(
      user.userId,
      "UPDATE_PROFILE",
      `User ${user.email} update their profile`,
      {
        userProfile: updatedProfile,
        user: {
          email: updatedUser.email,
          role: updatedUser.role,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      userProfile: updatedProfile,
      user: {
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
