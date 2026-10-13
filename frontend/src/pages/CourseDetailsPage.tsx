import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Sparkles 
} from 'lucide-react';

export const CourseDetailsPage: React.FC = () => {
  const { courses, enrolledCourseIds, enrollCourse, routeParams, navigate } = useApp();

  const courseId = routeParams.courseId || courses[0].id;
  const course = courses.find(c => c.id === courseId) || courses[0];

  const isEnrolled = enrolledCourseIds.includes(course.id);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || 'mod_1']: true
  });

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartCourse = () => {
    if (!isEnrolled) {
      enrollCourse(course.id);
    }
    const firstLessonId = course.modules[0]?.lessons[0]?.id || 'les_101';
    navigate(`/courses/${course.id}/lesson/${firstLessonId}`);
  };

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-xs text-[#F5F1F5]/60 hover:text-[#FF8866] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Course Directory</span>
      </button>

      {/* Main Grid: Details Left, Sticky Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Course Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#24151F] border border-[#E879B9]/30 text-[#E879B9] font-mono font-bold">
                {course.category}
              </span>
              <span className="text-[#F5F1F5]/40">·</span>
              <span className="text-[#FF8866] font-mono">{course.difficulty}</span>
              <span className="text-[#F5F1F5]/40">·</span>
              <span className="text-[#F5F1F5]/60">Last updated {course.lastUpdated}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F1F5] leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-[#F5F1F5]/70 leading-relaxed">
              {course.description}
            </p>

            {/* Instructor Card */}
            <div className="p-4 rounded-xl bg-[#24151F]/40 border border-[#24151F] flex items-center gap-4">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-[#E879B9]/30"
              />
              <div>
                <h4 className="text-sm font-bold text-[#F5F1F5]">{course.instructor.name}</h4>
                <p className="text-xs text-[#F5F1F5]/60">{course.instructor.role}</p>
              </div>
            </div>
          </div>

          {/* Learning Outcomes List */}
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-4">
            <h3 className="text-base font-bold text-[#F5F1F5]">What You Will Learn & Master</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#F5F1F5]/80">
                  <Check className="w-4 h-4 text-[#FF8866] shrink-0 mt-0.5" />
                  <span className="leading-snug">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Accordion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F5F1F5]">Course Curriculum</h3>
              <span className="text-xs text-[#F5F1F5]/60 font-mono">
                {course.modules.length} Modules · {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
              </span>
            </div>

            <div className="space-y-3">
              {course.modules.map((mod, modIdx) => {
                const isExpanded = !!expandedModules[mod.id];

                return (
                  <div key={mod.id} className="rounded-xl bg-[#24151F]/30 border border-[#24151F] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-[#24151F]/50 transition-colors"
                    >
                      <span className="text-sm font-bold text-[#F5F1F5]">{mod.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#F5F1F5]/50 font-mono">{mod.lessons.length} lessons</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#F5F1F5]/40" /> : <ChevronDown className="w-4 h-4 text-[#F5F1F5]/40" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[#24151F] divide-y divide-[#24151F]/60">
                        {mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-3.5 pl-6 flex items-center justify-between gap-4 hover:bg-[#100D14]/40 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <PlayCircle className="w-4 h-4 text-[#FF8866] shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#F5F1F5] truncate">{lesson.title}</p>
                                <p className="text-[10px] text-[#F5F1F5]/40 font-mono">{lesson.duration}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => navigate(`/courses/${course.id}/lesson/${lesson.id}`)}
                              className="px-3 py-1 rounded-lg text-xs font-medium text-[#E879B9] hover:bg-[#24151F] transition-colors shrink-0"
                            >
                              Play Lesson
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] space-y-3">
            <h3 className="text-base font-bold text-[#F5F1F5]">Prerequisites & Architecture Context</h3>
            <ul className="space-y-2 text-xs text-[#F5F1F5]/70">
              {course.prerequisites.map((req, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E879B9]" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column (4 cols): Sticky Action Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="rounded-2xl bg-gradient-to-b from-[#24151F] to-[#100D14] border border-[#E879B9]/30 p-6 space-y-6 shadow-xl">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#100D14] border border-[#24151F]">
              <img
                src={course.thumbnail}
                alt={course.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#100D14]/30 flex items-center justify-center">
                <button
                  onClick={handleStartCourse}
                  className="w-12 h-12 rounded-full glow-pink-orange flex items-center justify-center text-[#100D14] shadow-lg shadow-[#E879B9]/40 hover:scale-105 transition-transform"
                >
                  <PlayCircle className="w-6 h-6 fill-current text-[#100D14]" />
                </button>
              </div>
            </div>

            <div className="space-y-3 border-y border-[#24151F] py-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F1F5]/60 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#FF8866]" />
                  <span>Duration:</span>
                </span>
                <span className="font-mono text-[#F5F1F5] font-bold">{course.durationHours} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#F5F1F5]/60 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#E879B9]" />
                  <span>Students Enrolled:</span>
                </span>
                <span className="font-mono text-[#F5F1F5] font-bold">{course.enrolledStudents.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#F5F1F5]/60 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-300" />
                  <span>Rating:</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">{course.rating} / 5.0</span>
              </div>
            </div>

            {/* Progress gauge if enrolled */}
            {isEnrolled && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#F5F1F5]/70">
                  <span>Your Completion:</span>
                  <span className="font-mono text-[#FF8866] font-bold">{course.progressPercent || 25}%</span>
                </div>
                <div className="w-full bg-[#100D14] h-2 rounded-full overflow-hidden border border-[#24151F]">
                  <div className="glow-pink-orange h-full rounded-full" style={{ width: `${course.progressPercent || 25}%` }} />
                </div>
              </div>
            )}

            <button
              onClick={handleStartCourse}
              className="w-full py-4 rounded-xl font-bold text-sm text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xl shadow-[#E879B9]/25"
            >
              <span>{isEnrolled ? 'Continue Course' : 'Enroll & Start Learning'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
