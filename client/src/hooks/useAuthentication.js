import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  loginUser,
  registerUser,
  getCurrentUser as verifyToken,
  logoutUser
} from '../services/authService';

export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await verifyToken();
          setUser(userData);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginUser(email, password);

      localStorage.setItem('token', response.token);
      setUser(response.user);
      setError(null);

      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await registerUser(userData);

      localStorage.setItem('token', response.token);
      setUser(response.user);
      setError(null);

      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    logoutUser();
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  };
};