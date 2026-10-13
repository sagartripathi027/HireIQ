import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Mic, 
  Video, 
  Cpu, 
  CheckCircle2, 
  BrainCircuit, 
  Code2, 
  BookOpen, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] web3-grid-pattern">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        {/* Glow backdrop halos */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-[#E879B9]/15 via-[#FF8866]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#24151F] border border-[#E879B9]/30 text-xs text-[#F5F1F5]">
              <span className="w-2 h-2 rounded-full bg-[#FF8866]" />
              <span className="font-medium text-[#E879B9]">Next-Gen Web3 & AI Mock Interview Suite</span>
              <span className="text-[#F5F1F5]/40">·</span>
              <span className="text-[#F5F1F5]/70">v2.4 Live</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-balance">
              Ace Your Technical Interviews with{' '}
              <span className="text-gradient-neon">Intelligent AI & Voice</span> Analysis
            </h1>

            <p className="text-base sm:text-lg text-[#F5F1F5]/70 max-w-2xl leading-relaxed">
              Step into an adaptive mock interview room powered by computer vision, live audio transcription, and instant rubric evaluations. Tailored to your resume and target job descriptions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/interview/setup')}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm text-[#100D14] glow-pink-orange hover:shadow-lg hover:shadow-[#E879B9]/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2.5 whitespace-nowrap"
              >
                <span>Start Free AI Interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/assessment/setup')}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm text-[#F5F1F5] bg-[#24151F] border border-[#24151F] hover:border-[#E879B9]/40 hover:bg-[#24151F]/80 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Take Skill Assessment</span>
                <ChevronRight className="w-4 h-4 text-[#FF8866]" />
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#F5F1F5]/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8866]" />
                <span>Zero Installation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8866]" />
                <span>Instant Rubric Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8866]" />
                <span>Webcam & Audio Analysis</span>
              </div>
            </div>
          </div>

          {/* Right Column: Web3 Robot AI Interviewer Hologram Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border border-[#E879B9]/30 bg-gradient-to-b from-[#24151F] to-[#100D14] shadow-2xl shadow-[#E879B9]/10 p-3">
              {/* Image Container with Fallback */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#100D14]">
                <img
                  src="/src/assets/images/hero_ai_avatar_1791911819065.jpg"
                  alt="3D AI Interviewer Hologram"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />

                {/* Overlaid UI Badges */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#100D14]/80 backdrop-blur-md border border-[#E879B9]/30 text-[11px] font-mono text-[#F5F1F5] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF8866]" />
                  <span>AI INTERVIEWER ACTIVE</span>
                </div>

                <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-[#100D14]/85 backdrop-blur-md border border-[#24151F] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#24151F] flex items-center justify-center text-[#FF8866]">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#F5F1F5]">Live Speech Engine</p>
                      <p className="text-[10px] text-[#F5F1F5]/50">Transcribing Candidate Audio...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#E879B9] font-mono font-medium">Readiness 92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Stats Banner */}
      <section className="py-12 border-y border-[#24151F] bg-[#24151F]/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F5F1F5] font-mono tabular-nums">140,000+</p>
            <p className="text-xs text-[#F5F1F5]/60 mt-1">Interviews Conducted</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-gradient-warm font-mono tabular-nums">320,000 hrs</p>
            <p className="text-xs text-[#F5F1F5]/60 mt-1">Speech & Code Practiced</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F5F1F5] font-mono tabular-nums">94.2%</p>
            <p className="text-xs text-[#F5F1F5]/60 mt-1">Tier-1 Offer Match Rate</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#FF8866] font-mono tabular-nums">&lt; 3.0 sec</p>
            <p className="text-xs text-[#F5F1F5]/60 mt-1">Real-time Rubric Evaluation</p>
          </div>
        </div>
      </section>

      {/* Core Pillars Showcase */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#E879B9]">Three Pillars of Excellence</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F1F5]">
            Everything You Need to Command the Room
          </h2>
          <p className="text-sm text-[#F5F1F5]/70">
            A unified ecosystem tailored to engineers seeking senior and staff compensation brackets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: AI Mock Interview */}
          <div className="p-7 rounded-2xl bg-[#24151F]/50 border border-[#24151F] hover:border-[#E879B9]/40 hover:shadow-xl hover:shadow-[#E879B9]/5 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#100D14] border border-[#E879B9]/30 flex items-center justify-center text-[#E879B9] group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F5F1F5]">AI Mock Interview</h3>
              <p className="text-xs text-[#F5F1F5]/60 leading-relaxed">
                Realistic live technical interview with speech recognition, webcam monitoring, 3D avatar responses, and multi-round pacing.
              </p>
              <ul className="space-y-2 text-xs text-[#F5F1F5]/70 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E879B9]" />
                  <span>Real-time voice-to-text transcript</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E879B9]" />
                  <span>Resume & job description skill targeting</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E879B9]" />
                  <span>Comprehensive 4-pillar scorecard</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/interview/setup')}
              className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#FF8866] hover:text-[#E879B9] transition-colors"
            >
              <span>Setup Mock Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: Adaptive Assessments */}
          <div className="p-7 rounded-2xl bg-[#24151F]/50 border border-[#24151F] hover:border-[#E879B9]/40 hover:shadow-xl hover:shadow-[#E879B9]/5 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#100D14] border border-[#FF8866]/30 flex items-center justify-center text-[#FF8866] group-hover:scale-105 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F5F1F5]">Adaptive Assessments</h3>
              <p className="text-xs text-[#F5F1F5]/60 leading-relaxed">
                Personalized tests spanning MCQs, algorithm challenges, and system scenario designs with timed exam environments.
              </p>
              <ul className="space-y-2 text-xs text-[#F5F1F5]/70 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8866]" />
                  <span>Adjustable difficulty levels & timer</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8866]" />
                  <span>Interactive code sandbox with test cases</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8866]" />
                  <span>Peer percentile benchmark analysis</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/assessment/setup')}
              className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#FF8866] hover:text-[#E879B9] transition-colors"
            >
              <span>Launch Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3: Learning Hub (Courses & Notes) */}
          <div className="p-7 rounded-2xl bg-[#24151F]/50 border border-[#24151F] hover:border-[#E879B9]/40 hover:shadow-xl hover:shadow-[#E879B9]/5 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#100D14] border border-[#E879B9]/30 flex items-center justify-center text-[#E879B9] group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F5F1F5]">Curated Learning Hub</h3>
              <p className="text-xs text-[#F5F1F5]/60 leading-relaxed">
                High-yield video modules and quick-revision cheat sheets specifically targeted at correcting identified weak skills.
              </p>
              <ul className="space-y-2 text-xs text-[#F5F1F5]/70 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E879B9]" />
                  <span>Full-featured video & lesson classroom</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E879B9]" />
                  <span>One-click copy code snippets & diagrams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E879B9]" />
                  <span>Direct links from failed assessment questions</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#FF8866] hover:text-[#E879B9] transition-colors"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* "How It Works" Stepper */}
      <section className="py-20 px-6 border-t border-[#24151F] bg-[#24151F]/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-[#F5F1F5]">How It Works</h2>
            <p className="text-xs text-[#F5F1F5]/60">A 3-step scientific loop from skill gap discovery to offer acceptance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#100D14] border border-[#24151F] space-y-3 relative">
              <span className="text-3xl font-extrabold text-[#E879B9]/30 font-mono">01</span>
              <h4 className="text-base font-semibold text-[#F5F1F5]">1. Setup & Ingest</h4>
              <p className="text-xs text-[#F5F1F5]/60 leading-relaxed">
                Upload your resume and paste the target job description. HireIQ parses required competencies and targets your known weak spots.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#100D14] border border-[#24151F] space-y-3 relative">
              <span className="text-3xl font-extrabold text-[#FF8866]/30 font-mono">02</span>
              <h4 className="text-base font-semibold text-[#F5F1F5]">2. Practice Live Room</h4>
              <p className="text-xs text-[#F5F1F5]/60 leading-relaxed">
                Enter the immersive interview room. Respond verbally to the AI interviewer with live audio transcription and webcam feedback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#100D14] border border-[#24151F] space-y-3 relative">
              <span className="text-3xl font-extrabold text-[#E879B9]/30 font-mono">03</span>
              <h4 className="text-base font-semibold text-[#F5F1F5]">3. Elevate & Revise</h4>
              <p className="text-xs text-[#F5F1F5]/60 leading-relaxed">
                Receive an instant rubric breakdown, model answers, and automated recommendations to course lessons and revision cheat sheets.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigate('/interview/setup')}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity shadow-lg shadow-[#E879B9]/20"
            >
              Start Your First Session Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
