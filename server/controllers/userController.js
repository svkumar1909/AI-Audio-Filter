import User from '../models/User.js';
import Recording from '../models/Recording.js';
import Analysis from '../models/Analysis.js';

// Get current user's profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error getting current user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  const { name, email, nativeLanguage, learningLanguage, preferredAccent } = req.body;
  
  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (nativeLanguage) userFields.nativeLanguage = nativeLanguage;
  if (learningLanguage) userFields.learningLanguage = learningLanguage;
  if (preferredAccent) userFields.preferredAccent = preferredAccent;
  
  try {
    // Update user profile
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    // Get recordings count
    const recordingsCount = await Recording.countDocuments({ user: req.user.id });
    
    // Get average pronunciation score
    const analyses = await Analysis.find({ user: req.user.id });
    let totalScore = 0;
    
    if (analyses.length > 0) {
      analyses.forEach(analysis => {
        totalScore += analysis.overallScore;
      });
      
      const averageScore = totalScore / analyses.length;
      
      // Get improvement over time (using the last 10 recordings)
      const recentAnalyses = await Analysis.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(10);
      
      // Calculate progress trend
      let progressTrend = null;
      if (recentAnalyses.length >= 2) {
        const oldestScore = recentAnalyses[recentAnalyses.length - 1].overallScore;
        const newestScore = recentAnalyses[0].overallScore;
        progressTrend = newestScore - oldestScore;
      }
      
      res.json({
        recordingsCount,
        averageScore,
        progressTrend,
        totalPracticeMinutes: analyses.length * 2 // Assuming each practice is about 2 minutes
      });
    } else {
      res.json({
        recordingsCount: 0,
        averageScore: 0,
        progressTrend: 0,
        totalPracticeMinutes: 0
      });
    }
  } catch (err) {
    console.error('Error getting user stats:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    // Delete user's recordings
    await Recording.deleteMany({ user: req.user.id });
    
    // Delete user's analyses
    await Analysis.deleteMany({ user: req.user.id });
    
    // Delete user
    await User.findByIdAndDelete(req.user.id);
    
    res.json({ message: 'User account and all associated data deleted' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user practice history
export const getPracticeHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user.id })
      .populate('recording', 'audioUrl textPrompt')
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 10);
    
    res.json(analyses);
  } catch (err) {
    console.error('Error getting practice history:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};