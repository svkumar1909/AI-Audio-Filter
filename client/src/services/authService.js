import api from './api';

// ✅ LOGIN
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });

  if (!response.data.success) {
    throw new Error(response.data.message || "Login failed");
  }

  return {
    user: response.data.user,
    token: response.data.token
  };
};

// ✅ REGISTER
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);

  if (!response.data.success) {
    throw new Error(response.data.message || "Registration failed");
  }

  return {
    user: response.data.user,
    token: response.data.token
  };
};

// ✅ GET CURRENT USER
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ✅ LOGOUT (FIXED - NO API CALL)
export const logoutUser = () => {
  // JWT आधारित logout → सिर्फ token हटाना
  console.log("User logged out");
};

// ✅ UPDATE PROFILE
export const updateProfile = async (userData) => {
  const response = await api.put('/users/me', userData);
  return response.data;
};

// ✅ CHANGE PASSWORD
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
};