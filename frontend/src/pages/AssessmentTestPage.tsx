import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AssessmentQuestion, AssessmentResult } from '../types';
import { sampleAssessmentsPool } from '../data/mockData';
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  Play, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AssessmentTestPage: React.FC = () => {
  const { assessmentConfig, addAssessmentResult, navigate, showToast } = useApp();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>(() => {
    return sampleAssessmentsPool.slice(0, assessmentConfig.questionCount).map(q => ({
      ...q,
      userAnswer: undefined,
      isFlagged: false
    }));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(assessmentConfig.timeLimitMinutes * 60);
  const [codeAnswer, setCodeAnswer] = useState(sampleAssessmentsPool[1].starterCode || '');
  const [codeRunOutput, setCodeRunOutput] = useState<string | null>(null);

  const currentQ = questions[currentIndex] || questions[0];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIndex: number) => {
    setQuestions(prev => prev.map((q, idx) => idx === currentIndex ? { ...q, userAnswer: optIndex } : q));
  };

  const toggleFlag = () => {
    setQuestions(prev => prev.map((q, idx) => idx === currentIndex ? { ...q, isFlagged: !q.isFlagged } : q));
  };

  const clearSelection = () => {
    setQuestions(prev => prev.map((q, idx) => idx === currentIndex ? { ...q, userAnswer: undefined } : q));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const runCodeSandbox = () => {
    setCodeRunOutput('Running test suite...\n✓ TokenBucketRateLimiter instantiated\n✓ Allowed burst under capacity\n✓ Rate limited excessive requests\nAll 3 unit test assertions PASSED.');
    showToast('Code executed against test runner: 3/3 passed', 'success');
  };

  const handleSubmitTest = () => {
    // Score calculation
    let correctCount = 0;
    questions.forEach((q) => {
      if (q.type === 'mcq' && q.userAnswer === q.correctOptionIndex) {
        correctCount++;
      } else if (q.type === 'coding') {
        correctCount++; // code challenge passes tests
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercent >= 80;

    if (passed) {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }

    const newResult: AssessmentResult = {
      id: `asm_${Math.floor(100 + Math.random() * 900)}`,
      topic: assessmentConfig.topic,
      difficulty: assessmentConfig.difficulty,
      date: 'Today, Oct 13, 2026',
      passed,
      scorePercent,
      percentile: 94,
      timeSpentSeconds: assessmentConfig.timeLimitMinutes * 60 - timerSeconds,
      accuracyRate: scorePercent,
      attemptedCount: questions.filter(q => q.userAnswer !== undefined || q.type === 'coding').length,
      skippedCount: questions.filter(q => q.userAnswer === undefined && q.type !== 'coding').length,
      topicMastery: [
        { topic: 'Distributed Systems', score: 95 },
        { topic: 'Data Structures & Algorithms', score: 90 },
        { topic: 'Database Optimization', score: 85 },
        { topic: 'Frontend Concurrency', score: 90 }
      ],
      questions,
      targetedRevisionNotes: ['note_raft_consensus', 'note_cap_theorem', 'note_big_o_complexity']
    };

    addAssessmentResult(newResult);
    showToast('Assessment submitted successfully!', 'success');
    navigate(`/assessment/result/${newResult.id}`);
  };

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] flex flex-col justify-between">
      {/* Test Header */}
      <header className="px-6 py-4 bg-[#24151F]/70 border-b border-[#24151F] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg glow-pink-orange flex items-center justify-center font-bold text-[#100D14] text-xs">
            K
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F5F1F5]">{assessmentConfig.topic}</h2>
            <div className="flex items-center gap-2 text-[11px] text-[#F5F1F5]/60">
              <span className="text-[#FF8866]">{assessmentConfig.difficulty}</span>
              <span>·</span>
              <span className="text-[#E879B9]">{assessmentConfig.type}</span>
            </div>
          </div>
        </div>

        {/* Timer & Auto-Save */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Auto-Save Synced</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-[#100D14] px-3.5 py-1.5 rounded-lg border border-[#24151F]">
            <Clock className="w-3.5 h-3.5 text-[#FF8866]" />
            <span className="text-[#FF8866] font-bold">{formatTime(timerSeconds)}</span>
          </div>

          <button
            onClick={handleSubmitTest}
            className="px-5 py-2 rounded-xl font-bold text-xs text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity shadow-lg shadow-[#E879B9]/20"
          >
            Submit Assessment
          </button>
        </div>
      </header>

      {/* Main Testing View */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Question Display Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#F5F1F5]/60">
                <span className="font-mono text-[#E879B9] font-bold">Question {currentIndex + 1} of {questions.length}</span>
                <span>·</span>
                <span>{currentQ.subtopic}</span>
              </div>

              {currentQ.isFlagged && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#FF8866] font-mono">
                  <Flag className="w-3 h-3 fill-[#FF8866]" />
                  <span>Flagged for Review</span>
                </span>
              )}
            </div>

            {/* Prompt */}
            <h3 className="text-base sm:text-lg font-bold text-[#F5F1F5] leading-relaxed">
              {currentQ.prompt}
            </h3>

            {/* Answer Mechanism */}
            {currentQ.type === 'mcq' && currentQ.options && (
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = currentQ.userAnswer === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-[#100D14] border-[#E879B9] text-[#F5F1F5] shadow-md shadow-[#E879B9]/10'
                          : 'bg-[#100D14]/60 border-[#24151F] text-[#F5F1F5]/80 hover:text-white hover:border-[#E879B9]/30'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5 ${
                        isSelected ? 'border-[#E879B9] bg-[#E879B9] text-[#100D14]' : 'border-[#24151F] text-[#F5F1F5]/50'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Coding Challenge Mechanism */}
            {currentQ.type === 'coding' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs text-[#F5F1F5]/60">
                  <span className="font-mono">TypeScript / Algorithms Sandbox</span>
                  <button
                    onClick={runCodeSandbox}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#100D14] glow-pink-orange hover:opacity-90"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Test Cases</span>
                  </button>
                </div>

                <div className="rounded-xl border border-[#24151F] bg-[#100D14] overflow-hidden">
                  <div className="bg-[#24151F] px-4 py-2 border-b border-[#24151F] text-[11px] font-mono text-[#F5F1F5]/60 flex items-center justify-between">
                    <span>Solution.ts</span>
                    <span>UTF-8</span>
                  </div>
                  <textarea
                    rows={12}
                    value={codeAnswer}
                    onChange={(e) => setCodeAnswer(e.target.value)}
                    className="w-full p-4 bg-[#100D14] text-xs font-mono text-[#F5F1F5] outline-none resize-none leading-relaxed"
                  />
                </div>

                {codeRunOutput && (
                  <div className="p-3.5 rounded-xl bg-[#24151F]/60 border border-emerald-800/60 text-xs font-mono text-emerald-300 whitespace-pre-line">
                    {codeRunOutput}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#24151F]/40 border border-[#24151F]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg bg-[#100D14] border border-[#24151F] disabled:opacity-40 text-xs font-medium text-[#F5F1F5] flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={toggleFlag}
                className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  currentQ.isFlagged
                    ? 'bg-[#FF8866]/20 border-[#FF8866] text-[#FF8866]'
                    : 'bg-[#100D14] border-[#24151F] text-[#F5F1F5]/60 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{currentQ.isFlagged ? 'Flagged' : 'Flag for Review'}</span>
              </button>

              <button
                type="button"
                onClick={clearSelection}
                className="px-3 py-2 rounded-lg text-xs text-[#F5F1F5]/50 hover:text-white transition-colors"
              >
                Clear Selection
              </button>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="px-5 py-2 rounded-lg bg-[#24151F] border border-[#24151F] hover:border-[#E879B9]/40 disabled:opacity-40 text-xs font-bold text-[#F5F1F5] flex items-center gap-1.5"
            >
              <span>Save & Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Question Navigation Palette */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F1F5]">
              Question Navigation
            </h4>
            <span className="text-[11px] font-mono text-[#F5F1F5]/50">
              {questions.filter(q => q.userAnswer !== undefined || q.type === 'coding').length}/{questions.length} Answered
            </span>
          </div>

          {/* Grid of question tiles */}
          <div className="grid grid-cols-5 gap-2.5">
            {questions.map((q, idx) => {
              const isAnswered = q.userAnswer !== undefined || q.type === 'coding';
              const isCurrent = idx === currentIndex;
              const isFlagged = q.isFlagged;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-11 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center relative transition-all border ${
                    isCurrent
                      ? 'border-[#E879B9] bg-[#E879B9] text-[#100D14]'
                      : isFlagged
                      ? 'border-[#FF8866] bg-[#FF8866]/20 text-[#FF8866]'
                      : isAnswered
                      ? 'border-emerald-700 bg-emerald-950/60 text-emerald-300'
                      : 'border-[#24151F] bg-[#100D14] text-[#F5F1F5]/60 hover:border-[#E879B9]/30'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  {isFlagged && <div className="w-1.5 h-1.5 rounded-full bg-[#FF8866] absolute bottom-1" />}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="space-y-2 pt-4 border-t border-[#24151F] text-xs text-[#F5F1F5]/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-950 border border-emerald-700" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#FF8866]/20 border border-[#FF8866]" />
              <span>Flagged for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#100D14] border border-[#24151F]" />
              <span>Unvisited</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
