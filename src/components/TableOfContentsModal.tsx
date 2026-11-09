import { useState, useMemo } from 'react';
import { X, Search, CheckCircle, Bookmark, FileText, ChevronRight, Award } from 'lucide-react';
import { ALL_CHAPTERS, BOOK_PARTS, BOOK_INFO } from '../data/bookIndex';
import { ChapterProgress, ReaderSettings, ExerciseAnswer } from '../types/settings';

interface TableOfContentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
  progressMap: Record<string, ChapterProgress>;
  answersMap: Record<string, ExerciseAnswer>;
  settings: ReaderSettings;
}

export function TableOfContentsModal({
  isOpen,
  onClose,
  currentChapterId,
  onSelectChapter,
  progressMap,
  answersMap,
  settings,
}: TableOfContentsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const isSepia = settings.theme === 'sepia';
  const isDark = settings.theme === 'dark';

  // Calculate statistics
  const totalChapters = ALL_CHAPTERS.length;
  const readCount = Object.values(progressMap).filter((p) => p.read).length;
  const bookmarkCount = Object.values(progressMap).filter((p) => p.bookmarked).length;
  const completedExercisesCount = Object.values(answersMap).filter((a) => a.completed).length;

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return ALL_CHAPTERS.filter(
      (c) =>
        c.titleVi.toLowerCase().includes(q) ||
        c.titleEn.toLowerCase().includes(q) ||
        (c.chapterNumber && `chương ${c.chapterNumber}`.includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full sm:max-w-2xl h-full sm:h-[85vh] sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-colors ${
          isDark
            ? 'bg-stone-900 border border-stone-800 text-stone-100'
            : isSepia
            ? 'bg-[#f7eedc] border border-[#e5d3aa] text-[#3e3223]'
            : 'bg-white border border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
            isDark ? 'border-stone-800 bg-stone-900/50' : isSepia ? 'border-[#e5d3aa] bg-[#f2e5cf]' : 'border-stone-100 bg-stone-50/50'
          }`}
        >
          <div>
            <h2 className="text-lg font-serif font-bold tracking-tight">Mục Lục Cuốn Sách</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
              {BOOK_INFO.titleVi} • {BOOK_INFO.author}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-stone-800 text-stone-400' : isSepia ? 'hover:bg-[#e7d8bd] text-[#5c4a34]' : 'hover:bg-stone-100 text-stone-500'
            }`}
            aria-label="Đóng mục lục"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reading progress banner */}
        <div
          className={`px-4 sm:px-5 py-3 border-b text-xs flex flex-wrap items-center justify-between gap-2 ${
            isDark ? 'border-stone-800 bg-stone-950/40' : isSepia ? 'border-[#e5d3aa] bg-[#ece0c9]/50' : 'border-stone-100 bg-amber-50/40'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Đã đọc: <strong className="font-mono">{readCount}/{totalChapters}</strong> ({Math.round((readCount / totalChapters) * 100)}%)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Đánh dấu: <strong className="font-mono">{bookmarkCount}</strong>
            </span>
            <span className="hidden md:flex items-center gap-1.5 font-medium">
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Bài tập đã làm: <strong className="font-mono">{completedExercisesCount}</strong>
            </span>
          </div>

          <a
            href={BOOK_INFO.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-mono text-amber-700 dark:text-amber-400 hover:underline"
            title="Mở tài liệu PDF gốc đính kèm của Brian Tracy"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mở PDF gốc</span>
          </a>
        </div>

        {/* Search input */}
        <div className="p-3 sm:px-5 sm:py-3 border-b border-stone-200/50 dark:border-stone-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm nhanh theo số chương hoặc tiêu đề (ví dụ: Chương 1, Mục tiêu, Tiền bạc)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-hidden transition-colors ${
                isDark
                  ? 'bg-stone-800/80 text-stone-100 placeholder:text-stone-500 focus:bg-stone-800 border border-stone-700/60'
                  : isSepia
                  ? 'bg-[#ede1c8] text-[#3e3223] placeholder:text-[#8c7a63] focus:bg-[#e7d9bd] border border-[#d9c49a]'
                  : 'bg-stone-100 text-stone-900 placeholder:text-stone-400 focus:bg-stone-50 border border-stone-200'
              }`}
            />
          </div>
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-6">
          {filteredChapters ? (
            <div className="space-y-1.5">
              <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-2">
                Kết quả tìm kiếm ({filteredChapters.length} chương):
              </p>
              {filteredChapters.length === 0 ? (
                <p className="text-sm text-center py-8 opacity-60">Không tìm thấy chương nào phù hợp với từ khóa.</p>
              ) : (
                filteredChapters.map((ch) => renderChapterRow(ch))
              )}
            </div>
          ) : (
            BOOK_PARTS.map((part) => {
              const partChapters = ALL_CHAPTERS.filter((c) => c.partId === part.id);
              return (
                <div key={part.id} className="space-y-2">
                  <div className="pt-2 pb-1 border-b border-stone-200/40 dark:border-stone-800/60">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
                      {part.titleVi}
                    </h3>
                    <p className="text-[11px] opacity-60 font-sans mt-0.5 line-clamp-1">{part.descriptionVi}</p>
                  </div>
                  <div className="space-y-1">
                    {partChapters.map((ch) => renderChapterRow(ch))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  function renderChapterRow(ch: (typeof ALL_CHAPTERS)[0]) {
    const isCurrent = ch.id === currentChapterId;
    const isRead = progressMap[ch.id]?.read;
    const isBookmarked = progressMap[ch.id]?.bookmarked;

    return (
      <button
        key={ch.id}
        onClick={() => {
          onSelectChapter(ch.id);
          onClose();
        }}
        className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 group ${
          isCurrent
            ? isDark
              ? 'bg-amber-950/40 border border-amber-800/60 text-amber-200'
              : isSepia
              ? 'bg-[#e5d4b1] border border-[#caa875] text-[#2c2217]'
              : 'bg-amber-50 border border-amber-200 text-amber-950'
            : isDark
            ? 'hover:bg-stone-800/60 text-stone-300'
            : isSepia
            ? 'hover:bg-[#ede2cb] text-[#4d3e2d]'
            : 'hover:bg-stone-50 text-stone-700'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${
                isCurrent
                  ? 'bg-amber-600 text-white'
                  : isDark
                  ? 'bg-stone-800 text-stone-400'
                  : isSepia
                  ? 'bg-[#e0cfb0] text-[#6b563d]'
                  : 'bg-stone-200 text-stone-600'
              }`}
            >
              {ch.chapterNumber ? `Chương ${ch.chapterNumber}` : 'Mở Đầu'}
            </span>
            <span className="text-xs opacity-50 font-mono hidden sm:inline">{ch.pageRange}</span>
            {isBookmarked && (
              <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-current shrink-0" />
            )}
            {isRead && (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
          </div>

          <h4 className="font-serif font-semibold text-sm sm:text-base mt-1 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
            {ch.titleVi}
          </h4>
          <p className="text-xs opacity-60 font-sans italic truncate mt-0.5">{ch.titleEn}</p>
        </div>

        <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
      </button>
    );
  }
}
