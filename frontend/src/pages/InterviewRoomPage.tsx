import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { InterviewQuestion, InterviewResult } from '../types';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  RotateCcw, 
  SkipForward, 
  CheckCircle2, 
  PhoneOff, 
  Sparkles,
  Wifi,
  Radio
} from 'lucide-react';

const interviewQuestionsPool: InterviewQuestion[] = [
  {
    id: 'q1',
    question: 'How do you guarantee log consistency across a 5-node Raft consensus cluster when asymmetric network partitions isolate the leader?',
    category: 'System Design',
    modelAnswer: 'A leader isolated in a minority partition fails to reach quorum for log commits. The majority partition times out heartbeats, triggers election for a higher term, and commits writes. Once connectivity restores, the old leader receives the higher term appendEntries RPC, converts to follower, and overwrites uncommitted logs with the authoritative majority logs.'
  },
  {
    id: 'q2',
    question: 'Walk me through how you would architect a cache stampede prevention system handling 150,000 requests per second when high-traffic Redis keys expire.',
    category: 'Architecture',
    modelAnswer: 'Employ singleflight synchronization to collapse identical concurrent cache misses into one database fetch, paired with probabilistic early expiration (XFetch algorithm) to recompute keys prior to hard TTL.'
  },
  {
    id: 'q3',
    question: 'Explain how React 19 Concurrent Fiber time-slicing prevents UI thread jank during complex data-grid re-renders compared to synchronous reconciliation.',
    category: 'Frontend',
    modelAnswer: 'React Fiber splits execution into discrete priority lanes. Low-priority renders yield control to browser event loops every 5ms via MessageChannel, allowing user clicks and typing to interrupt render phases immediately.'
  },
  {
    id: 'q4',
    question: 'Describe a time you audited a smart contract or distributed ledger service for vulnerability vectors like reentrancy or front-running.',
    category: 'Web3',
    modelAnswer: 'Applied the Checks-Effects-Interactions (CEI) invariant and transient storage reentrancy guards (EIP-1153) to eliminate reentrant state re-entry, and used commit-reveal schemes to mitigate front-running.'
  }
];

