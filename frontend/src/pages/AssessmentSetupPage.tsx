import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Code2, 
  Layers, 
  Clock, 
  FileCheck, 
  ArrowRight, 
  Search, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const AssessmentSetupPage: React.FC = () => {
  const { assessmentConfig, setAssessmentConfig, navigate, showToast } = useApp();

  const [assessmentType, setAssessmentType] = useState<'MCQ' | 'Coding' | 'System Scenario'>('MCQ');
  const [topic, setTopic] = useState('System Design & High Availability');
  const [searchTopic, setSearchTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Advanced');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [tailorToResume, setTailorToResume] = useState(true);

  const topicsList = [
    'System Design & High Availability',
    'Data Structures & Algorithms',
    'Database Optimization & Sharding',
    'React 19 & Frontend Architecture',
    'Web3 & EVM Smart Contract Security',
    'Go & Concurrency Primitives',
    'Python & Distributed AI Infrastructure'
  ];

  const filteredTopics = topicsList.filter(t => t.toLowerCase().includes(searchTopic.toLowerCase()));

  const handleStart = () => {
    setAssessmentConfig({
      type: assessmentType,
      topic,
      difficulty,
      questionCount,
      tailorToResume,
      timeLimitMinutes: questionCount * 3
    });
    showToast(`Timed assessment initialized: ${topic}`, 'success');
    navigate('/assessment/test');
  };

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1.5 pb-6 border-b border-[#24151F]">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F1F5]">
          Adaptive Skill Assessment Lab
        </h1>
        <p className="text-xs text-[#F5F1F5]/60">
          Targeted timed skill examinations designed to benchmark your competence against Tier-1 peer percentiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Type, Topic, Difficulty, Questions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Assessment Type Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#F5F1F5] uppercase tracking-wider">
              1. Assessment Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setAssessmentType('MCQ')}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  assessmentType === 'MCQ'
                    ? 'bg-[#24151F] border-[#E879B9] shadow-lg shadow-[#E879B9]/15'
                    : 'bg-[#24151F]/40 border-[#24151F] hover:border-[#E879B9]/30'
                }`}
              >
                <CheckSquare className={`w-5 h-5 mb-2 ${assessmentType === 'MCQ' ? 'text-[#FF8866]' : 'text-[#F5F1F5]/50'}`} />
                <h4 className="text-sm font-bold text-[#F5F1F5]">Multiple Choice (MCQ)</h4>
                <p className="text-[11px] text-[#F5F1F5]/50 mt-1">
                  Conceptual invariants, Big-O complexity, architecture traps.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAssessmentType('Coding')}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  assessmentType === 'Coding'
                    ? 'bg-[#24151F] border-[#FF8866] shadow-lg shadow-[#FF8866]/15'
                    : 'bg-[#24151F]/40 border-[#24151F] hover:border-[#FF8866]/30'
                }`}
              >
                <Code2 className={`w-5 h-5 mb-2 ${assessmentType === 'Coding' ? 'text-[#FF8866]' : 'text-[#F5F1F5]/50'}`} />
                <h4 className="text-sm font-bold text-[#F5F1F5]">Live Code Challenge</h4>
                <p className="text-[11px] text-[#F5F1F5]/50 mt-1">
                  In-browser code editor with automated unit test runner.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAssessmentType('System Scenario')}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  assessmentType === 'System Scenario'
                    ? 'bg-[#24151F] border-[#E879B9] shadow-lg shadow-[#E879B9]/15'
                    : 'bg-[#24151F]/40 border-[#24151F] hover:border-[#E879B9]/30'
                }`}
              >
                <Layers className={`w-5 h-5 mb-2 ${assessmentType === 'System Scenario' ? 'text-[#FF8866]' : 'text-[#F5F1F5]/50'}`} />
                <h4 className="text-sm font-bold text-[#F5F1F5]">System Scenario</h4>
                <p className="text-[11px] text-[#F5F1F5]/50 mt-1">
                  Architectural bottleneck triage and capacity calculations.
                </p>
              </button>
            </div>
          </div>

          {/* Topic Selector */}
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#F5F1F5] uppercase tracking-wider">
                2. Target Skill / Domain
              </label>
              <div className="relative w-48">
                <input
                  type="text"
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  placeholder="Filter skills..."
                  className="w-full px-3 py-1.5 rounded-lg bg-[#100D14] border border-[#24151F] text-xs text-[#F5F1F5] outline-none pl-8"
                />
                <Search className="w-3.5 h-3.5 text-[#F5F1F5]/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredTopics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    topic === t
                      ? 'bg-[#100D14] border-[#E879B9] text-[#E879B9]'
                      : 'bg-[#100D14]/60 border-[#24151F] text-[#F5F1F5]/80 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Difficulty */}
            <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-3">
              <label className="text-xs font-bold text-[#F5F1F5] uppercase tracking-wider">
                3. Difficulty Level
              </label>
              <div className="flex p-1 bg-[#100D14] rounded-xl border border-[#24151F]">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                      difficulty === lvl
                        ? 'glow-pink-orange text-[#100D14] font-bold shadow-sm'
                        : 'text-[#F5F1F5]/60 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-3">
              <label className="text-xs font-bold text-[#F5F1F5] uppercase tracking-wider">
                4. Number of Questions
              </label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                      questionCount === num
                        ? 'bg-[#E879B9] border-[#E879B9] text-[#100D14]'
                        : 'bg-[#100D14] border-[#24151F] text-[#F5F1F5]/70 hover:border-[#E879B9]/30'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Resume Tailoring Toggle */}
          <div className="p-4 rounded-xl bg-[#24151F]/40 border border-[#24151F] flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-[#F5F1F5]">Tailor to Uploaded Resume</p>
              <p className="text-[11px] text-[#F5F1F5]/50">
                Pulls real architectural projects from Alex_Vance_Senior_Staff_Resume.pdf
              </p>
            </div>
            <input
              type="checkbox"
              checked={tailorToResume}
              onChange={(e) => setTailorToResume(e.target.checked)}
              className="w-5 h-5 accent-[#E879B9]"
            />
          </div>
        </div>

        {/* Right Column (4 cols): Test Rules & Launch CTA */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-[#24151F] to-[#100D14] border border-[#E879B9]/30 space-y-6 lg:sticky lg:top-24">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-[#E879B9] uppercase font-bold">
              Test Specifications
            </span>
            <h3 className="text-lg font-bold text-[#F5F1F5]">{topic}</h3>
          </div>

          <div className="space-y-3 border-y border-[#24151F] py-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#F5F1F5]/60 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FF8866]" />
                <span>Total Time Allotted:</span>
              </span>
              <span className="font-mono font-bold text-[#FF8866]">{questionCount * 3} minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#F5F1F5]/60 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Passing Threshold:</span>
              </span>
              <span className="font-mono font-bold text-emerald-300">80% Accuracy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#F5F1F5]/60">Format:</span>
              <span className="font-semibold text-[#F5F1F5]">{assessmentType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#F5F1F5]/60">Difficulty:</span>
              <span className="font-semibold text-[#E879B9]">{difficulty}</span>
            </div>
          </div>

          <div className="space-y-2 text-[11px] text-[#F5F1F5]/60 leading-relaxed">
            <p className="font-semibold text-[#F5F1F5]">Test Rules:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Each question is evaluated instantly upon submission.</li>
              <li>You may flag questions for review and navigate freely.</li>
              <li>Auto-save syncs your answers to local state in real-time.</li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 rounded-xl font-bold text-sm text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xl shadow-[#E879B9]/25"
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
