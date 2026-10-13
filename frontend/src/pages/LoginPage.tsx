import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, login, showToast } = useApp();

  const [email, setEmail] = useState('alex.vance@hireiq.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }
    setErrorMessage('');
    login(email, 'Alex Vance');
  };

  const handleOAuth = (provider: string) => {
    login(`${provider.toLowerCase()}@user.hireiq.io`, `${provider} Engineer`);
  };

  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      showToast('Please enter your email.', 'error');
      return;
    }
    showToast(`Password recovery link dispatched to ${recoveryEmail}`, 'success');
    setShowForgotModal(false);
  };

  return (
    <div className="min-h-screen bg-[#100D14] flex flex-col justify-between web3-grid-pattern">
      {/* Header */}
      <header className="p-6 border-b border-[#24151F]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-left text-xl font-bold tracking-tight text-[#F5F1F5]"
          >
            <div className="w-8 h-8 rounded-lg glow-pink-orange flex items-center justify-center">
              <span className="font-extrabold text-[#100D14] text-base">H</span>
            </div>
            <span className="font-display tracking-tight text-gradient-neon text-lg">
              HIRE<span className="text-[#FF8866]">IQ</span>
            </span>
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="text-xs font-medium text-[#F5F1F5]/70 hover:text-[#FF8866] transition-colors"
          >
            New to HireIQ? <span className="text-[#E879B9] underline">Sign up free</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full p-6 py-12 flex flex-col justify-center">
        <div className="bg-[#24151F]/60 border border-[#24151F] p-8 rounded-2xl backdrop-blur-md space-y-6 shadow-2xl">
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-bold text-[#F5F1F5]">Log In to HireIQ</h1>
            <p className="text-xs text-[#F5F1F5]/60">Access your mock evaluations, scores, and courses.</p>
          </div>

          {/* Inline Error Toast Feedback */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* OAuth SSO Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth('Google')}
              className="py-2.5 px-3 rounded-xl bg-[#100D14] border border-[#24151F] hover:border-[#E879B9]/40 text-xs font-medium text-[#F5F1F5] flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('GitHub')}
              className="py-2.5 px-3 rounded-xl bg-[#100D14] border border-[#24151F] hover:border-[#E879B9]/40 text-xs font-medium text-[#F5F1F5] flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('LinkedIn')}
              className="py-2.5 px-3 rounded-xl bg-[#100D14] border border-[#24151F] hover:border-[#E879B9]/40 text-xs font-medium text-[#F5F1F5] flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#24151F] w-full" />
            <span className="bg-[#24151F] px-3 text-[11px] text-[#F5F1F5]/40 absolute">or email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F1F5]/80 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.vance@hireiq.io"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D14] border border-[#24151F] focus:border-[#E879B9] text-xs text-[#F5F1F5] placeholder:text-[#F5F1F5]/30 outline-none transition-colors pl-9"
                />
                <Mail className="w-4 h-4 text-[#F5F1F5]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#F5F1F5]/80">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[#FF8866] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D14] border border-[#24151F] focus:border-[#E879B9] text-xs text-[#F5F1F5] placeholder:text-[#F5F1F5]/30 outline-none transition-colors pl-9 pr-10"
                />
                <Lock className="w-4 h-4 text-[#F5F1F5]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F1F5]/40 hover:text-[#F5F1F5]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#100D14] border-[#24151F] text-[#E879B9] focus:ring-0 w-4 h-4 accent-[#E879B9]"
                />
                <label htmlFor="remember" className="text-xs text-[#F5F1F5]/70">Remember this device</label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-xs text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#E879B9]/20"
            >
              <span>Log In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-[#F5F1F5]/60">
              Demo account loaded. Click Log In directly to test all modules.
            </p>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#100D14]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#24151F] border border-[#24151F] p-6 rounded-2xl max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-[#F5F1F5]">Reset Password</h3>
            <p className="text-xs text-[#F5F1F5]/60">
              Enter the email associated with your account, and we'll send a recovery token.
            </p>
            <form onSubmit={handlePasswordRecovery} className="space-y-4">
              <input
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D14] border border-[#24151F] text-xs text-[#F5F1F5] outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#F5F1F5]/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-[#100D14] glow-pink-orange"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
