import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import {
  useAuth
} from './hooks/useAuthentication';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import AnimatedBackground from './components/AnimatedBackground';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {

  const {
    user,
    loading
  } = useAuth();

  // LOADING SCREEN
  if (loading) {

    return (

      <div className="loading-screen">

        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">

          <div className="w-24 h-24 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>

          <h1 className="text-6xl font-extrabold mb-4 gradient-text">

            SpeakRight AI

          </h1>

          <p className="text-blue-100 text-xl">

            Initializing AI Experience...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* GLOBAL BACKGROUND */}
      <AnimatedBackground />

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <main className="flex-1 px-4 md:px-8 py-8 relative z-10">

        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={<HomePage />}
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              !user
                ? <LoginPage />
                : <Navigate to="/dashboard" />
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              !user
                ? <RegisterPage />
                : <Navigate to="/dashboard" />
            }
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              user
                ? <DashboardPage />
                : <Navigate to="/login" />
            }
          />

          {/* PRACTICE */}
          <Route
            path="/practice"
            element={
              user
                ? <PracticePage />
                : <Navigate to="/login" />
            }
          />

          {/* HISTORY */}
          <Route
            path="/history"
            element={
              user
                ? <HistoryPage />
                : <Navigate to="/login" />
            }
          />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              user
                ? <SettingsPage />
                : <Navigate to="/login" />
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="/" />}
          />

        </Routes>

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default App;