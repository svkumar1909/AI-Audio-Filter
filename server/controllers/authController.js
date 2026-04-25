import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  try {
    // ✅ HANDLE VALIDATION ERRORS
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg // ✅ send clean message
      });
    }

    const { name, email, password, nativeLanguage, targetLanguage } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      nativeLanguage,
      targetLanguage
    });

    // Generate JWT token
    const token = user.getSignedJwtToken();
    console.log(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        nativeLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
        proficiencyLevel: user.proficiencyLevel
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
});

// @desc    Login user
export const login = asyncHandler(async (req, res) => {
  try {
    // ✅ HANDLE VALIDATION ERRORS
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        nativeLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
        proficiencyLevel: user.proficiencyLevel
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
});

// @desc    Get current logged in user
export const getMe = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json(user); // ✅ matches frontend
  } catch (error) {
    console.error("GET ME ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

// @desc    Update user details
export const updateDetails = asyncHandler(async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      nativeLanguage: req.body.nativeLanguage,
      targetLanguage: req.body.targetLanguage,
      proficiencyLevel: req.body.proficiencyLevel
    };

    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

// @desc    Update password
export const updatePassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });

  } catch (error) {
    console.error("PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

// Not implemented routes
export const forgotPassword = asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet'
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet'
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet'
  });
});