import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthentication';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-500';

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3">
        <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        <span className="text-gray-100 text-2xl font-bold tracking-wide">SpeakRight</span>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center space-x-6 text-lg">
        {user && (
          <>
            <Link to="/dashboard" className={`px-4 py-2 rounded-lg transition duration-300 ${isActive('/dashboard') || 'hover:bg-white hover:text-blue-700'}`}>
              Dashboard
            </Link>
            <Link to="/practice" className={`px-4 py-2 rounded-lg transition duration-300 ${isActive('/practice') || 'hover:bg-white hover:text-blue-700'}`}>
              Practice
            </Link>
            <Link to="/history" className={`px-4 py-2 rounded-lg transition duration-300 ${isActive('/history') || 'hover:bg-white hover:text-blue-700'}`}>
              History
            </Link>
          </>
        )}
      </div>

      {/* Auth Controls */}
      <div className="hidden md:flex items-center space-x-4 text-lg">
        {user ? (
          <>
            <span className="font-semibold">{user.username}</span>
            <Link to="/settings" className="hover:text-white hover:underline">Settings</Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 text-gray-200 hover:underline font-semibold">Login</Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md focus:outline-none hover:bg-white hover:text-blue-700 transition"
        >
          <svg
            className="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    {isMenuOpen && (
      <div className="md:hidden mt-4 space-y-2 text-lg">
        {user ? (
          <>
            <Link to="/dashboard" onClick={toggleMenu} className={`block px-4 py-2 rounded-md ${isActive('/dashboard') || 'hover:bg-white hover:text-blue-700'}`}>Dashboard</Link>
            <Link to="/practice" onClick={toggleMenu} className={`block px-4 py-2 rounded-md ${isActive('/practice') || 'hover:bg-white hover:text-blue-700'}`}>Practice</Link>
            <Link to="/history" onClick={toggleMenu} className={`block px-4 py-2 rounded-md ${isActive('/history') || 'hover:bg-white hover:text-blue-700'}`}>History</Link>
            <Link to="/settings" onClick={toggleMenu} className="block px-4 py-2 hover:underline">Settings</Link>
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="block w-full text-left px-4 py-2 rounded-md bg-white text-blue-700 hover:bg-blue-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={toggleMenu} className="block px-4 py-2 hover:underline">Login</Link>
            <Link
              to="/register"
              onClick={toggleMenu}
              className="block px-4 py-2 rounded-md bg-white text-blue-700 hover:bg-blue-100 font-semibold"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    )}
  </div>
</nav>

  );
};

export default Navbar;
