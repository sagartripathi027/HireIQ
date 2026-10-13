import React from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/layout/Sidebar';
import { 
  Video, 
  CheckSquare, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Flame, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';

import { SkillMasteryHeatmap } from '../components/dashboard/SkillMasteryHeatmap';

export const DashboardPage: React.FC = () => {
  const { user, navigate, interviewResults, assessmentResults, courses } = useApp();

  const enrolledCourse = courses.find(c => c.progressPercent && c.progressPercent > 0) || courses[0];

  return (
    <div className="min-h-screen bg-[#100D14] flex">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* User Welcome Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#24151F] via-[#24151F]/80 to-[#100D14] border border-[#24151F]">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E879B9]/40 shadow-lg shadow-[#E879B9]/10"
            />
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#F5F1F5]">
                Welcome back, {user.name}
              </h1>
              <p className="text-xs text-[#F5F1F5]/60 flex items-center gap-2">
                <span>Senior Engineering Track</span>
                <span>·</span>
                <span className="text-[#FF8866] font-mono">{user.streakDays}-Day Prep Streak</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#100D14]/80 px-4 py-3 rounded-xl border border-[#24151F]">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#F5F1F5]/50">Overall Readiness</p>
              <p className="text-2xl font-bold text-gradient-warm font-mono tabular-nums">{user.readinessScore}%</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#E879B9]/40 flex items-center justify-center font-mono text-xs font-bold text-[#E879B9]">
              Tier 1
            </div>
          </div>
        </div>

        {/* Quick Launch Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <button
            onClick={() => navigate('/interview/setup')}
            className="p-5 rounded-2xl bg-[#24151F]/40 border border-[#24151F] hover:border-[#E879B9]/40 hover:bg-[#24151F]/70 text-left transition-all group flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#100D14] border border-[#E879B9]/30 flex items-center justify-center text-[#E879B9] group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F1F5]">Start AI Interview</h3>
              <p className="text-xs text-[#F5F1F5]/60">
                Live voice & webcam simulation tailored to your resume.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#FF8866] group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
          </button>

          <button
            onClick={() => navigate('/assessment/setup')}
            className="p-5 rounded-2xl bg-[#24151F]/40 border border-[#24151F] hover:border-[#FF8866]/40 hover:bg-[#24151F]/70 text-left transition-all group flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#100D14] border border-[#FF8866]/30 flex items-center justify-center text-[#FF8866] group-hover:scale-105 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F1F5]">Take Skill Assessment</h3>
              <p className="text-xs text-[#F5F1F5]/60">
                MCQ, coding challenge, or system design scenarios.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#FF8866] group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
          </button>

          <button
            onClick={() => navigate(`/courses/${enrolledCourse.id}`)}
            className="p-5 rounded-2xl bg-[#24151F]/40 border border-[#24151F] hover:border-[#E879B9]/40 hover:bg-[#24151F]/70 text-left transition-all group flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#100D14] border border-[#E879B9]/30 flex items-center justify-center text-[#E879B9] group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F1F5]">Resume Learning</h3>
              <p className="text-xs text-[#F5F1F5]/60 truncate max-w-[200px]">
                {enrolledCourse.title}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#FF8866] group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
          </button>
        </div>

        {/* Analytics & Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#24151F]/30 border border-[#24151F] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#F5F1F5]/60">
              <span>Interviews</span>
              <Video className="w-3.5 h-3.5 text-[#E879B9]" />
            </div>
            <p className="text-2xl font-bold text-[#F5F1F5] font-mono tabular-nums">{user.interviewsCompleted}</p>
            <p className="text-[11px] text-[#F5F1F5]/50">Avg Score: 87.5%</p>
          </div>

          <div className="p-4 rounded-xl bg-[#24151F]/30 border border-[#24151F] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#F5F1F5]/60">
              <span>Assessments</span>
              <CheckSquare className="w-3.5 h-3.5 text-[#FF8866]" />
            </div>
            <p className="text-2xl font-bold text-[#F5F1F5] font-mono tabular-nums">{user.assessmentsCompleted}</p>
            <p className="text-[11px] text-[#F5F1F5]/50">92% Pass Rate</p>
          </div>

          <div className="p-4 rounded-xl bg-[#24151F]/30 border border-[#24151F] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#F5F1F5]/60">
              <span>Prep Streak</span>
              <Flame className="w-3.5 h-3.5 text-[#FF8866]" />
            </div>
            <p className="text-2xl font-bold text-gradient-warm font-mono tabular-nums">{user.streakDays} Days</p>
            <p className="text-[11px] text-[#F5F1F5]/50">Continuous daily practice</p>
          </div>

          <div className="p-4 rounded-xl bg-[#24151F]/30 border border-[#24151F] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#F5F1F5]/60">
              <span>Study Hours</span>
              <Clock className="w-3.5 h-3.5 text-[#E879B9]" />
            </div>
            <p className="text-2xl font-bold text-[#F5F1F5] font-mono tabular-nums">{user.learningHours} hrs</p>
            <p className="text-[11px] text-[#F5F1F5]/50">Distributed Systems & Concurrency</p>
          </div>
        </div>

        {/* Skill Mastery Heatmap & 30-Day Activity Powered by Recharts */}
        <SkillMasteryHeatmap />

        {/* Two-Column Split: Weak Skills Focus & Recent Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Weak Skills & Recommended Focus (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F5F1F5]">Targeted Weak Skills</h3>
                <p className="text-xs text-[#F5F1F5]/50">Detected in recent mock interview evaluation</p>
              </div>
              <AlertTriangle className="w-4 h-4 text-[#FF8866]" />
            </div>

            <div className="space-y-3 pt-2">
              {user.weakSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#100D14] border border-[#24151F] flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-semibold text-[#F5F1F5] truncate">{skill}</p>
                    <p className="text-[11px] text-[#F5F1F5]/50">Recommended: Review quick cheat sheet</p>
                  </div>
                  <button
                    onClick={() => navigate('/notes/note_raft_consensus')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#FF8866] bg-[#24151F] hover:bg-[#E879B9]/20 transition-colors whitespace-nowrap shrink-0"
                  >
                    Revise
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/notes')}
              className="w-full py-2.5 rounded-xl border border-[#24151F] text-xs font-semibold text-[#F5F1F5]/70 hover:text-[#F5F1F5] hover:border-[#E879B9]/40 transition-colors"
            >
              Browse All Revision Cheat Sheets
            </button>
          </div>

          {/* Recent Activity Feed (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F5F1F5]">Recent Activity & Reports</h3>
                <p className="text-xs text-[#F5F1F5]/50">Past mock rounds and assessed benchmarks</p>
              </div>
              <FileCheck className="w-4 h-4 text-[#E879B9]" />
            </div>

            <div className="space-y-3 pt-2">
              {/* Interview Results */}
              {interviewResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] hover:border-[#E879B9]/30 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#24151F] flex items-center justify-center text-[#E879B9] shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#F5F1F5] truncate">{result.role}</h4>
                      <p className="text-[11px] text-[#F5F1F5]/50">
                        {result.date} · <span>Score: {result.overallScore}%</span> · <span className="text-[#FF8866]">{result.recommendation}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/interview/result/${result.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                  >
                    <span>View Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Assessment Results */}
              {assessmentResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] hover:border-[#FF8866]/30 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#24151F] flex items-center justify-center text-[#FF8866] shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#F5F1F5] truncate">{result.topic}</h4>
                      <p className="text-[11px] text-[#F5F1F5]/50">
                        {result.date} · <span>{result.difficulty}</span> · <span className="text-[#FF8866]">{result.percentile}th percentile</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/assessment/result/${result.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#F5F1F5] bg-[#24151F] hover:bg-[#24151F]/80 border border-[#24151F] hover:border-[#FF8866]/40 transition-all whitespace-nowrap shrink-0"
                  >
                    <span>Review Test</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
