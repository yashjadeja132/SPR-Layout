const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const UserProfile = require("../../models/UserProfile");
const {
  registerSchema,
  loginSchema,
} = require("../../validators/authValidator");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.userId, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION || "7d",
    }
  );
};

// Register User and Create Profile
exports.register = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        error: error.details.map((err) => err.message),
      });
    }

    const {
      name,
      email,
      password,
      address,
      state,
      country,
      userDetails,
      role,
    } = value;

    // Check if user already exists
    const existingUser = await User.findOne({
      email,
      isActive: true,
      isDeleted: false,
    }).lean();

    if (existingUser) {
      return res.status(409).json({ error: "E-mail is already registered!" });
    }

    // Create user
    const user = new User({ email, password, role });
    await user.save(); // Triggers pre-save hook for password hashing

    // Create user profile
    const userProfile = await UserProfile.create({
      userId: user.userId,
      name,
      address,
      state,
      country,
      userDetails,
    });

    // Generate token and sanitize response
    const token = generateToken(user);
    res.status(201).json({
      user: {
        id: user.userId,
        name: userProfile.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// Login User and Retrieve Profile
exports.login = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        error: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({
      email,
      isDeleted: false,
      isActive: true,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Get user profile
    const userProfile = await UserProfile.findOne({
      userId: user.userId,
    }).lean();

    // Generate token and return response
    const token = generateToken(user);
    res.json({
      user: {
        id: user.userId,
        name: userProfile?.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};
