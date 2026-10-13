import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  RotateCcw, 
  Download, 
  BookOpen, 
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const InterviewResultPage: React.FC = () => {
  const { interviewResults, latestInterviewResultId, routeParams, navigate, showToast } = useApp();

  const targetId = routeParams.id || latestInterviewResultId;
  const result = interviewResults.find(r => r.id === targetId) || interviewResults[0];

  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    [result.questions[0]?.id || 'q1']: true
  });

  const toggleAccordion = (id: string) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadPDF = () => {
    showToast('Generating official HireIQ candidate PDF dossier...', 'success');
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Navigation & Header */}
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
            AI Interview Evaluation Dossier
          </h1>
          <p className="text-xs text-[#F5F1F5]/60 mt-1">
            Session ID: <span className="font-mono text-[#E879B9]">{result.id}</span> · Completed {result.date}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/interview/setup')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#24151F] bg-[#24151F]/40 hover:bg-[#24151F] text-xs font-semibold text-[#F5F1F5] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF8866]" />
            <span>Retake Interview</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity shadow-lg shadow-[#E879B9]/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Overall Score Card + Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Overall Score Card (4 cols) */}
        <div className="lg:col-span-4 p-8 rounded-2xl bg-gradient-to-b from-[#24151F] to-[#100D14] border border-[#E879B9]/30 flex flex-col justify-between text-center relative overflow-hidden shadow-xl">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-[#E879B9] uppercase font-bold">
              Overall Readiness Score
            </span>
            <div className="py-4">
              <span className="text-6xl sm:text-7xl font-extrabold text-gradient-warm font-mono tabular-nums">
                {result.overallScore}%
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#100D14] border border-[#24151F] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-emerald-300">{result.recommendation} for Senior Tier-1</span>
            </div>
          </div>

          <div className="pt-6 border-t border-[#24151F] text-xs text-[#F5F1F5]/60 text-left space-y-1">
            <p className="font-semibold text-[#F5F1F5]">Target Role: {result.role}</p>
            <p className="text-[11px] leading-relaxed">
              Candidate demonstrated strong mastery of distributed consensus and singleflight mechanisms. Minor gaps observed in network partition edge cases.
            </p>
          </div>
        </div>

        {/* Evaluation 4 Pillars (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F5F1F5]/80">1. Technical Accuracy</span>
              <span className="text-lg font-bold text-[#FF8866] font-mono">{result.pillars.technicalAccuracy}%</span>
            </div>
            <div className="w-full bg-[#100D14] h-2 rounded-full overflow-hidden border border-[#24151F]">
              <div className="glow-pink-orange h-full rounded-full" style={{ width: `${result.pillars.technicalAccuracy}%` }} />
            </div>
            <p className="text-[11px] text-[#F5F1F5]/50 leading-relaxed">
              Consistently demonstrated precise understanding of algorithm invariants, Big-O bounds, and data structures.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F5F1F5]/80">2. Communication & Clarity</span>
              <span className="text-lg font-bold text-[#E879B9] font-mono">{result.pillars.communicationClarity}%</span>
            </div>
            <div className="w-full bg-[#100D14] h-2 rounded-full overflow-hidden border border-[#24151F]">
              <div className="glow-pink-orange h-full rounded-full" style={{ width: `${result.pillars.communicationClarity}%` }} />
            </div>
            <p className="text-[11px] text-[#F5F1F5]/50 leading-relaxed">
              Articulated complex distributed concepts with succinct structure; avoided filler words and rambling.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F5F1F5]/80">3. Confidence & Pacing</span>
              <span className="text-lg font-bold text-[#FF8866] font-mono">{result.pillars.confidencePacing}%</span>
            </div>
            <div className="w-full bg-[#100D14] h-2 rounded-full overflow-hidden border border-[#24151F]">
              <div className="glow-pink-orange h-full rounded-full" style={{ width: `${result.pillars.confidencePacing}%` }} />
            </div>
            <p className="text-[11px] text-[#F5F1F5]/50 leading-relaxed">
              Maintained steady vocal cadence (135 words/min) with appropriate pauses before tackling design questions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F5F1F5]/80">4. Problem-Solving Structure</span>
              <span className="text-lg font-bold text-[#E879B9] font-mono">{result.pillars.problemSolving}%</span>
            </div>
            <div className="w-full bg-[#100D14] h-2 rounded-full overflow-hidden border border-[#24151F]">
              <div className="glow-pink-orange h-full rounded-full" style={{ width: `${result.pillars.problemSolving}%` }} />
            </div>
            <p className="text-[11px] text-[#F5F1F5]/50 leading-relaxed">
              Clarified constraints first, evaluated trade-offs (PACELC), and provided scalable production mitigations.
            </p>
          </div>
        </div>
      </div>

      {/* Demonstrated Skills Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Skills Verified */}
        <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strong Skills Verified (With Candidate Citations)</span>
          </div>

          <div className="space-y-3">
            {result.strongSkills.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] space-y-1.5">
                <p className="text-xs font-semibold text-emerald-300">{item.skill}</p>
                <p className="text-xs italic text-[#F5F1F5]/70">{item.quote}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Skills / Knowledge Gaps */}
        <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
          <div className="flex items-center gap-2 text-[#FF8866] font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Identified Knowledge Gaps (Actionable Areas)</span>
          </div>

          <div className="space-y-3">
            {result.weakSkills.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] space-y-1.5">
                <p className="text-xs font-semibold text-[#FF8866]">{item.skill}</p>
                <p className="text-xs text-[#F5F1F5]/70">{item.gap}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question-by-Question Accordion */}
      <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
        <h3 className="text-base font-bold text-[#F5F1F5]">
          Question-by-Question Transcript & AI Rubric Audit
        </h3>

        <div className="space-y-3">
          {result.questions.map((q, idx) => {
            const isExpanded = !!expandedQuestions[q.id];

            return (
              <div
                key={q.id}
                className="rounded-xl bg-[#100D14] border border-[#24151F] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(q.id)}
                  className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-[#24151F]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-[#24151F] flex items-center justify-center font-mono text-xs text-[#E879B9] shrink-0 font-bold">
                      Q{idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#F5F1F5] truncate">
                      {q.question}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-[#FF8866]">
                      {q.score || 90}%
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#F5F1F5]/40" /> : <ChevronDown className="w-4 h-4 text-[#F5F1F5]/40" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-5 border-t border-[#24151F] space-y-4 text-xs leading-relaxed">
                    {/* Candidate Answer */}
                    <div className="space-y-1">
                      <p className="font-semibold text-[#F5F1F5]/60 uppercase tracking-wider text-[10px]">
                        Your Answer (Speech-to-Text Transcript):
                      </p>
                      <div className="p-3.5 rounded-lg bg-[#24151F]/40 border border-[#24151F] text-[#F5F1F5]/90">
                        {q.candidateAnswer || 'Answer provided in session.'}
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="space-y-1">
                      <p className="font-semibold text-[#E879B9] uppercase tracking-wider text-[10px]">
                        AI Evaluator Feedback:
                      </p>
                      <div className="p-3.5 rounded-lg bg-[#24151F]/60 border border-[#E879B9]/30 text-[#F5F1F5]">
                        {q.aiFeedback}
                      </div>
                    </div>

                    {/* Model Answer */}
                    {q.modelAnswer && (
                      <div className="space-y-1">
                        <p className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">
                          Ideal Model Response (Tier-1 Staff Standard):
                        </p>
                        <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-200">
                          {q.modelAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Learning Widget */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#24151F] via-[#24151F]/80 to-[#100D14] border border-[#E879B9]/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base font-bold text-[#F5F1F5]">Close Your Knowledge Gaps</h3>
          <p className="text-xs text-[#F5F1F5]/60">
            We curated 1 interactive course and 2 revision cheat sheets specifically matching your edge case weak spots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/notes/note_raft_consensus')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#100D14] border border-[#24151F] text-xs font-semibold text-[#FF8866] hover:border-[#FF8866]/40 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open Raft Cheat Sheet</span>
          </button>
          <button
            onClick={() => navigate('/courses/crs_sys_design_99')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Launch Recommended Course</span>
          </button>
        </div>
      </div>
    </div>
  );
};
