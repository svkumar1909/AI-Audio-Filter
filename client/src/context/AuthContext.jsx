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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData.data); // ✅ unwrap `data` from backend
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await loginUser(email, password);
      const { token, user: userData } = response;
      
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => { // ✅ accept full object
    setError(null);
    try {
      const response = await registerUser(userData);
      const { token, user: registeredUser } = response;
      
      localStorage.setItem('token', token);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    logoutUser(); // API call to invalidate the token on the server
  };

  const refreshUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData.data); // ✅ unwrap `data`
      return userData.data;
    } catch (err) {
      console.error('Error refreshing user data:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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

export default AuthProvider;

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { user, loading, error, login, register, logout, refreshUserData } = context;
  
  return {
    currentUser: user, // frontend components expect currentUser
    loading,
    error,
    login,
    register,
    logout,
    refreshUserData,
    isAuthenticated: !!user
  };
};