export const InterviewRoomPage: React.FC = () => {
  const { interviewConfig, addInterviewResult, navigate, showToast } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [avatarStatus, setAvatarStatus] = useState<'Speaking' | 'Listening' | 'Thinking'>('Speaking');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(900); // 15 mins
  const [candidateAnswers, setCandidateAnswers] = useState<Record<number, string>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentQ = interviewQuestionsPool[currentQuestionIndex] || interviewQuestionsPool[0];

  // Live Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Timer mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Webcam stream
  useEffect(() => {
    if (cameraActive) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch(() => {});
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [cameraActive]);

  // Text to Speech for Question
  const speakQuestion = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      setAvatarStatus('Speaking');
      utterance.onend = () => {
        setAvatarStatus('Listening');
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setAvatarStatus('Listening');
    }
  };

  useEffect(() => {
    speakQuestion(currentQ.question);
  }, [currentQuestionIndex]);

  // Web Speech API for candidate answers
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentSpeech = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentSpeech += event.results[i][0].transcript;
          }
          if (currentSpeech) {
            setTranscript(prev => (prev ? `${prev} ${currentSpeech}` : currentSpeech));
          }
        };

        if (isRecording) {
          recognition.start();
        }
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition start error', err);
      }
    }
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, [isRecording]);

  const handleDoneAnswering = () => {
    setAvatarStatus('Thinking');
    const answerToSave = transcript.trim() || 'In our production architecture, we enforced Raft quorums and isolated minority leaders to maintain linearizability.';
    setCandidateAnswers(prev => ({ ...prev, [currentQuestionIndex]: answerToSave }));

    setTimeout(() => {
      if (currentQuestionIndex < interviewQuestionsPool.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTranscript('');
        showToast('Answer recorded. Advancing to next evaluation round.', 'success');
      } else {
        finishInterview();
      }
    }, 1200);
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < interviewQuestionsPool.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript('');
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const newResult: InterviewResult = {
      id: `int_${Math.floor(1000 + Math.random() * 9000)}`,
      role: interviewConfig.role,
      date: 'Today, Oct 13, 2026',
      overallScore: 89,
      recommendation: 'Ready',
      pillars: {
        technicalAccuracy: 92,
        communicationClarity: 88,
        confidencePacing: 86,
        problemSolving: 90
      },
      strongSkills: [
        { skill: 'Distributed Consensus', quote: '"Accurately explained leader election and log compaction without hesitation."' },
        { skill: 'Cache Stampede Prevention', quote: '"Cleanly integrated singleflight pattern and probabilistic early expiration."' }
      ],
      weakSkills: [
        { skill: 'Network Partition Quorum Edge Cases', gap: 'Needs sharper distinction between minority timeouts vs client TCP retries.' }
      ],
      questions: interviewQuestionsPool.map((q, idx) => ({
        ...q,
        candidateAnswer: candidateAnswers[idx] || q.modelAnswer,
        aiFeedback: 'Exceptional depth. Structured response cleanly around engineering invariants.',
        score: idx === 0 ? 94 : idx === 1 ? 90 : 88
      })),
      recommendedCourses: ['crs_sys_design_99', 'crs_frontend_arch_88'],
      recommendedNotes: ['note_raft_consensus', 'note_cap_theorem']
    };

    addInterviewResult(newResult);
    showToast('Interview session concluded! Evaluation report ready.', 'success');
    navigate(`/interview/result/${newResult.id}`);
  };

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] flex flex-col justify-between">
      {/* Session Header */}
      <header className="px-6 py-4 bg-[#24151F]/70 border-b border-[#24151F] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg glow-pink-orange flex items-center justify-center font-bold text-[#100D14] text-xs">
            K
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F5F1F5] truncate">{interviewConfig.role}</h2>
            <div className="flex items-center gap-2 text-[11px] text-[#F5F1F5]/60">
              <span className="text-[#FF8866]">{interviewConfig.seniority}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Wifi className="w-3 h-3" />
                <span>Stable 16ms</span>
              </span>
            </div>
          </div>
        </div>

        {/* Live Timer & Question Count */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-xs bg-[#100D14] px-3.5 py-1.5 rounded-lg border border-[#24151F]">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-400 font-bold">{formatTime(timerSeconds)}</span>
          </div>

          <div className="text-xs text-[#F5F1F5]/70 font-mono hidden sm:block">
            Question <span className="text-[#E879B9] font-bold">{currentQuestionIndex + 1}</span> of {interviewQuestionsPool.length}
          </div>

          <button
            onClick={finishInterview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </header>

      {/* Main Dual Stage (AI Avatar & Candidate Feed) */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (6 cols): AI Avatar Stage */}
        <div className="lg:col-span-6 flex flex-col justify-between p-4 rounded-2xl bg-[#24151F]/40 border border-[#24151F] relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <div className="px-3 py-1 rounded-lg bg-[#100D14]/80 backdrop-blur-md border border-[#24151F] flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#E879B9]" />
              <span className="font-semibold text-[#F5F1F5]">3D AI Interviewer</span>
            </div>

            <div className="px-3 py-1 rounded-lg bg-[#100D14]/80 border border-[#24151F] text-xs font-mono">
              Status: <span className="text-[#FF8866] font-bold">{avatarStatus}</span>
            </div>
          </div>

          {/* AI Avatar Canvas / High-Res Octane Render */}
          <div className="relative my-4 aspect-square max-h-[380px] mx-auto w-full rounded-2xl overflow-hidden bg-[#100D14] flex items-center justify-center border border-[#E879B9]/20 shadow-2xl">
            <img
              src="/src/assets/images/hero_ai_avatar_1791911819065.jpg"
              alt="AI Interviewer Avatar"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                avatarStatus === 'Speaking' ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* Glowing Soundwave Ring when avatar is speaking */}
            {avatarStatus === 'Speaking' && (
              <div className="absolute inset-0 border-4 border-[#E879B9]/40 rounded-2xl animate-pulse pointer-events-none" />
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#F5F1F5]/60 z-10 px-2">
            <span>Adaptive Speech Synthesis v3.2</span>
            <button
              onClick={() => speakQuestion(currentQ.question)}
              className="flex items-center gap-1.5 text-[#FF8866] hover:text-[#E879B9] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat Audio</span>
            </button>
          </div>
        </div>

        {/* Right Column (6 cols): Candidate Stage (Webcam & Audio) */}
        <div className="lg:col-span-6 flex flex-col justify-between p-4 rounded-2xl bg-[#24151F]/40 border border-[#24151F] relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <div className="px-3 py-1 rounded-lg bg-[#100D14]/80 backdrop-blur-md border border-[#24151F] flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-[#F5F1F5]">Candidate Feed (You)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  cameraActive ? 'bg-[#100D14] border-[#24151F] text-[#F5F1F5]' : 'bg-rose-950 border-rose-800 text-rose-300'
                }`}
              >
                {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  isRecording ? 'bg-[#100D14] border-[#24151F] text-[#F5F1F5]' : 'bg-rose-950 border-rose-800 text-rose-300'
                }`}
              >
                {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Candidate Viewport */}
          <div className="relative my-4 aspect-square max-h-[380px] mx-auto w-full rounded-2xl overflow-hidden bg-[#100D14] flex items-center justify-center border border-[#24151F]">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#24151F] flex items-center justify-center mx-auto text-[#F5F1F5]/40 font-bold text-xl">
                  AV
                </div>
                <p className="text-xs text-[#F5F1F5]/50">Camera feed disabled</p>
              </div>
            )}

            {/* Audio Wave Visualizer Overlay */}
            <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-[#100D14]/85 backdrop-blur-md border border-[#24151F] flex items-center gap-3">
              <div className="flex items-center gap-1 h-4">
                {[12, 28, 45, 80, 55, 30, 95, 60, 40, 20].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full glow-pink-orange"
                    style={{
                      height: isRecording ? `${(h * 0.7) % 24 + 4}px` : '4px',
                      transition: 'height 0.15s ease'
                    }}
                  />
                ))}
              </div>
              <span className="text-[11px] text-[#F5F1F5]/60 truncate font-mono">
                {isRecording ? 'Voice Active — Listening to answer...' : 'Microphone Muted'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#F5F1F5]/50 px-2">
            <span>Video Resolution: 1080p HD</span>
            <span>Eye Contact & Posture Tracking: Active</span>
          </div>
        </div>
      </main>

      {/* Live Question & Subtitle Box + Controls */}
      <footer className="p-6 bg-[#24151F]/80 border-t border-[#24151F] backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#E879B9] font-mono font-bold uppercase">{currentQ.category}</span>
                <span className="text-[#F5F1F5]/40">·</span>
                <span className="text-[#F5F1F5]/70">Round {currentQuestionIndex + 1} of {interviewQuestionsPool.length}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#F5F1F5] leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleSkipQuestion}
                className="px-4 py-2.5 rounded-xl border border-[#24151F] text-xs font-medium text-[#F5F1F5]/70 hover:text-white hover:bg-[#100D14] transition-colors"
              >
                Skip Question
              </button>
              <button
                onClick={handleDoneAnswering}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-[#E879B9]/20"
              >
                <span>Done Answering</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Candidate Transcript Box */}
          <div className="p-3.5 rounded-xl bg-[#100D14] border border-[#24151F] flex items-start gap-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF8866] pt-0.5 shrink-0">
              Live Transcript:
            </div>
            <textarea
              rows={2}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Speak out loud, or type your technical response here if microphone access is unavailable..."
              className="w-full bg-transparent text-xs text-[#F5F1F5] placeholder:text-[#F5F1F5]/30 outline-none resize-none font-sans"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};
