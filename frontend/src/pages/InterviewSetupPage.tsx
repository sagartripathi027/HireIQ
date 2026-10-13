import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { sampleRoles, sampleJobDescriptions } from '../data/mockData';
import { 
  UploadCloud, 
  FileText, 
  Video, 
  Mic, 
  Check, 
  X, 
  Plus, 
  ArrowRight, 
  Camera, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const InterviewSetupPage: React.FC = () => {
  const { interviewConfig, setInterviewConfig, navigate, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState(interviewConfig.role);
  const [seniority, setSeniority] = useState(interviewConfig.seniority);
  const [jdText, setJdText] = useState(interviewConfig.jobDescription || sampleJobDescriptions['Distributed Systems Architect']);
  const [resumeFileName, setResumeFileName] = useState(interviewConfig.resumeFileName || 'Alex_Vance_Senior_Staff_Resume.pdf');
  const [strongSkills, setStrongSkills] = useState<string[]>(interviewConfig.strongSkills);
  const [weakSkills, setWeakSkills] = useState<string[]>(interviewConfig.weakSkills);
  const [newStrongSkill, setNewStrongSkill] = useState('');
  const [newWeakSkill, setNewWeakSkill] = useState('');

  // Hardware Pre-Check state
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micLevel, setMicLevel] = useState(65);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Simulated or real camera access
    let interval: any;
    if (cameraEnabled) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch(() => {
            // Simulated preview fallback
          });
      }
      // Audio level simulation
      interval = setInterval(() => {
        setMicLevel(Math.floor(40 + Math.random() * 45));
      }, 250);
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (interval) clearInterval(interval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [cameraEnabled]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    if (sampleJobDescriptions[role]) {
      setJdText(sampleJobDescriptions[role]);
    }
  };

  const addStrongSkill = () => {
    if (newStrongSkill.trim() && !strongSkills.includes(newStrongSkill.trim())) {
      setStrongSkills([...strongSkills, newStrongSkill.trim()]);
      setNewStrongSkill('');
    }
  };

  const removeStrongSkill = (tag: string) => {
    setStrongSkills(strongSkills.filter(s => s !== tag));
  };

  const addWeakSkill = () => {
    if (newWeakSkill.trim() && !weakSkills.includes(newWeakSkill.trim())) {
      setWeakSkills([...weakSkills, newWeakSkill.trim()]);
      setNewWeakSkill('');
    }
  };

  const removeWeakSkill = (tag: string) => {
    setWeakSkills(weakSkills.filter(s => s !== tag));
  };

  const handleLaunch = () => {
    setInterviewConfig({
      role: selectedRole,
      seniority,
      jobDescription: jdText,
      resumeFileName,
      strongSkills,
      weakSkills,
      questionCount: 4
    });
    showToast('AI Interview Room initialized. Microphone & avatar calibrated.', 'success');
    navigate('/interview/room');
  };

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb / Flow Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24151F]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F1F5]">
            Configure AI Mock Interview Room
          </h1>
          <p className="text-xs text-[#F5F1F5]/60 mt-1">
            Personalize target job rubrics, parse resume strengths, and verify hardware checks.
          </p>
        </div>

        {/* 3-Step visual flow */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#E879B9] font-semibold">
            <span className="w-5 h-5 rounded-full glow-pink-orange text-[#100D14] flex items-center justify-center font-bold text-[10px]">1</span>
            <span>Setup</span>
          </div>
          <span className="text-[#F5F1F5]/30">→</span>
          <div className="flex items-center gap-2 text-[#F5F1F5]/40">
            <span className="w-5 h-5 rounded-full bg-[#24151F] text-[#F5F1F5]/60 flex items-center justify-center font-bold text-[10px]">2</span>
            <span>Live Room</span>
          </div>
          <span className="text-[#F5F1F5]/30">→</span>
          <div className="flex items-center gap-2 text-[#F5F1F5]/40">
            <span className="w-5 h-5 rounded-full bg-[#24151F] text-[#F5F1F5]/60 flex items-center justify-center font-bold text-[10px]">3</span>
            <span>Evaluation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Role, Seniority, Resume & JD */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Role & Seniority Selector */}
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
            <h3 className="text-sm font-bold text-[#F5F1F5] uppercase tracking-wider">
              1. Target Position & Seniority
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F1F5]/70 mb-1.5">Target Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D14] border border-[#24151F] focus:border-[#E879B9] text-xs text-[#F5F1F5] outline-none"
                >
                  {sampleRoles.map((r) => (
                    <option key={r} value={r} className="bg-[#100D14] text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F1F5]/70 mb-1.5">Seniority Level</label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D14] border border-[#24151F] focus:border-[#E879B9] text-xs text-[#F5F1F5] outline-none"
                >
                  <option value="Junior">Junior Engineer (0-2 yrs)</option>
                  <option value="Mid-Level">Mid-Level Engineer (3-5 yrs)</option>
                  <option value="Senior">Senior Engineer (5-8 yrs)</option>
                  <option value="Lead">Lead / Staff Architect (8+ yrs)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resume Upload Component */}
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F5F1F5] uppercase tracking-wider">
                2. Candidate Resume Upload
              </h3>
              <span className="text-[11px] text-[#FF8866] font-mono">Parsed & Ready</span>
            </div>

            <div className="border-2 border-dashed border-[#24151F] hover:border-[#E879B9]/40 rounded-xl p-6 text-center bg-[#100D14]/60 transition-colors">
              <UploadCloud className="w-8 h-8 text-[#E879B9] mx-auto mb-2" />
              <p className="text-xs font-medium text-[#F5F1F5]">
                {resumeFileName ? (
                  <span className="text-[#E879B9]">{resumeFileName}</span>
                ) : (
                  'Drag and drop your PDF / DOCX resume here'
                )}
              </p>
              <p className="text-[11px] text-[#F5F1F5]/50 mt-1">
                Parsed: 8 yrs experience, Go, TypeScript, Distributed Consensus, High Throughput
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setResumeFileName('Alex_Vance_Senior_Staff_Resume.pdf')}
                  className="px-3 py-1.5 rounded-lg text-xs bg-[#24151F] text-[#F5F1F5]/80 hover:text-white"
                >
                  Load Sample Senior Resume
                </button>
              </div>
            </div>
          </div>

          {/* Job Description (JD) Input */}
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F5F1F5] uppercase tracking-wider">
                3. Target Job Description (JD)
              </h3>
              <button
                type="button"
                onClick={() => setJdText(sampleJobDescriptions[selectedRole] || sampleJobDescriptions['Distributed Systems Architect'])}
                className="text-[11px] text-[#FF8866] hover:underline"
              >
                Auto-fill Tier 1 JD
              </button>
            </div>
            <textarea
              rows={4}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job posting details, tech stack keywords, or requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D14] border border-[#24151F] focus:border-[#E879B9] text-xs text-[#F5F1F5] outline-none font-mono"
            />
          </div>

          {/* Skills Extraction Panel */}
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-5">
            <h3 className="text-sm font-bold text-[#F5F1F5] uppercase tracking-wider">
              4. Competencies Extracted
            </h3>

            {/* Strong Skills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>Strong Skills (Candidate Strengths to Validate)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {strongSkills.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300"
                  >
                    <span>{tag}</span>
                    <button onClick={() => removeStrongSkill(tag)} className="hover:text-emerald-100">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newStrongSkill}
                  onChange={(e) => setNewStrongSkill(e.target.value)}
                  placeholder="Add strength..."
                  className="px-3 py-1.5 rounded-lg bg-[#100D14] border border-[#24151F] text-xs text-[#F5F1F5] outline-none flex-1 max-w-xs"
                />
                <button
                  type="button"
                  onClick={addStrongSkill}
                  className="px-3 py-1.5 rounded-lg bg-[#24151F] text-xs text-[#F5F1F5]/80 hover:text-white"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Weak Skills */}
            <div className="space-y-2 pt-2 border-t border-[#24151F]">
              <label className="text-xs font-semibold text-[#FF8866] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Identified Knowledge Gaps (AI will Target in Questions)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {weakSkills.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#24151F] border border-[#FF8866]/40 text-xs text-[#FF8866]"
                  >
                    <span>{tag}</span>
                    <button onClick={() => removeWeakSkill(tag)} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newWeakSkill}
                  onChange={(e) => setNewWeakSkill(e.target.value)}
                  placeholder="Add skill gap to drill..."
                  className="px-3 py-1.5 rounded-lg bg-[#100D14] border border-[#24151F] text-xs text-[#F5F1F5] outline-none flex-1 max-w-xs"
                />
                <button
                  type="button"
                  onClick={addWeakSkill}
                  className="px-3 py-1.5 rounded-lg bg-[#24151F] text-xs text-[#F5F1F5]/80 hover:text-white"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Hardware Pre-Check & Launch CTA */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-2xl bg-[#24151F]/60 border border-[#24151F] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F5F1F5] uppercase tracking-wider">
                Hardware Pre-Check
              </h3>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded font-mono">
                WebRTC Supported
              </span>
            </div>

            {/* Video preview viewport */}
            <div className="relative aspect-video rounded-xl bg-[#100D14] border border-[#24151F] overflow-hidden flex items-center justify-center">
              {cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              ) : (
                <div className="text-center p-4 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-[#24151F] border border-[#24151F] flex items-center justify-center text-[#F5F1F5]/40 mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-[#F5F1F5]/60">Camera is currently in preview standby</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#100D14]/90 backdrop-blur-md border border-[#24151F] text-xs text-[#F5F1F5] hover:border-[#E879B9]/50 transition-colors"
              >
                {cameraEnabled ? 'Turn Off Cam' : 'Test Camera'}
              </button>
            </div>

            {/* Microphone Volume Meter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F5F1F5]/70 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-[#E879B9]" />
                  <span>Microphone Sensitivity</span>
                </span>
                <span className="font-mono text-xs text-[#FF8866]">{cameraEnabled ? `${micLevel}%` : 'Standby'}</span>
              </div>
              <div className="w-full bg-[#100D14] h-2 rounded-full overflow-hidden border border-[#24151F]">
                <div
                  className="glow-pink-orange h-full rounded-full transition-all duration-150"
                  style={{ width: `${cameraEnabled ? micLevel : 20}%` }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs text-[#F5F1F5]/70 border-t border-[#24151F] pt-4">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Web Speech API Speech Recognition: Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>3D AI Avatar Synthesizer: Loaded</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Senior Rubric Evaluator: Armed</span>
              </div>
            </div>

            {/* Launch Action Button */}
            <button
              onClick={handleLaunch}
              className="w-full py-4 rounded-xl font-bold text-sm text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xl shadow-[#E879B9]/25"
            >
              <span>Launch AI Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
