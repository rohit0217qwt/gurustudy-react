import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student'
      });
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-sm">
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-600 p-3 rounded-sm mb-4">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-50 mb-2" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="register-heading">
                Create Account
              </h1>
              <p className="text-sm text-zinc-400">
                Register to access assessments
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="register-form">
              <div>
                <label htmlFor="name" className="block text-sm text-zinc-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 text-zinc-100 px-4 py-3 rounded-sm outline-none transition-colors duration-150"
                  placeholder="John Doe"
                  data-testid="register-name-input"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-zinc-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 text-zinc-100 px-4 py-3 rounded-sm outline-none transition-colors duration-150"
                  placeholder="your.email@example.com"
                  data-testid="register-email-input"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-zinc-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 text-zinc-100 px-4 py-3 rounded-sm outline-none transition-colors duration-150"
                  placeholder="At least 6 characters"
                  data-testid="register-password-input"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-zinc-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 text-zinc-100 px-4 py-3 rounded-sm outline-none transition-colors duration-150"
                  placeholder="Repeat your password"
                  data-testid="register-confirm-password-input"
                />
              </div>

              {error && (
                <div className="bg-red-950 border border-red-800 text-red-400 p-4 rounded-sm text-sm" data-testid="register-error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-3 rounded-sm transition-colors duration-150"
                data-testid="register-submit-button"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
              <p className="text-sm text-zinc-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors duration-150" data-testid="login-link">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
