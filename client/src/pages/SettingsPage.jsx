import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuthentication';
import { updateProfile, changePassword } from '../services/authService';

const SettingsPage = () => {
  const { user, refreshUserData } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    nativeLanguage: '',
    practiceLanguage: 'english',
    dailyGoalMinutes: 10
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Preferences
  const [preferences, setPreferences] = useState({
    enableSoundEffects: true,
    enableAutoRecording: false,
    darkMode: false,
    notificationsEnabled: true
  });

  // Load user data into form when available
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        nativeLanguage: user.nativeLanguage || '',
        practiceLanguage: user.practiceLanguage || 'english',
        dailyGoalMinutes: user.dailyGoalMinutes || 10
      });
      
      // Load saved preferences from localStorage
      const savedPreferences = JSON.parse(localStorage.getItem('pronunciationAppPreferences'));
      if (savedPreferences) {
        setPreferences(savedPreferences);
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    const newPreferences = { ...preferences, [name]: checked };
    setPreferences(newPreferences);
    
    // Save to localStorage
    localStorage.setItem('pronunciationAppPreferences', JSON.stringify(newPreferences));
    
    // Apply dark mode immediately if changed
    if (name === 'darkMode') {
      document.documentElement.classList.toggle('dark', checked);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    
    try {
      setIsLoading(true);
      await updateProfile(profileForm);
      await refreshUserData();
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordError('New passwords do not match');
    }
    
    if (passwordForm.newPassword.length < 6) {
      return setPasswordError('Password must be at least 6 characters long');
    }
    
    try {
      setIsLoading(true);
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setPasswordSuccess('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          
          {profileError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{profileError}</p>
            </div>
          )}
          
          {profileSuccess && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              <p>{profileSuccess}</p>
            </div>
          )}
          
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profileForm.username}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profileForm.email}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nativeLanguage">Native Language</label>
              <select
                id="nativeLanguage"
                name="nativeLanguage"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profileForm.nativeLanguage}
                onChange={handleProfileChange}
              >
                <option value="">Select your native language</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="chinese">Chinese</option>
                <option value="japanese">Japanese</option>
                <option value="russian">Russian</option>
                <option value="arabic">Arabic</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="practiceLanguage">Practice Language</label>
              <select
                id="practiceLanguage"
                name="practiceLanguage"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profileForm.practiceLanguage}
                onChange={handleProfileChange}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="chinese">Chinese</option>
                <option value="japanese">Japanese</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="dailyGoalMinutes">
                Daily Practice Goal (minutes)
              </label>
              <input
                id="dailyGoalMinutes"
                name="dailyGoalMinutes"
                type="number"
                min="1"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profileForm.dailyGoalMinutes}
                onChange={handleProfileChange}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
        
        {/* Change Password */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          
          {passwordError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{passwordError}</p>
            </div>
          )}
          
          {passwordSuccess && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              <p>{passwordSuccess}</p>
            </div>
          )}
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          
          {/* App Preferences */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">App Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="enableSoundEffects"
                  name="enableSoundEffects"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={preferences.enableSoundEffects}
                  onChange={handlePreferenceChange}
                />
                <label htmlFor="enableSoundEffects" className="ml-2 block text-gray-700">
                  Enable sound effects
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="enableAutoRecording"
                  name="enableAutoRecording"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={preferences.enableAutoRecording}
                  onChange={handlePreferenceChange}
                />
                <label htmlFor="enableAutoRecording" className="ml-2 block text-gray-700">
                  Auto-start recording
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="darkMode"
                  name="darkMode"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={preferences.darkMode}
                  onChange={handlePreferenceChange}
                />
                <label htmlFor="darkMode" className="ml-2 block text-gray-700">
                  Dark mode
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="notificationsEnabled"
                  name="notificationsEnabled"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={preferences.notificationsEnabled}
                  onChange={handlePreferenceChange}
                />
                <label htmlFor="notificationsEnabled" className="ml-2 block text-gray-700">
                  Enable notifications
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;