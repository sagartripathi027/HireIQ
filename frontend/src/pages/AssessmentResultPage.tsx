import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  RotateCcw, 
  BookOpen, 
  Clock, 
  Target, 
  Award,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export const AssessmentResultPage: React.FC = () => {
  const { assessmentResults, latestAssessmentResultId, routeParams, navigate } = useApp();

  const targetId = routeParams.id || latestAssessmentResultId;
  const result = assessmentResults.find(r => r.id === targetId) || assessmentResults[0];

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24151F]">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs text-[#F5F1F5]/60 hover:text-[#FF8866] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F1F5]">
            Assessment Performance & Topic Mastery
          </h1>
          <p className="text-xs text-[#F5F1F5]/60 mt-1">
            Topic: <span className="text-[#E879B9] font-medium">{result.topic}</span> · Completed {result.date}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/assessment/setup')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#24151F] bg-[#24151F]/40 hover:bg-[#24151F] text-xs font-semibold text-[#F5F1F5] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF8866]" />
            <span>Retake Assessment</span>
          </button>
          <button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity shadow-lg shadow-[#E879B9]/20"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Revision Notes</span>
          </button>
        </div>
      </div>

      {/* Performance Summary Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#24151F] via-[#24151F]/80 to-[#100D14] border border-[#E879B9]/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#100D14] border border-[#24151F] text-xs">
            {result.passed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-300">EXAMINATION PASSED</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-rose-300">NEEDS REVISION</span>
              </>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F1F5]">
            Score: <span className="text-gradient-warm font-mono">{result.scorePercent}%</span>
          </h2>
          <p className="text-xs text-[#F5F1F5]/70 max-w-lg leading-relaxed">
            You outperformed <span className="text-[#FF8866] font-bold">{result.percentile}% of candidates</span> who took this assessment globally. Benchmark matches Tier-1 tech standards.
          </p>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
          <div className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] text-center space-y-1">
            <Clock className="w-4 h-4 text-[#FF8866] mx-auto" />
            <p className="text-xs text-[#F5F1F5]/60">Time Spent</p>
            <p className="text-sm font-bold font-mono text-[#F5F1F5]">
              {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] text-center space-y-1">
            <Target className="w-4 h-4 text-[#E879B9] mx-auto" />
            <p className="text-xs text-[#F5F1F5]/60">Accuracy</p>
            <p className="text-sm font-bold font-mono text-emerald-300">{result.accuracyRate}%</p>
          </div>

          <div className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] text-center space-y-1">
            <Award className="w-4 h-4 text-[#FF8866] mx-auto" />
            <p className="text-xs text-[#F5F1F5]/60">Percentile</p>
            <p className="text-sm font-bold font-mono text-[#FF8866]">{result.percentile}th</p>
          </div>
        </div>
      </div>

      {/* Topic Mastery Breakdown */}
      <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-5">
        <h3 className="text-base font-bold text-[#F5F1F5]">Sub-Topic Competency Mastery</h3>
        <div className="space-y-4">
          {result.topicMastery.map((tm, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F5F1F5]">{tm.topic}</span>
                <span className="font-mono text-[#E879B9] font-bold">{tm.score}%</span>
              </div>
              <div className="w-full bg-[#100D14] h-2 rounded-full overflow-hidden border border-[#24151F]">
                <div
                  className="glow-pink-orange h-full rounded-full transition-all duration-500"
                  style={{ width: `${tm.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Review List */}
      <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-5">
        <h3 className="text-base font-bold text-[#F5F1F5]">Question Audit & Solution Explanations</h3>

        <div className="space-y-4">
          {result.questions.map((q, idx) => {
            const isCorrect = q.type === 'coding' || q.userAnswer === q.correctOptionIndex;

            return (
              <div key={q.id} className="p-5 rounded-xl bg-[#100D14] border border-[#24151F] space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#24151F] flex items-center justify-center font-mono text-xs font-bold text-[#E879B9]">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-mono text-[#F5F1F5]/50">{q.subtopic}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${
                    isCorrect
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950/60 text-rose-300 border border-rose-800'
                  }`}>
                    {isCorrect ? 'Correct +10' : 'Incorrect 0'}
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#F5F1F5]">{q.prompt}</p>

                {/* Candidate selection vs correct */}
                {q.options && (
                  <div className="text-xs space-y-1.5 pt-1">
                    <p className="text-[#F5F1F5]/60">
                      Your Choice: <span className="font-semibold text-white">{q.options[Number(q.userAnswer ?? 0)]}</span>
                    </p>
                    {q.correctOptionIndex !== undefined && (
                      <p className="text-emerald-400">
                        Correct Answer: <span className="font-semibold">{q.options[q.correctOptionIndex]}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Detailed Solution Explanation */}
                <div className="p-3.5 rounded-lg bg-[#24151F]/40 border border-[#24151F] text-xs text-[#F5F1F5]/80 leading-relaxed">
                  <span className="font-bold text-[#FF8866]">Explanation: </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Targeted Revision Suggestions */}
      <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
        <h3 className="text-base font-bold text-[#F5F1F5]">Targeted Revision Recommendations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/notes/note_raft_consensus')}
            className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] hover:border-[#E879B9]/40 text-left transition-all group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#E879B9]">Revision Note</span>
              <p className="text-xs font-semibold text-[#F5F1F5]">Raft Distributed Consensus Cheat Sheet</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#FF8866] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/notes/note_big_o_complexity')}
            className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] hover:border-[#FF8866]/40 text-left transition-all group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#FF8866]">Revision Note</span>
              <p className="text-xs font-semibold text-[#F5F1F5]">Algorithmic Complexity & V8 Memory Bounds</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#FF8866] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
