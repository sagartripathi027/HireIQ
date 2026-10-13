import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  Course, 
  NoteTopic, 
  InterviewConfig, 
  InterviewResult, 
  AssessmentConfig, 
  AssessmentResult, 
  AssessmentQuestion 
} from '../types';
import { 
  currentUser as defaultUser, 
  mockCourses, 
  mockNotes, 
  initialInterviewResults, 
  initialAssessmentResults,
  sampleAssessmentsPool 
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation
  currentPath: string;
  navigate: (path: string) => void;
  routeParams: Record<string, string>;
  
  // Auth & User
  user: User;
  isLoggedIn: boolean;
  login: (email?: string, name?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Interview Module
  interviewConfig: InterviewConfig;
  setInterviewConfig: (config: InterviewConfig) => void;
  interviewResults: InterviewResult[];
  addInterviewResult: (result: InterviewResult) => void;
  latestInterviewResultId: string;
  
  // Assessment Module
  assessmentConfig: AssessmentConfig;
  setAssessmentConfig: (config: AssessmentConfig) => void;
  assessmentResults: AssessmentResult[];
  addAssessmentResult: (result: AssessmentResult) => void;
  latestAssessmentResultId: string;
  
  // Learning Module - Courses
  courses: Course[];
  enrolledCourseIds: string[];
  enrollCourse: (courseId: string) => void;
  completedLessonIds: string[];
  markLessonCompleted: (lessonId: string) => void;
  
  // Learning Module - Notes
  notes: NoteTopic[];
  bookmarkedNoteIds: string[];
  toggleBookmarkNote: (noteId: string) => void;
  
  // Feedback Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const defaultInterviewConfig: InterviewConfig = {
  role: 'Distributed Systems Architect',
  seniority: 'Senior',
  resumeFileName: 'Alex_Vance_Senior_Staff_Resume.pdf',
  resumeText: 'Alex Vance — 8+ years building high-throughput distributed systems in Go, TypeScript, and Rust. Led migration to Raft consensus cluster and sharded PostgreSQL infrastructure.',
  jobDescription: `Master large-scale distributed architectures, consensus protocols, fault-tolerant message queues, and zero-downtime sharding designed for Web3 and Tier-1 tech.`,
  strongSkills: ['Raft Consensus', 'Consistent Hashing', 'React 19 Concurrency', 'TypeScript Generics'],
  weakSkills: ['Split-Brain Recovery', 'V8 Memory Profiling', 'Database Sharding Edge Cases'],
  questionCount: 4
};

const defaultAssessmentConfig: AssessmentConfig = {
  type: 'MCQ',
  topic: 'System Design & High Availability',
  difficulty: 'Advanced',
  questionCount: 5,
  tailorToResume: true,
  timeLimitMinutes: 15
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Sync with browser URL
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      return pathname && pathname !== '/' ? pathname : '/';
    }
    return '/';
  });

  const [user, setUser] = useState<User>(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Interview state
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>(defaultInterviewConfig);
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>(initialInterviewResults);
  const [latestInterviewResultId, setLatestInterviewResultId] = useState<string>('int_7721');

  // Assessment state
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>(defaultAssessmentConfig);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>(initialAssessmentResults);
  const [latestAssessmentResultId, setLatestAssessmentResultId] = useState<string>('asm_301');

  // Courses state
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['crs_sys_design_99', 'crs_frontend_arch_88']);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['les_101', 'les_102', 'les_fe_101']);

  // Notes state
  const [notes, setNotes] = useState<NoteTopic[]>(mockNotes);
  const [bookmarkedNoteIds, setBookmarkedNoteIds] = useState<string[]>(['note_raft_consensus', 'note_big_o_complexity']);

  // Listen for browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse path dynamic parameters
  const routeParams: Record<string, string> = {};
  if (currentPath.startsWith('/interview/result/')) {
    routeParams.id = currentPath.replace('/interview/result/', '');
  } else if (currentPath.startsWith('/assessment/result/')) {
    routeParams.id = currentPath.replace('/assessment/result/', '');
  } else if (currentPath.startsWith('/courses/')) {
    const parts = currentPath.split('/');
    if (parts[2]) routeParams.courseId = parts[2];
    if (parts[3] === 'lesson' && parts[4]) routeParams.lessonId = parts[4];
  } else if (currentPath.startsWith('/notes/')) {
    routeParams.topicId = currentPath.replace('/notes/', '');
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (email = 'alex.vance@hireiq.io', name = 'Alex Vance') => {
    setIsLoggedIn(true);
    setUser(prev => ({ ...prev, email, name }));
    showToast(`Welcome back, ${name}!`, 'success');
    navigate('/dashboard');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('You have been logged out.', 'info');
    navigate('/');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addInterviewResult = (result: InterviewResult) => {
    setInterviewResults(prev => [result, ...prev]);
    setLatestInterviewResultId(result.id);
    // Increase user metrics
    setUser(prev => ({
      ...prev,
      interviewsCompleted: prev.interviewsCompleted + 1,
      readinessScore: Math.round((prev.readinessScore + result.overallScore) / 2)
    }));
  };

  const addAssessmentResult = (result: AssessmentResult) => {
    setAssessmentResults(prev => [result, ...prev]);
    setLatestAssessmentResultId(result.id);
    setUser(prev => ({
      ...prev,
      assessmentsCompleted: prev.assessmentsCompleted + 1
    }));
  };

  const enrollCourse = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(prev => [...prev, courseId]);
      showToast('Enrolled in course successfully!', 'success');
    }
  };

  const markLessonCompleted = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => [...prev, lessonId]);
      setUser(prev => ({
        ...prev,
        learningHours: +(prev.learningHours + 0.5).toFixed(1)
      }));
      showToast('Lesson marked as completed!', 'success');
    }
  };

  const toggleBookmarkNote = (noteId: string) => {
    setBookmarkedNoteIds(prev => {
      const isBookmarked = prev.includes(noteId);
      const next = isBookmarked ? prev.filter(id => id !== noteId) : [...prev, noteId];
      showToast(isBookmarked ? 'Removed from saved notes' : 'Saved note to bookmarks', 'info');
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        routeParams,
        user,
        isLoggedIn,
        login,
        logout,
        updateUser,
        interviewConfig,
        setInterviewConfig,
        interviewResults,
        addInterviewResult,
        latestInterviewResultId,
        assessmentConfig,
        setAssessmentConfig,
        assessmentResults,
        addAssessmentResult,
        latestAssessmentResultId,
        courses,
        enrolledCourseIds,
        enrollCourse,
        completedLessonIds,
        markLessonCompleted,
        notes,
        bookmarkedNoteIds,
        toggleBookmarkNote,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
