import { BookOpen, Search, Settings, Volume2, Bookmark, CheckCircle2, Languages, PenTool } from 'lucide-react';
import { Chapter } from '../types/book';
import { ReaderSettings } from '../types/settings';

interface ReaderHeaderProps {
  currentChapter: Chapter;
  settings: ReaderSettings;
  isBookmarked: boolean;
  isRead: boolean;
  isAudioPlaying: boolean;
  onOpenToc: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenJournal: () => void;
  onToggleAudio: () => void;
  onToggleBookmark: () => void;
  onToggleRead: () => void;
  onToggleBilingual: () => void;
  totalChapters: number;
  currentChapterIndex: number;
}

export function ReaderHeader({
  currentChapter,
  settings,
  isBookmarked,
  isRead,
  isAudioPlaying,
  onOpenToc,
  onOpenSearch,
  onOpenSettings,
  onOpenJournal,
  onToggleAudio,
  onToggleBookmark,
  onToggleRead,
  onToggleBilingual,
  totalChapters,
  currentChapterIndex,
}: ReaderHeaderProps) {
  const isSepia = settings.theme === 'sepia';
  const isDark = settings.theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-30 transition-colors duration-200 border-b backdrop-blur-md ${
        isDark
          ? 'bg-stone-900/90 border-stone-800 text-stone-200'
          : isSepia
          ? 'bg-[#f7eedc]/95 border-[#e5d3aa] text-[#3e3223]'
          : 'bg-white/95 border-stone-200 text-stone-800'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Left: Table of contents button and chapter title */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onOpenToc}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isDark
                ? 'hover:bg-stone-800 text-stone-300'
                : isSepia
                ? 'hover:bg-[#ebdfc6] text-[#3e3223]'
                : 'hover:bg-stone-100 text-stone-700'
            }`}
            title="Mở mục lục toàn bộ sách (21 chương)"
            aria-label="Mở mục lục"
          >
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline font-sans font-semibold">Mục lục</span>
          </button>

          <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block" />

          {/* Chapter indicator */}
          <div className="min-w-0 truncate">
            <span className="text-xs font-mono uppercase tracking-wider opacity-60 mr-2">
              {currentChapterIndex + 1}/{totalChapters}
            </span>
            <span className="text-xs sm:text-sm font-medium truncate font-sans">
              {currentChapter.chapterNumber
                ? `Chương ${currentChapter.chapterNumber}: ${currentChapter.titleVi}`
                : currentChapter.titleVi}
            </span>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Quick Bilingual Toggle */}
          <button
            onClick={onToggleBilingual}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              settings.showBilingual
                ? 'bg-amber-600 text-white shadow-xs'
                : isDark
                ? 'hover:bg-stone-800 text-stone-300'
                : isSepia
                ? 'hover:bg-[#ebdfc6] text-[#5c4a34]'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
            title={settings.showBilingual ? 'Đang bật đối chiếu song ngữ Anh-Việt' : 'Bật đối chiếu tiếng Anh gốc'}
            aria-label="Bật đối chiếu song ngữ"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden md:inline font-mono text-[11px]">Song ngữ</span>
          </button>

          {/* Audio TTS */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-lg transition-all ${
              isAudioPlaying
                ? 'bg-amber-500 text-white animate-pulse'
                : isDark
                ? 'hover:bg-stone-800 text-stone-300'
                : isSepia
                ? 'hover:bg-[#ebdfc6] text-[#5c4a34]'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
            title={isAudioPlaying ? 'Dừng đọc giọng nói' : 'Đọc to nội dung chương bằng giọng nói'}
            aria-label="Đọc to bằng giọng nói"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Exercises Journal */}
          <button
            onClick={onOpenJournal}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? 'hover:bg-stone-800 text-stone-300'
                : isSepia
                ? 'hover:bg-[#ebdfc6] text-[#5c4a34]'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
            title="Sổ tay bài tập thực hành kỷ luật (21 chương)"
            aria-label="Mở sổ tay bài tập"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? 'hover:bg-stone-800 text-stone-300'
                : isSepia
                ? 'hover:bg-[#ebdfc6] text-[#5c4a34]'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
            title="Tìm kiếm từ khóa trong sách (Ctrl + K)"
            aria-label="Tìm kiếm từ khóa"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bookmark */}
          <button
            onClick={onToggleBookmark}
            className={`p-2 rounded-lg transition-all ${
              isBookmarked
                ? 'text-amber-600 dark:text-amber-400'
                : isDark
                ? 'hover:bg-stone-800 text-stone-400'
                : isSepia
                ? 'hover:bg-[#ebdfc6] text-[#7a6448]'
                : 'hover:bg-stone-100 text-stone-400'
            }`}
            title={isBookmarked ? 'Bỏ đánh dấu chương này' : 'Đánh dấu chương này'}
            aria-label="Đánh dấu trang"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Mark as read */}
          <button
            onClick={onToggleRead}
            className={`p-2 rounded-lg transition-all ${
              isRead
                ? 'text-emerald-600 dark:text-emerald-400'
                : isDark
                ? 'hover:bg-stone-800 text-stone-400'
                : isSepia
                ? 'hover:bg-[#ebdfc6] text-[#7a6448]'
                : 'hover:bg-stone-100 text-stone-400'
            }`}
            title={isRead ? 'Đã đọc xong chương này' : 'Đánh dấu đã đọc chương này'}
            aria-label="Đánh dấu đã đọc"
          >
            <CheckCircle2 className={`w-4 h-4 ${isRead ? 'fill-emerald-100 dark:fill-emerald-950' : ''}`} />
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? 'hover:bg-stone-800 text-stone-300'
                : isSepia
                ? 'hover:bg-[#ebdfc6] text-[#5c4a34]'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
            title="Tùy chỉnh font chữ, cỡ chữ và giao diện đọc sách"
            aria-label="Tùy chỉnh giao diện"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
