import User from '../models/User.js';
import Recording from '../models/Recording.js';

// ✅ Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error getting current user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  const { name, email, nativeLanguage, learningLanguage, preferredAccent } = req.body;

  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (nativeLanguage) userFields.nativeLanguage = nativeLanguage;
  if (learningLanguage) userFields.learningLanguage = learningLanguage;
  if (preferredAccent) userFields.preferredAccent = preferredAccent;

  try {
    const user = await User.findByIdAndUpdate(
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

// ✅ Get user stats (FIXED → using Recording)
export const getUserStats = async (req, res) => {
  try {
    const recordings = await Recording.find({ user: req.user.id });

    const recordingsCount = recordings.length;

    if (recordingsCount === 0) {
      return res.json({
        recordingsCount: 0,
        averageScore: 0,
        progressTrend: 0,
        totalPracticeMinutes: 0
      });
    }

    const totalScore = recordings.reduce(
      (sum, r) => sum + (r.overallScore || 0),
      0
    );

    const averageScore = totalScore / recordingsCount;

    // 🔥 Recent trend (last 10)
    const recent = recordings
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    let progressTrend = 0;

    if (recent.length >= 2) {
      const newest = recent[0].overallScore || 0;
      const oldest = recent[recent.length - 1].overallScore || 0;
      progressTrend = newest - oldest;
    }

    res.json({
      recordingsCount,
      averageScore,
      progressTrend,
      totalPracticeMinutes: recordingsCount * 1 // approx
    });

  } catch (err) {
    console.error('Error getting user stats:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    // delete recordings
    await Recording.deleteMany({ user: req.user.id });

    // delete user
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'User account deleted' });

  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Practice history (FIXED → Recording instead of Analysis)
export const getPracticeHistory = async (req, res) => {
  try {
    const recordings = await Recording.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 10);

    res.json(recordings);

  } catch (err) {
    console.error('Error getting practice history:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};