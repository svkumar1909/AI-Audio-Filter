import { createContext, useState, useEffect, useContext } from 'react';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser
} from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Initialize auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const userData = await getCurrentUser();

          // ✅ FIX: backend returns user directly (not inside data)
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth init error:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    setError(null);
    try {
      const { token, user: userData } = await loginUser(email, password);

      localStorage.setItem('token', token);
      setUser(userData);

      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // ✅ REGISTER
  const register = async (userData) => {
    setError(null);
    try {
      const { token, user: registeredUser } = await registerUser(userData);

      localStorage.setItem('token', token);
      setUser(registeredUser);

      return registeredUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    logoutUser();
  };

  // ✅ REFRESH USER
  const refreshUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData); // ✅ FIXED
      return userData;
    } catch (err) {
      console.error('Refresh error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // ✅ IMPORTANT (fixes your earlier error)
        loading,
        error,
        login,
        register,
        logout,
        refreshUserData,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};