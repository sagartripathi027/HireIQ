import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Bookmark, 
  Download, 
  Clock, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const NotesViewerPage: React.FC = () => {
  const { notes, bookmarkedNoteIds, toggleBookmarkNote, routeParams, navigate, showToast } = useApp();

  const topicId = routeParams.topicId || notes[0].id;
  const note = notes.find(n => n.id === topicId) || notes[0];

  const isBookmarked = bookmarkedNoteIds.includes(note.id);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast('Code snippet copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportPDF = () => {
    showToast('Exporting revision sheet as printable PDF dossier...', 'success');
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Reading Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24151F]">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-2 text-xs text-[#F5F1F5]/60 hover:text-[#FF8866] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Notes Catalog</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#F5F1F5]/50">
            <span className="text-[#E879B9] font-mono font-bold uppercase">{note.category}</span>
            <span>/</span>
            <span>Cheat Sheet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F1F5]">
            {note.title}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#F5F1F5]/60 font-mono pr-2">
            <Clock className="w-3.5 h-3.5 text-[#FF8866]" />
            <span>{note.readTimeMinutes} min read</span>
          </div>

          <button
            onClick={() => toggleBookmarkNote(note.id)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isBookmarked
                ? 'bg-[#E879B9]/20 border-[#E879B9] text-[#E879B9]'
                : 'bg-[#24151F]/40 border-[#24151F] text-[#F5F1F5]/70 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export as PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Markdown & Diagram Reader Canvas (8 cols) */}
        <article className="lg:col-span-8 space-y-8">
          {/* Quick Revision Cheatsheet Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#24151F] to-[#100D14] border border-[#E879B9]/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF8866]">
                Quick Revision Summary & Interview Traps
              </h3>
              <AlertTriangle className="w-4 h-4 text-[#FF8866]" />
            </div>

            <div className="space-y-2.5">
              {note.keyFormulasAndTraps.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#100D14] border border-[#24151F] flex items-start gap-3 text-xs">
                  <span className="font-mono font-bold text-[#E879B9] shrink-0 pt-0.5">{item.label}:</span>
                  <span className="text-[#F5F1F5]/80 leading-relaxed">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Visual Diagram Block */}
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F1F5]">
                Architecture Flowchart / State Machine
              </h4>
              <span className="text-[11px] font-mono text-emerald-400">Canonical Flow</span>
            </div>

            {/* ASCII & Styled Architecture Diagram */}
            <div className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] font-mono text-xs text-[#F5F1F5]/90 overflow-x-auto leading-relaxed">
              <pre>{`[CLIENT WRITE]
       │
       ▼
 ┌───────────────┐  AppendEntries RPCs   ┌─────────────────┐
 │ LEADER (Term 2)│ ──────────────────────►│ FOLLOWER (Term 2)│
 └───────┬───────┘                        └─────────────────┘
         │ Quorum Reached (3/5 nodes)
         ▼
 ┌───────────────┐
 │ COMMITTED LOG │ ──► Applied to Local State Machine
 └───────────────┘
         │
    (Partition)
         ▼
 [Isolated Minority] ──► Cannot commit writes (reverts on partition heal)`}</pre>
            </div>
          </div>

          {/* Formatted Markdown Content */}
          <div className="p-8 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-6 text-sm text-[#F5F1F5]/80 leading-relaxed">
            <div className="prose prose-invert max-w-none space-y-4">
              <h2 className="text-xl font-bold text-[#F5F1F5] pt-2">
                Distributed Consensus Mechanics
              </h2>
              <p>
                In distributed systems, achieving consensus across unreliable networks is the cornerstone of fault tolerance. When an existing leader fails, a new leader must be elected promptly, and logs must be applied to state machines deterministically.
              </p>

              {/* Callout Tip Box */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Production Invariant:</strong> Raft leaders never commit log entries from previous terms by counting replicas directly; they only commit logs through current term progress.
                </p>
              </div>

              <h3 className="text-base font-bold text-[#F5F1F5] pt-4">
                Handling Split-Brain Scenarios
              </h3>
              <p>
                Under an asymmetric network partition, a minority partition leader continues accepting client writes. However, because it cannot establish contact with a quorum of servers (\`floor(N/2) + 1\`), those log entries remain uncommitted. When network routes heal, the higher-term leader forces the stale leader to step down.
              </p>

              {/* Syntax Highlighted Code Block */}
              <div className="rounded-xl border border-[#24151F] bg-[#100D14] overflow-hidden my-4">
                <div className="bg-[#24151F] px-4 py-2 flex items-center justify-between text-xs text-[#F5F1F5]/60 font-mono">
                  <span>raft_invariants.go</span>
                  <button
                    onClick={() => handleCopyCode(`// Randomized election timeout prevents split votes\nfunc (rf *Raft) resetElectionTimeout() {\n    r := rand.New(rand.NewSource(time.Now().UnixNano()))\n    rf.electionTimeout = 150 + time.Duration(r.Intn(150))*time.Millisecond\n}`)}
                    className="flex items-center gap-1 text-[#E879B9] hover:underline"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 font-mono text-xs text-[#F5F1F5]">
                  <pre>{`// Randomized election timeout prevents split votes
func (rf *Raft) resetElectionTimeout() {
    r := rand.New(rand.NewSource(time.Now().UnixNano()))
    rf.electionTimeout = 150 + time.Duration(r.Intn(150))*time.Millisecond
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Right Column (4 cols): Sticky Table of Contents & "Test Yourself" Card */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Table of Contents */}
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F1F5]">
              On This Page
            </h4>
            <nav className="space-y-1.5 text-xs text-[#F5F1F5]/60">
              <a href="#summary" className="block hover:text-[#E879B9] transition-colors">
                1. Quick Revision Summary
              </a>
              <a href="#diagram" className="block hover:text-[#E879B9] transition-colors">
                2. State Machine Flowchart
              </a>
              <a href="#invariants" className="block hover:text-[#E879B9] transition-colors">
                3. Consensus Mechanics
              </a>
              <a href="#split-brain" className="block hover:text-[#E879B9] transition-colors">
                4. Split-Brain Mitigation
              </a>
            </nav>
          </div>

          {/* "Test Yourself" Action Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#24151F] to-[#100D14] border border-[#FF8866]/30 space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#FF8866] uppercase font-bold">
                Knowledge Verification
              </span>
              <h4 className="text-base font-bold text-[#F5F1F5]">Test Yourself on This Topic</h4>
              <p className="text-xs text-[#F5F1F5]/60 leading-relaxed">
                Take an instant 5-question adaptive assessment to benchmark your retention of these formulas and invariants.
              </p>
            </div>

            <button
              onClick={() => navigate('/assessment/setup')}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-[#E879B9]/20"
            >
              <span>Launch Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
