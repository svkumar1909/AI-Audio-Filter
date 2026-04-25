import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthentication';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nativeLanguage: '',
    targetLanguage: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const LANGUAGES = [
    "English", "Hindi", "Bengali",
    "Spanish", "French", "German",
    "Chinese", "Japanese"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    if (formData.nativeLanguage === formData.targetLanguage) {
      return setError('Native and target language cannot be the same');
    }

    try {
      setIsLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        nativeLanguage: formData.nativeLanguage,
        targetLanguage: formData.targetLanguage
      });

      // ✅ SUCCESS FLOW
      navigate('/dashboard');

    } catch (err) {
      console.log("REGISTER ERROR:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      setError(errorMessage);

    } finally {
      // ✅ FIX: missing finally was breaking build earlier
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

          <select name="nativeLanguage" value={formData.nativeLanguage} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required>
            <option value="">Native Language</option>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>

          <select name="targetLanguage" value={formData.targetLanguage} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required>
            <option value="">Target Language</option>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>

          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />

          <button className="w-full bg-blue-500 text-white py-2 rounded">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;