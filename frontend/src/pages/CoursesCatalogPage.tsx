import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  BookOpen, 
  Star, 
  Users, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';

export const CoursesCatalogPage: React.FC = () => {
  const { courses, enrolledCourseIds, enrollCourse, navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = ['All', 'System Design', 'Frontend', 'Web3 & Distributed'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const enrolledCoursesList = courses.filter(c => enrolledCourseIds.includes(c.id));

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] p-6 lg:p-8 max-w-7xl mx-auto space-y-10">
      {/* Header & Search */}
      <div className="space-y-4 pb-6 border-b border-[#24151F]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F1F5]">
              Curated Engineering Courses
            </h1>
            <p className="text-xs text-[#F5F1F5]/60 mt-1">
              Deep architectural masterclasses designed specifically to elevate candidates into staff & principal bands.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, instructor..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#24151F]/60 border border-[#24151F] focus:border-[#E879B9] text-xs text-[#F5F1F5] outline-none pl-9 transition-colors"
            />
            <Search className="w-4 h-4 text-[#F5F1F5]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#24151F]/40 border border-[#24151F] rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'glow-pink-orange text-[#100D14] font-bold shadow-sm'
                    : 'text-[#F5F1F5]/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Segmented Filter */}
          <div className="flex items-center gap-2 text-xs text-[#F5F1F5]/60">
            <span>Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#24151F] border border-[#24151F] text-xs text-[#F5F1F5] outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* "In Progress" Reel */}
      {enrolledCoursesList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F1F5]">
              In Progress Masterclasses
            </h3>
            <span className="text-xs text-[#FF8866] font-mono">{enrolledCoursesList.length} Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCoursesList.map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-[#24151F]/50 border border-[#24151F] hover:border-[#E879B9]/30 transition-all flex flex-col sm:flex-row items-center gap-5"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-36 h-24 rounded-xl object-cover border border-[#24151F] shrink-0"
                />

                <div className="flex-1 space-y-2 w-full">
                  <span className="text-[10px] font-mono text-[#E879B9] uppercase font-bold">
                    {course.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#F5F1F5] line-clamp-1">
                    {course.title}
                  </h4>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#F5F1F5]/60">
                      <span>Progress</span>
                      <span className="font-mono text-[#FF8866]">{course.progressPercent || 25}%</span>
                    </div>
                    <div className="w-full bg-[#100D14] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="glow-pink-orange h-full rounded-full"
                        style={{ width: `${course.progressPercent || 25}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => navigate(`/courses/${course.id}/lesson/${course.modules[0].lessons[0].id}`)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#100D14] glow-pink-orange hover:opacity-90 flex items-center gap-1.5"
                    >
                      <span>Resume Lesson</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Course Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F1F5]">
          All Available Curriculums
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="rounded-2xl bg-[#24151F]/40 border border-[#24151F] hover:border-[#E879B9]/40 hover:shadow-xl hover:shadow-[#E879B9]/5 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#100D14]">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#100D14]/80 backdrop-blur-md border border-[#24151F] text-[10px] font-mono text-[#E879B9] font-bold">
                      {course.difficulty}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#F5F1F5]/60">
                      <span>{course.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF8866]" />
                        <span>{course.durationHours} hrs</span>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#F5F1F5] leading-snug group-hover:text-[#E879B9] transition-colors">
                      {course.title}
                    </h4>

                    <p className="text-xs text-[#F5F1F5]/60 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Instructor */}
                    <div className="flex items-center gap-2.5 pt-2">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-[#24151F]"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-[#F5F1F5]">{course.instructor.name}</p>
                        <p className="text-[10px] text-[#F5F1F5]/40">{course.instructor.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="p-5 pt-0 border-t border-[#24151F]/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-[#F5F1F5]/60">
                    <span className="flex items-center gap-1 font-mono text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{course.rating}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3" />
                      <span>{course.enrolledStudents.toLocaleString()}</span>
                    </span>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#FF8866] hover:bg-[#24151F] transition-colors"
                    >
                      View Syllabus
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        enrollCourse(course.id);
                        navigate(`/courses/${course.id}`);
                      }}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity"
                    >
                      Enroll Free
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
