import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Download, 
  MessageSquare, 
  FileText, 
  ExternalLink,
  Copy,
  Check,
  Volume2
} from 'lucide-react';

export const LessonPlayerPage: React.FC = () => {
  const { 
    courses, 
    completedLessonIds, 
    markLessonCompleted, 
    routeParams, 
    navigate, 
    showToast 
  } = useApp();

  const courseId = routeParams.courseId || courses[0].id;
  const course = courses.find(c => c.id === courseId) || courses[0];

  // Find active lesson
  const allLessons = course.modules.flatMap(m => m.lessons);
  const targetLessonId = routeParams.lessonId || allLessons[0].id;
  const currentLessonIndex = allLessons.findIndex(l => l.id === targetLessonId);
  const activeLesson = allLessons[currentLessonIndex !== -1 ? currentLessonIndex : 0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'qa'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [qaList, setQaList] = useState([
    {
      author: 'Marcus Vance',
      role: 'Staff Engineer',
      question: 'When an asymmetric network partition recovers, does the stale leader drop in-flight uncommitted client requests immediately or return an error?',
      answer: 'The leader steps down as soon as it receives an AppendEntries with higher term number. In-flight uncommitted client requests should be rejected with an ErrNotLeader status so clients can retry against the new leader.'
    }
  ]);

  const isCompleted = completedLessonIds.includes(activeLesson.id);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    setQaList([
      {
        author: 'Alex Vance',
        role: 'Senior Candidate',
        question: newQuestionText.trim(),
        answer: 'Instructor Response: Excellent observation! We address this in the upcoming log compaction chapter.'
      },
      ...qaList
    ]);
    setNewQuestionText('');
    showToast('Question submitted to discussion thread!', 'success');
  };

  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prev = allLessons[currentLessonIndex - 1];
      navigate(`/courses/${course.id}/lesson/${prev.id}`);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const next = allLessons[currentLessonIndex + 1];
      navigate(`/courses/${course.id}/lesson/${next.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] flex flex-col justify-between">
      {/* Classroom Navbar */}
      <header className="px-6 py-4 bg-[#24151F]/80 border-b border-[#24151F] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate(`/courses/${course.id}`)}
            className="p-1.5 rounded-lg bg-[#100D14] border border-[#24151F] text-[#F5F1F5]/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] text-[#FF8866] truncate font-mono">{course.title}</p>
            <h2 className="text-sm font-bold text-[#F5F1F5] truncate">{activeLesson.title}</h2>
          </div>
        </div>

        {/* Overall Progress Gauge */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-[#F5F1F5]/50">Course Progress</p>
            <p className="text-xs font-mono font-bold text-[#E879B9]">
              {Math.round((completedLessonIds.filter(id => allLessons.some(l => l.id === id)).length / allLessons.length) * 100)}%
            </p>
          </div>
          <button
            onClick={() => markLessonCompleted(activeLesson.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isCompleted
                ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                : 'glow-pink-orange text-[#100D14] hover:opacity-90'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </header>

      {/* Main Classroom Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Player Canvas + Lesson Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Lesson Player Canvas */}
          <div className="rounded-2xl bg-[#24151F]/40 border border-[#24151F] overflow-hidden">
            <div className="relative aspect-video w-full bg-[#100D14] flex items-center justify-center border-b border-[#24151F]">
              <img
                src={course.thumbnail}
                alt={activeLesson.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Play / Pause Overlay Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full glow-pink-orange flex items-center justify-center text-[#100D14] shadow-2xl hover:scale-105 transition-transform absolute"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>

              {/* Player Bottom Control Bar */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#100D14] via-[#100D14]/80 to-transparent flex items-center justify-between text-xs text-[#F5F1F5]/80">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px]">{isPlaying ? '08:42' : '00:00'} / {activeLesson.duration}</span>
                  <div className="w-32 sm:w-64 bg-[#24151F] h-1.5 rounded-full overflow-hidden">
                    <div className="glow-pink-orange h-full w-1/3" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(e.target.value)}
                    className="bg-[#24151F] px-2 py-0.5 rounded text-[11px] font-mono outline-none"
                  >
                    <option value="1.0x">1.0x</option>
                    <option value="1.25x">1.25x</option>
                    <option value="1.5x">1.5x</option>
                    <option value="2.0x">2.0x</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lesson Title & Summary */}
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-[#F5F1F5]">{activeLesson.title}</h3>
              <p className="text-xs text-[#F5F1F5]/70 leading-relaxed">{activeLesson.summary}</p>
            </div>
          </div>

          {/* Lesson Tabs (Overview, Resources, Q&A) */}
          <div className="rounded-2xl bg-[#24151F]/40 border border-[#24151F] p-6 space-y-6">
            <div className="flex items-center gap-6 border-b border-[#24151F] pb-3 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`transition-colors pb-3 -mb-3 border-b-2 ${
                  activeTab === 'overview' ? 'border-[#E879B9] text-[#E879B9]' : 'border-transparent text-[#F5F1F5]/60 hover:text-white'
                }`}
              >
                Key Invariants & Code
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`transition-colors pb-3 -mb-3 border-b-2 ${
                  activeTab === 'resources' ? 'border-[#E879B9] text-[#E879B9]' : 'border-transparent text-[#F5F1F5]/60 hover:text-white'
                }`}
              >
                Downloadable Resources
              </button>
              <button
                onClick={() => setActiveTab('qa')}
                className={`transition-colors pb-3 -mb-3 border-b-2 ${
                  activeTab === 'qa' ? 'border-[#E879B9] text-[#E879B9]' : 'border-transparent text-[#F5F1F5]/60 hover:text-white'
                }`}
              >
                Discussion & Q&A
              </button>
            </div>

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Takeaways */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF8866]">
                    Core Engineering Takeaways
                  </h4>
                  <ul className="space-y-2 text-xs text-[#F5F1F5]/80">
                    {activeLesson.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#FF8866] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Code Snippet with Copy Button */}
                {activeLesson.codeSnippets && activeLesson.codeSnippets.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F5F1F5]">
                        {activeLesson.codeSnippets[0].title}
                      </span>
                      <button
                        onClick={() => handleCopy(activeLesson.codeSnippets![0].code)}
                        className="flex items-center gap-1.5 text-[11px] text-[#E879B9] hover:underline"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy Snippet'}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] font-mono text-xs text-[#F5F1F5] overflow-x-auto">
                      <pre>{activeLesson.codeSnippets[0].code}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resources Tab Content */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#E879B9]" />
                    <div>
                      <p className="text-xs font-semibold text-[#F5F1F5]">Raft & PACELC Master Diagram (PDF)</p>
                      <p className="text-[10px] text-[#F5F1F5]/50">Architectural cheat sheet · 4.2 MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Downloading Raft Architecture PDF...', 'success')}
                    className="p-2 rounded-lg bg-[#24151F] text-xs text-[#FF8866] hover:bg-[#24151F]/80"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Q&A Tab Content */}
            {activeTab === 'qa' && (
              <div className="space-y-6">
                <form onSubmit={handlePostQuestion} className="space-y-3">
                  <textarea
                    rows={2}
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Ask a question about this lesson's invariants..."
                    className="w-full p-3.5 rounded-xl bg-[#100D14] border border-[#24151F] text-xs text-[#F5F1F5] outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-[#100D14] glow-pink-orange hover:opacity-90"
                    >
                      Post Question
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  {qaList.map((qa, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#100D14] border border-[#24151F] space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-[#F5F1F5]">{qa.author}</span>
                        <span className="text-[#F5F1F5]/40">·</span>
                        <span className="text-[#FF8866] text-[11px]">{qa.role}</span>
                      </div>
                      <p className="text-xs text-[#F5F1F5]/90 font-medium">{qa.question}</p>
                      <div className="p-3 rounded-lg bg-[#24151F]/50 border border-[#24151F] text-xs text-[#F5F1F5]/70 leading-relaxed">
                        {qa.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Collapsible Modules Syllabus Sidebar */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F1F5]">
              Course Syllabus Tree
            </h4>
            <span className="text-[11px] font-mono text-[#E879B9]">
              {allLessons.length} Lessons
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {course.modules.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <p className="text-xs font-bold text-[#F5F1F5]/80">{mod.title}</p>
                <div className="space-y-1">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLesson.id;
                    const isDone = completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => navigate(`/courses/${course.id}/lesson/${lesson.id}`)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${
                          isActive
                            ? 'bg-[#100D14] border-[#E879B9] text-[#E879B9] font-bold shadow-md'
                            : 'bg-[#100D14]/40 border-[#24151F] text-[#F5F1F5]/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-[#24151F] shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#F5F1F5]/40 shrink-0">{lesson.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="px-6 py-4 bg-[#24151F]/90 border-t border-[#24151F] flex items-center justify-between">
        <button
          onClick={goToPrevLesson}
          disabled={currentLessonIndex === 0}
          className="px-4 py-2 rounded-xl bg-[#100D14] border border-[#24151F] disabled:opacity-40 text-xs font-semibold text-[#F5F1F5] flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Lesson</span>
        </button>

        <button
          onClick={goToNextLesson}
          disabled={currentLessonIndex === allLessons.length - 1}
          className="px-5 py-2 rounded-xl font-bold text-xs text-[#100D14] glow-pink-orange hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"
        >
          <span>Next Lesson</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
