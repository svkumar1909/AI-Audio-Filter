import { useState } from 'react';

import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  FaMicrophoneAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

import { useAuth }
from '../hooks/useAuthentication';

const Navbar = () => {

  const {
    user,
    logout
  } = useAuth();

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const handleLogout = () => {

    logout();

    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path;

  return (

    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-4"
          >

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg glow-animation">

              <FaMicrophoneAlt className="text-white text-xl" />

            </div>

            <div>

              <h1 className="text-2xl font-extrabold gradient-text">
                SpeakRight AI
              </h1>

              <p className="text-xs text-gray-500">
                AI Pronunciation Trainer
              </p>

            </div>

          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-4">

            {user && (

              <>
                <Link
                  to="/dashboard"
                  className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/40'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/practice"
                  className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${
                    isActive('/practice')
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/40'
                  }`}
                >
                  Practice
                </Link>

                <Link
                  to="/history"
                  className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${
                    isActive('/history')
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/40'
                  }`}
                >
                  History
                </Link>
              </>
            )}

          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-4">

            {user ? (

              <>
                <div className="glass px-5 py-2 rounded-2xl">

                  <p className="font-semibold text-gray-700">
                    {user.name || user.username}
                  </p>

                </div>

                <button
                  onClick={handleLogout}
                  className="glow-btn px-6 py-2 rounded-2xl font-semibold"
                >
                  Logout
                </button>
              </>

            ) : (

              <>
                <Link
                  to="/login"
                  className="text-gray-700 font-semibold"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="glow-btn px-6 py-2 rounded-2xl font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() =>
              setIsMenuOpen(!isMenuOpen)
            }
          >

            {isMenuOpen
              ? <FaTimes />
              : <FaBars />}

          </button>

        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (

          <div className="md:hidden pb-6 flex flex-col gap-3">

            {user ? (

              <>
                <Link
                  to="/dashboard"
                  className="glass p-3 rounded-2xl"
                >
                  Dashboard
                </Link>

                <Link
                  to="/practice"
                  className="glass p-3 rounded-2xl"
                >
                  Practice
                </Link>

                <Link
                  to="/history"
                  className="glass p-3 rounded-2xl"
                >
                  History
                </Link>

                <button
                  onClick={handleLogout}
                  className="glow-btn p-3 rounded-2xl"
                >
                  Logout
                </button>
              </>

            ) : (

              <>
                <Link
                  to="/login"
                  className="glass p-3 rounded-2xl"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="glow-btn p-3 rounded-2xl"
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