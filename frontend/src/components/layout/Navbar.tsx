import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, isLoggedIn, user } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#100D14]/90 backdrop-blur-md border-b border-[#24151F]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 text-left text-xl font-bold tracking-tight text-[#F5F1F5] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg glow-pink-orange flex items-center justify-center shadow-lg shadow-[#E879B9]/20">
            <span className="font-extrabold text-[#100D14] text-base">H</span>
          </div>
          <span className="font-display tracking-tight text-gradient-neon text-lg">
            HIRE<span className="font-bold text-[#FF8866]">IQ</span>
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#F5F1F5]/70">
          <button
            onClick={() => navigate('/interview/setup')}
            className={`transition-colors hover:text-[#FF8866] whitespace-nowrap shrink-0 ${
              currentPath.startsWith('/interview') ? 'text-[#E879B9] font-semibold' : ''
            }`}
          >
            AI Interview
          </button>
          <button
            onClick={() => navigate('/assessment/setup')}
            className={`transition-colors hover:text-[#FF8866] whitespace-nowrap shrink-0 ${
              currentPath.startsWith('/assessment') ? 'text-[#E879B9] font-semibold' : ''
            }`}
          >
            Assessments
          </button>
          <button
            onClick={() => navigate('/courses')}
            className={`transition-colors hover:text-[#FF8866] whitespace-nowrap shrink-0 ${
              currentPath.startsWith('/courses') ? 'text-[#E879B9] font-semibold' : ''
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => navigate('/notes')}
            className={`transition-colors hover:text-[#FF8866] whitespace-nowrap shrink-0 ${
              currentPath.startsWith('/notes') ? 'text-[#E879B9] font-semibold' : ''
            }`}
          >
            Revision Notes
          </button>
          {isLoggedIn && (
            <button
              onClick={() => navigate('/dashboard')}
              className={`transition-colors hover:text-[#FF8866] whitespace-nowrap shrink-0 ${
                currentPath === '/dashboard' ? 'text-[#E879B9] font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#100D14] glow-pink-orange rounded-lg hover:opacity-95 transition-all shadow-md shadow-[#E879B9]/20 whitespace-nowrap shrink-0"
            >
              <span>{user.name.split(' ')[0]}</span>
              <span className="text-[10px] bg-[#100D14]/20 px-1.5 py-0.5 rounded text-[#100D14] font-mono">
                {user.readinessScore}%
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-medium text-[#F5F1F5]/80 hover:text-white transition-colors whitespace-nowrap shrink-0 px-2 py-1"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-xs font-semibold text-[#100D14] glow-pink-orange rounded-lg hover:opacity-95 transition-all shadow-md shadow-[#E879B9]/20 whitespace-nowrap shrink-0"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
