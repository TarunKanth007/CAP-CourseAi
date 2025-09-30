import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const { signIn, signUp, isConfigured } = useAuth();
  const { isDarkMode } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, fullName);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className={`liquid-card max-w-md w-full p-8 rounded-2xl shadow-xl relative overflow-hidden ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Floating Background Elements */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl floating-element ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-400/20 to-purple-400/20' 
            : 'bg-gradient-to-br from-blue-400/10 to-purple-400/10'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl floating-element ${
          isDarkMode 
            ? 'bg-gradient-to-tr from-purple-400/20 to-blue-400/20' 
            : 'bg-gradient-to-tr from-purple-400/10 to-blue-400/10'
        }`}></div>

        <div className="text-center mb-8">
          <div className="glass-morphism p-4 rounded-xl w-fit mx-auto mb-4 liquid-glow floating-element">
            <Brain className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
            {isSignUp 
              ? 'Start your AI-powered career journey' 
              : 'Continue your learning path'
            }
          </p>
        </div>

        {!isConfigured && (
          <div className="mb-4 p-3 rounded-lg bg-blue-100 border border-blue-300 text-blue-700 text-sm">
            <strong>Demo Mode:</strong> Supabase is not configured. Set up your Supabase credentials to enable authentication.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
                className={`liquid-input w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          )}

          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`liquid-input w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div className="relative">
            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`liquid-input w-full pl-10 pr-12 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full liquid-button text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed ripple-effect"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className={`text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;