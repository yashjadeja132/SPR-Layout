const { logUserEvent } = require("../../middleware/eventMiddleware");
const User = require("../../models/User");
const UserProfile = require("../../models/UserProfile");
const Tickets = require("../../models/Tickets");
const { updateUserProfileSchema } = require("../../validators/userValidation");
const { registerSchema } = require("../../validators/authValidator");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const { userRole = "user" } = req.query;

    const users = await User.aggregate([
      {
        $match: {
          role: userRole,
          isDeleted: false, // Ensure we only fetch non-deleted users
        },
      },
      {
        $lookup: {
          from: "user-profiles", // Ensure correct collection name
          localField: "userId",
          foreignField: "userId",
          as: "userProfile",
        },
      },
      {
        $unwind: {
          path: "$userProfile",
          preserveNullAndEmptyArrays: true, // Prevents errors if no profile exists
        },
      },
      {
        $addFields: {
          name: "$userProfile.name",
        },
      },
      {
        $project: {
          password: 0,
          userProfile: 0,
        },
      },
    ]);

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

    const { name, email, role, password, isNotificationActive } = value;

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
        ...{ isNotificationActive },
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

exports.updateUserByAdmin = async (req, res) => {
  try {
    const adminUser = req.user;

    const { userId } = req.params;
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

    if (adminUser.role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied: Only super-admins can update users",
      });
    }

    const userProfile = await UserProfile.findOne({ userId });
    const userAccount = await User.findOne({ userId });

    if (!userProfile || !userAccount) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Prevent non-super-admins from updating super-admins
    if (
      userAccount.role === "super-admin" &&
      adminUser.role !== "super-admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Permission denied: Only super-admins can update super-admins",
      });
    }

    // Check if email is already taken (excluding current user)
    if (email && email !== userAccount.email) {
      const existingUser = await User.findOne({
        email,
        isActive: true,
        isDeleted: false,
        userId: { $ne: userId }, // Exclude the user being updated
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
      { userId },
      {
        ...(email && { email }),
        ...(hashedPassword && { password: hashedPassword }),
        ...(role && { role }),
      },
      { new: true, runValidators: true }
    );

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { ...(name && { name }) },
      { new: true, runValidators: true }
    );

    logUserEvent(
      adminUser.userId,
      "ADMIN_UPDATE_USER",
      `Super admin ${adminUser.email} updated user ${updatedUser.email}`,
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
      message: "User updated successfully",
      userProfile: updatedProfile,
      user: {
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user by admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteUserByAdmin = async (req, res) => {
  try {
    const adminUser = req.user; // Authenticated admin user
    const { userId } = req.params; // User ID to delete

    // Only super-admins can delete users
    if (adminUser.role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied: Only super-admins can delete users",
      });
    }

    // Find user and profile
    const userAccount = await User.findOne({ userId });
    const userProfile = await UserProfile.findOne({ userId });

    if (!userAccount || !userProfile) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Prevent deleting other super-admins
    if (userAccount.role === "super-admin") {
      return res.status(403).json({
        success: false,
        message:
          "Permission denied: Super-admins cannot delete other super-admins",
      });
    }

    // Check if the user is already deleted
    if (userAccount.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "User is already deleted",
      });
    }

    // Soft delete the user
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: { isDeleted: true } },
      { new: true }
    );

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { isDeleted: true } },
      { new: true }
    );

    logUserEvent(
      adminUser.userId,
      "ADMIN_DELETE_USER",
      `Super-admin ${adminUser.email} deleted user ${updatedUser?.email}`
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user by admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.addUserByAdmin = async (req, res) => {
  try {
    const adminUser = req.user; // Authenticated admin (must be super-admin)

    if (adminUser.role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied: Only super-admins can add users",
      });
    }

    // Validate request body
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { name, email, role, password } = value;

    // Prevent adding another super-admin
    if (role === "super-admin" && adminUser.role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied: Cannot create another super-admin",
      });
    }

    // Check if email is already taken
    const existingUser = await User.findOne({
      email,
      isActive: true,
      isDeleted: false,
    }).lean();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "E-mail is already registered!",
      });
    }

    // Generate a unique user ID
    const userId = `user_${Date.now()}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      userId,
      email,
      role,
      password: hashedPassword,
      isActive: true,
      isDeleted: false,
    });

    await newUser.save();

    // Create user profile
    const newUserProfile = new UserProfile({
      userId,
      name,
      isDeleted: false,
    });

    await newUserProfile.save();

    // Log event
    logUserEvent(
      adminUser.userId,
      "ADMIN_ADD_USER",
      `Super-admin ${adminUser.email} added a new user ${email}`
    );

    res.status(201).json({
      success: true,
      message: "User added successfully",
      user: {
        userId,
        email,
        role,
        name,
      },
    });
  } catch (error) {
    console.error("Error adding user by admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const user = req.user;
    let dashboardData = {};

    if (user.role === "super-admin") {
      const [usersCount, ticketsCount, adminsCount, staffsCount] =
        await Promise.all([
          User.countDocuments({ role: "user", isDeleted: false }),
          Tickets.countDocuments({ isDeleted: false }),
          User.countDocuments({ role: "admin", isDeleted: false }),
          User.countDocuments({ role: "staff", isDeleted: false }),
        ]);

      dashboardData = {
        users: usersCount,
        tickets: ticketsCount,
        admins: adminsCount,
        staffs: staffsCount,
      };
    } else if (user.role === "admin") {
      const [usersCount, ticketsCount, staffsCount] = await Promise.all([
        User.countDocuments({ role: "user", isDeleted: false }),
        Tickets.countDocuments({ isDeleted: false }),
        User.countDocuments({ role: "staff", isDeleted: false }),
      ]);

      dashboardData = {
        users: usersCount,
        tickets: ticketsCount,
        staffs: staffsCount,
      };
    } else {
      const [ticketsCount, staffsCount] = await Promise.all([
        Tickets.countDocuments({
          $or: [{ userId: user.userId }, { assignee: user.userId }],
          isDeleted: false,
        }),
        User.countDocuments({ role: "staff", isDeleted: false }),
      ]);

      dashboardData = {
        tickets: ticketsCount,
        staffs: staffsCount,
      };
    }

    res.status(200).json({
      success: true,
      dashboardData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
