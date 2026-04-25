import express from 'express';
import { check } from 'express-validator';
import { 
  getCurrentUser,
  updateUser,
  deleteUser,
  getUserStats,
  getPracticeHistory // <-- assuming you use this later
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, getCurrentUser);

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', [
  protect,
  check('name', 'Name is required').optional(),
  check('email', 'Please include a valid email').optional().isEmail()
], updateUser);

// @route   DELETE /api/users/me
// @desc    Delete user
// @access  Private
router.delete('/me', protect, deleteUser);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, getUserStats);

// If you also use getPracticeHistory:
router.get('/history', protect, getPracticeHistory);

export default router;
