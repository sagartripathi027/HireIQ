import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="w-full bg-[#100D14] border-t border-[#24151F] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md glow-pink-orange flex items-center justify-center">
              <span className="font-extrabold text-[#100D14] text-xs">H</span>
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-[#F5F1F5]">
              HIRE<span className="text-[#FF8866]">IQ</span>
            </span>
          </div>
          <p className="text-xs text-[#F5F1F5]/50 max-w-sm">
            AI Interview & Learning Platform — Real-time voice, webcam and avatar mock interviews, adaptive skill assessments, and curated engineering courses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-xs text-[#F5F1F5]/60">
          <button onClick={() => navigate('/interview/setup')} className="hover:text-[#FF8866] transition-colors">
            AI Interview
          </button>
          <button onClick={() => navigate('/assessment/setup')} className="hover:text-[#FF8866] transition-colors">
            Skill Assessments
          </button>
          <button onClick={() => navigate('/courses')} className="hover:text-[#FF8866] transition-colors">
            Curated Courses
          </button>
          <button onClick={() => navigate('/notes')} className="hover:text-[#FF8866] transition-colors">
            Revision Notes
          </button>
          <button onClick={() => navigate('/signup')} className="hover:text-[#FF8866] transition-colors">
            Privacy Policy
          </button>
          <button onClick={() => navigate('/signup')} className="hover:text-[#FF8866] transition-colors">
            Terms of Service
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#24151F]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5F1F5]/40">
        <p>© 2026 HireIQ Inc. All rights reserved.</p>
        <p className="font-mono text-[11px] text-[#F5F1F5]/40">
          Engineered for Modern Software Engineers, Cloud & Fullstack Candidates
        </p>
      </div>
    </footer>
  );
};
