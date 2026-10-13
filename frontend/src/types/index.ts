export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  readinessScore: number;
  credits: number;
  streakDays: number;
  interviewsCompleted: number;
  assessmentsCompleted: number;
  learningHours: number;
  weakSkills: string[];
  strongSkills: string[];
}

export interface InterviewConfig {
  role: string;
  seniority: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Staff/Principal';
  resumeFileName?: string;
  resumeText?: string;
  jobDescription?: string;
  strongSkills: string[];
  weakSkills: string[];
  questionCount: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'System Design' | 'Algorithms' | 'Architecture' | 'Behavioral' | 'Frontend' | 'Web3';
  contextSnippet?: string;
  candidateAnswer?: string;
  aiFeedback?: string;
  modelAnswer?: string;
  score?: number;
}

export interface InterviewResult {
  id: string;
  role: string;
  date: string;
  overallScore: number;
  recommendation: 'Ready' | 'Strong Potential' | 'Needs Work';
  pillars: {
    technicalAccuracy: number;
    communicationClarity: number;
    confidencePacing: number;
    problemSolving: number;
  };
  strongSkills: { skill: string; quote: string }[];
  weakSkills: { skill: string; gap: string }[];
  questions: InterviewQuestion[];
  recommendedCourses: string[];
  recommendedNotes: string[];
}

export interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'coding' | 'scenario';
  prompt: string;
  codeContext?: string;
  options?: string[];
  correctOptionIndex?: number;
  starterCode?: string;
  solutionCode?: string;
  userAnswer?: string | number;
  isFlagged?: boolean;
  explanation: string;
  subtopic: string;
}

export interface AssessmentConfig {
  type: 'MCQ' | 'Coding' | 'System Scenario';
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
  tailorToResume: boolean;
  timeLimitMinutes: number;
}

export interface AssessmentResult {
  id: string;
  topic: string;
  difficulty: string;
  date: string;
  passed: boolean;
  scorePercent: number;
  percentile: number;
  timeSpentSeconds: number;
  accuracyRate: number;
  attemptedCount: number;
  skippedCount: number;
  topicMastery: { topic: string; score: number }[];
  questions: AssessmentQuestion[];
  targetedRevisionNotes: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview?: boolean;
  completed?: boolean;
  videoUrl?: string;
  summary: string;
  keyTakeaways: string[];
  codeSnippets?: { language: string; code: string; title: string }[];
  resources?: { title: string; type: string; url: string }[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'AI & ML' | 'System Design' | 'Web3 & Distributed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  rating: number;
  enrolledStudents: number;
  durationHours: number;
  thumbnail: string;
  progressPercent?: number;
  lastUpdated: string;
  learningOutcomes: string[];
  prerequisites: string[];
  modules: CourseModule[];
}

export interface NoteTopic {
  id: string;
  title: string;
  category: string;
  readTimeMinutes: number;
  tags: string[];
  summary: string;
  keyFormulasAndTraps: { label: string; detail: string }[];
  contentMarkdown: string;
  assessmentTopicRef: string;
  isBookmarked?: boolean;
}
