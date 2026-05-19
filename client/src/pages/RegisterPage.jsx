import {
  useState
} from 'react';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGlobe,
  FaMicrophoneAlt
} from 'react-icons/fa';

import {
  useAuth
} from '../hooks/useAuthentication';

const RegisterPage = () => {

  const [formData, setFormData] =
    useState({

      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      nativeLanguage: '',
      targetLanguage: ''
    });

  const [error, setError] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const { register } =
    useAuth();

  const navigate =
    useNavigate();

  const LANGUAGES = [

    'English',
    'Hindi',
    'Bengali',
    'Spanish',
    'French',
    'German',
    'Japanese',
    'Chinese'
  ];

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError('');

      if (
        formData.password !==
        formData.confirmPassword
      ) {

        return setError(
          'Passwords do not match'
        );
      }

      try {

        setIsLoading(true);

        await register({

          name:
            formData.name,

          email:
            formData.email,

          password:
            formData.password,

          nativeLanguage:
            formData.nativeLanguage,

          targetLanguage:
            formData.targetLanguage
        });

        navigate('/dashboard');

      } catch (err) {

        console.log(err);

        setError(
          'Registration failed'
        );

      } finally {

        setIsLoading(false);
      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl premium-card p-10 relative overflow-hidden">

        {/* glow */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

        {/* HEADER */}
        <div className="text-center mb-10 relative z-10">

          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl mb-6 glow-animation">

            <FaMicrophoneAlt className="text-white text-4xl" />

          </div>

          <h1 className="text-5xl font-extrabold gradient-text mb-3">

            Create Account

          </h1>

          <p className="text-gray-500 text-lg">

            Start your AI speaking journey today

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
          className="grid md:grid-cols-2 gap-6 relative z-10"
        >

          {/* NAME */}
          <div>

            <label className="block mb-2 font-semibold text-gray-700">

              Full Name

            </label>

            <div className="relative">

              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

          </div>

          {/* EMAIL */}
          <div>

            <label className="block mb-2 font-semibold text-gray-700">

              Email

            </label>

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

          </div>

          {/* NATIVE */}
          <div>

            <label className="block mb-2 font-semibold text-gray-700">

              Native Language

            </label>

            <div className="relative">

              <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <select
                name="nativeLanguage"
                value={formData.nativeLanguage}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >

                <option value="">
                  Select
                </option>

                {LANGUAGES.map(
                  (lang) => (

                    <option
                      key={lang}
                    >
                      {lang}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* TARGET */}
          <div>

            <label className="block mb-2 font-semibold text-gray-700">

              Target Language

            </label>

            <div className="relative">

              <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <select
                name="targetLanguage"
                value={formData.targetLanguage}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >

                <option value="">
                  Select
                </option>

                {LANGUAGES.map(
                  (lang) => (

                    <option
                      key={lang}
                    >
                      {lang}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block mb-2 font-semibold text-gray-700">

              Password

            </label>

            <div className="relative">

              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

          </div>

          {/* CONFIRM */}
          <div>

            <label className="block mb-2 font-semibold text-gray-700">

              Confirm Password

            </label>

            <div className="relative">

              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

          </div>

          {/* BUTTON */}
          <div className="md:col-span-2">

            <button
              type="submit"
              disabled={isLoading}
              className="w-full glow-btn py-4 rounded-2xl text-xl font-bold shadow-2xl"
            >

              {
                isLoading
                  ? 'Creating Account...'
                  : 'Register'
              }

            </button>

          </div>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-8 relative z-10">

          <p className="text-gray-500">

            Already have an account?

          </p>

          <Link
            to="/login"
            className="text-blue-600 font-bold hover:text-purple-600 transition"
          >

            Login Here

          </Link>

        </div>

      </div>

    </div>
  );
};

export default RegisterPage;