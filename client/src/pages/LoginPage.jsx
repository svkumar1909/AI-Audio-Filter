import {
  useState
} from 'react';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import {
  FaEnvelope,
  FaLock,
  FaMicrophoneAlt
} from 'react-icons/fa';

import {
  useAuth
} from '../context/AuthContext';

function LoginPage() {

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const { login } =
    useAuth();

  const navigate =
    useNavigate();

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!email || !password) {

        setError(
          'Please enter email and password'
        );

        return;
      }

      try {

        setLoading(true);

        setError('');

        await login(
          email,
          password
        );

        navigate('/dashboard');

      } catch (err) {

        console.log(err);

        setError(
          'Invalid credentials'
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md premium-card p-10 relative overflow-hidden">

        {/* glow */}
        <div className="absolute top-0 right-0 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl"></div>

        {/* HEADER */}
        <div className="text-center mb-10 relative z-10">

          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl mb-6 glow-animation">

            <FaMicrophoneAlt className="text-white text-4xl" />

          </div>

          <h1 className="text-5xl font-extrabold gradient-text mb-3">

            Welcome Back

          </h1>

          <p className="text-gray-500 text-lg">

            Continue your AI pronunciation journey

          </p>

        </div>

        {/* ERROR */}
        {error && (

          <div className="bg-red-100 text-red-700 p-4 rounded-2xl mb-6">

            {error}

          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 relative z-10"
        >

          {/* EMAIL */}
          <div>

            <label className="block text-gray-700 font-semibold mb-2">

              Email Address

            </label>

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block text-gray-700 font-semibold mb-2">

              Password

            </label>

            <div className="relative">

              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glow-btn py-4 rounded-2xl text-xl font-bold shadow-2xl"
          >

            {
              loading
                ? 'Signing In...'
                : 'Login'
            }

          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-8 relative z-10">

          <p className="text-gray-500">

            Don’t have an account?

          </p>

          <Link
            to="/register"
            className="text-blue-600 font-bold hover:text-purple-600 transition"
          >

            Create Account

          </Link>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;