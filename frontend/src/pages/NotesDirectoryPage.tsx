import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Bookmark, 
  Clock, 
  ChevronRight, 
  FileText, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const NotesDirectoryPage: React.FC = () => {
  const { notes, bookmarkedNoteIds, toggleBookmarkNote, navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = ['All', '#Consensus', '#Raft', '#HighAvailability', '#CAPTheorem', '#PACELC', '#BigO', '#MemoryLeaks'];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const bookmarkedNotes = notes.filter(n => bookmarkedNoteIds.includes(n.id));

  return (
    <div className="min-h-screen bg-[#100D14] text-[#F5F1F5] p-6 lg:p-8 max-w-7xl mx-auto space-y-10">
      {/* Header & Search */}
      <div className="space-y-4 pb-6 border-b border-[#24151F]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F1F5]">
              Engineering Notes & Cheat Sheets
            </h1>
            <p className="text-xs text-[#F5F1F5]/60 mt-1">
              High-yield revision summaries, algorithm complexity matrices, and consensus traps for last-minute review.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cheat sheets, formulas, Big-O..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#24151F]/60 border border-[#24151F] focus:border-[#E879B9] text-xs text-[#F5F1F5] outline-none pl-9 transition-colors"
            />
            <Search className="w-4 h-4 text-[#F5F1F5]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Tags Cloud Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${
                selectedTag === tag
                  ? 'bg-[#E879B9] text-[#100D14] font-bold shadow-sm'
                  : 'bg-[#24151F]/40 border border-[#24151F] text-[#F5F1F5]/70 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Revision Carousel / Bookmarked Cheat Sheets */}
      {bookmarkedNotes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F1F5]">
              Bookmarked for Last-Minute Prep
            </h3>
            <span className="text-xs text-[#E879B9] font-mono">{bookmarkedNotes.length} Saved</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-gradient-to-r from-[#24151F] to-[#100D14] border border-[#E879B9]/30 hover:border-[#FF8866]/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#FF8866] uppercase font-bold">
                      {note.category}
                    </span>
                    <button
                      onClick={() => toggleBookmarkNote(note.id)}
                      className="text-[#E879B9] hover:opacity-80"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F1F5] group-hover:text-[#E879B9] transition-colors">
                    {note.title}
                  </h4>
                  <p className="text-xs text-[#F5F1F5]/60 line-clamp-2 leading-relaxed">
                    {note.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#24151F] text-xs">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#F5F1F5]/50">
                    <Clock className="w-3.5 h-3.5 text-[#E879B9]" />
                    <span>{note.readTimeMinutes} min read</span>
                  </span>
                  <button
                    onClick={() => navigate(`/notes/${note.id}`)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#FF8866] hover:underline"
                  >
                    <span>Read Sheet</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Category & Topic Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F1F5]">
          All Engineering Topics & Cheat Sheets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const isBookmarked = bookmarkedNoteIds.includes(note.id);

            return (
              <div
                key={note.id}
                className="p-6 rounded-2xl bg-[#24151F]/40 border border-[#24151F] hover:border-[#E879B9]/40 hover:shadow-xl hover:shadow-[#E879B9]/5 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#E879B9] uppercase font-bold">
                      {note.category}
                    </span>
                    <button
                      onClick={() => toggleBookmarkNote(note.id)}
                      className="text-[#F5F1F5]/40 hover:text-[#E879B9] transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#E879B9] text-[#E879B9]' : ''}`} />
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-[#F5F1F5] leading-snug group-hover:text-[#E879B9] transition-colors">
                    {note.title}
                  </h4>

                  <p className="text-xs text-[#F5F1F5]/60 line-clamp-3 leading-relaxed">
                    {note.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {note.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-[#FF8866] bg-[#100D14] px-2 py-0.5 rounded border border-[#24151F]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#24151F] flex items-center justify-between mt-4">
                  <span className="text-[11px] text-[#F5F1F5]/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{note.readTimeMinutes}m read</span>
                  </span>

                  <button
                    onClick={() => navigate(`/notes/${note.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#100D14] glow-pink-orange hover:opacity-90 transition-opacity"
                  >
                    <span>Read Notes</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
