import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ChevronUp, Quote, Sparkles, BookMarked, FileText } from 'lucide-react';
import { Chapter } from '../types/book';
import { ReaderSettings, ExerciseAnswer } from '../types/settings';
import { BOOK_INFO } from '../data/bookIndex';

interface ChapterViewProps {
  chapter: Chapter;
  settings: ReaderSettings;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  onNavigateChapter: (id: string) => void;
  isRead: boolean;
  onToggleRead: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  answersMap: Record<string, ExerciseAnswer>;
  onSaveExerciseAnswer: (chapterId: string, exerciseId: number, answer: string, completed?: boolean) => void;
  onToggleExerciseCompleted: (chapterId: string, exerciseId: number) => void;
  readingProgressPercent: number;
}

export function ChapterView({
  chapter,
  settings,
  prevChapter,
  nextChapter,
  onNavigateChapter,
  isRead,
  onToggleRead,
  isBookmarked,
  onToggleBookmark,
  answersMap,
  onSaveExerciseAnswer,
  onToggleExerciseCompleted,
  readingProgressPercent,
}: ChapterViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [chapter.id]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSepia = settings.theme === 'sepia';
  const isDark = settings.theme === 'dark';

  // Font size classes
  const fontSizeClass =
    settings.fontSize === 'sm'
      ? 'text-[15px]'
      : settings.fontSize === 'base'
      ? 'text-[17px]'
      : settings.fontSize === 'lg'
      ? 'text-[19px]'
      : settings.fontSize === 'xl'
      ? 'text-[21px]'
      : 'text-[23px]';

  // Line height classes
  const lineHeightClass =
    settings.lineHeight === 'normal'
      ? 'leading-normal'
      : settings.lineHeight === 'relaxed'
      ? 'leading-relaxed'
      : 'leading-loose';

  // Font family class
  const fontFamilyClass = settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans';

  return (
    <div
      ref={containerRef}
      className={`min-h-[calc(100vh-3.5rem)] transition-colors duration-200 pb-24 ${
        isDark
          ? 'bg-stone-950 text-stone-200'
          : isSepia
          ? 'bg-[#fbf0d9] text-[#342718]'
          : 'bg-[#fafaf9] text-stone-900'
      }`}
    >
      {/* Reading Progress Top Line */}
      <div className="fixed top-14 left-0 right-0 h-1 bg-transparent z-20 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
          style={{ width: `${readingProgressPercent}%` }}
        />
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-12">
        {/* Chapter Header */}
        <header className="space-y-6 text-center border-b pb-10 border-stone-200/60 dark:border-stone-800">
          {/* Part Tag & Page Range */}
          <div className="flex items-center justify-center gap-3 text-xs font-mono tracking-wider uppercase opacity-70">
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              {chapter.partTitleVi}
            </span>
            {chapter.pageRange && (
              <>
                <span>•</span>
                <span>{chapter.pageRange}</span>
              </>
            )}
          </div>

          {/* Chapter Number Badge */}
          {chapter.chapterNumber ? (
            <div className="inline-block">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase ${
                  isDark
                    ? 'bg-stone-800 text-stone-300'
                    : isSepia
                    ? 'bg-[#ebdcb9] text-[#54402a]'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                Chương {chapter.chapterNumber}
              </span>
            </div>
          ) : (
            <div className="inline-block">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-600/10 text-amber-700 dark:text-amber-400">
                Lời Mở Đầu
              </span>
            </div>
          )}

          {/* Main Titles */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight text-balance leading-tight">
              {chapter.titleVi}
            </h1>
            <p className="text-sm sm:text-base opacity-60 font-sans italic tracking-wide">
              {chapter.titleEn}
            </p>
          </div>

          {/* Timeless Epigraph Quote */}
          {chapter.quote && (
            <div
              className={`max-w-xl mx-auto p-5 sm:p-6 rounded-2xl border text-center space-y-2 transition-all ${
                isDark
                  ? 'bg-stone-900/40 border-stone-800'
                  : isSepia
                  ? 'bg-[#f4e5c8]/60 border-[#e3d1ac]'
                  : 'bg-white border-stone-200/80 shadow-xs'
              }`}
            >
              <Quote className="w-5 h-5 mx-auto opacity-30 text-amber-600 dark:text-amber-400" />
              <p className="font-serif italic text-base sm:text-lg leading-relaxed text-balance opacity-95">
                {chapter.quote}
              </p>
              {chapter.quoteAuthor && (
                <p className="text-xs font-mono font-semibold tracking-wider uppercase opacity-60">
                  — {chapter.quoteAuthor}
                </p>
              )}
            </div>
          )}

          {/* Quick chapter status toggles */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onToggleBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-colors border ${
                isBookmarked
                  ? 'bg-amber-600/10 border-amber-600/30 text-amber-700 dark:text-amber-400 font-bold'
                  : 'border-stone-200/60 dark:border-stone-800 opacity-70 hover:opacity-100'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'Đã đánh dấu chương' : 'Đánh dấu chương này'}</span>
            </button>

            <button
              onClick={onToggleRead}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-colors border ${
                isRead
                  ? 'bg-emerald-600/10 border-emerald-600/30 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'border-stone-200/60 dark:border-stone-800 opacity-70 hover:opacity-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isRead ? 'Đã đọc hoàn thành' : 'Đánh dấu đã đọc xong'}</span>
            </button>
          </div>
        </header>

        {/* Chapter Sections */}
        <div className="space-y-12">
          {chapter.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-5">
              {/* Section Subheading */}
              <div className="pt-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-amber-900 dark:text-amber-200">
                  {section.titleVi}
                </h2>
                {section.titleEn && (
                  <p className="text-xs opacity-50 font-sans italic mt-0.5">{section.titleEn}</p>
                )}
              </div>

              {/* Section Paragraphs */}
              <div className={`space-y-4 ${fontFamilyClass} ${fontSizeClass} ${lineHeightClass}`}>
                {section.contentVi.map((paragraph, pIdx) => {
                  const enParagraph = section.contentEn?.[pIdx];
                  return (
                    <div key={pIdx} className="space-y-2">
                      {/* Vietnamese Paragraph */}
                      <p className="text-justify sm:text-left text-balance opacity-95">
                        {paragraph}
                      </p>

                      {/* Bilingual English Cross-reference */}
                      {settings.showBilingual && enParagraph && (
                        <div
                          className={`pl-3 border-l-2 py-1 text-[85%] font-sans italic opacity-70 transition-colors ${
                            isDark
                              ? 'border-amber-700/60 text-stone-300'
                              : isSepia
                              ? 'border-[#caa875] text-[#5e4933]'
                              : 'border-amber-300 text-stone-600'
                          }`}
                        >
                          <span className="font-mono text-[10px] uppercase font-bold tracking-wider opacity-60 block not-italic">
                            Bản tiếng Anh gốc:
                          </span>
                          {enParagraph}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Action Exercises (Bài Tập Thực Hành) */}
        {chapter.actionExercises && chapter.actionExercises.length > 0 && (
          <section
            className={`mt-16 p-6 sm:p-8 rounded-2xl border transition-all ${
              isDark
                ? 'bg-stone-900/60 border-stone-800'
                : isSepia
                ? 'bg-[#f5e7ce] border-[#dfcaa1]'
                : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg sm:text-xl font-serif font-bold">
                Bài Tập Hành Động Kỷ Luật Bản Thân
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-sans opacity-70 mb-6">
              Brian Tracy: &quot;Kiến thức chỉ có giá trị khi được chuyển hóa thành hành động cụ thể.&quot; Hãy trả lời 7 câu hỏi dưới đây để biến nguyên lý này thành thói quen thực tế.
            </p>

            <div className="space-y-5">
              {chapter.actionExercises.map((exercise) => {
                const key = `${chapter.id}_${exercise.id}`;
                const currentAnswer = answersMap[key]?.answer || '';
                const isCompleted = !!answersMap[key]?.completed;

                return (
                  <div
                    key={exercise.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? isDark
                          ? 'bg-emerald-950/25 border-emerald-800/40'
                          : isSepia
                          ? 'bg-[#ebf4e3] border-[#b0cda0]'
                          : 'bg-emerald-50 border-emerald-200'
                        : isDark
                        ? 'bg-stone-800/50 border-stone-700/60'
                        : isSepia
                        ? 'bg-[#fbf1dc] border-[#e2d1ab]'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleExerciseCompleted(chapter.id, exercise.id)}
                        className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
                        title={isCompleted ? 'Đánh dấu chưa làm' : 'Đánh dấu đã hoàn thành'}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="space-y-2 flex-1">
                        <p
                          className={`text-sm sm:text-base font-medium leading-relaxed ${
                            isCompleted ? 'line-through opacity-70' : ''
                          }`}
                        >
                          <span className="font-mono font-bold mr-1.5 text-amber-700 dark:text-amber-400">
                            {exercise.id}.
                          </span>
                          {exercise.questionVi}
                        </p>

                        {exercise.questionEn && settings.showBilingual && (
                          <p className="text-xs font-sans italic opacity-60">
                            {exercise.questionEn}
                          </p>
                        )}

                        <textarea
                          rows={2}
                          placeholder="Nhập câu trả lời hoặc kế hoạch hành động của bạn tại đây (sẽ tự động lưu)..."
                          value={currentAnswer}
                          onChange={(e) =>
                            onSaveExerciseAnswer(chapter.id, exercise.id, e.target.value, isCompleted)
                          }
                          className={`w-full p-3 rounded-lg text-xs sm:text-sm font-sans outline-hidden resize-y transition-colors ${
                            isDark
                              ? 'bg-stone-900 border border-stone-700/80 focus:border-amber-500 text-stone-100 placeholder:text-stone-500'
                              : isSepia
                              ? 'bg-[#fffaf0] border border-[#d6bf91] focus:border-amber-700 text-[#3e3223] placeholder:text-[#8d7c66]'
                              : 'bg-white border border-stone-300 focus:border-amber-600 text-stone-900 placeholder:text-stone-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom Navigation */}
        <nav className="pt-8 border-t border-stone-200/60 dark:border-stone-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevChapter ? (
              <button
                onClick={() => onNavigateChapter(prevChapter.id)}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all group ${
                  isDark
                    ? 'border-stone-800 hover:bg-stone-900 hover:border-amber-600/50'
                    : isSepia
                    ? 'border-[#e0ceaa] hover:bg-[#f2e2c2] hover:border-[#caa875]'
                    : 'border-stone-200 hover:bg-stone-50 hover:border-amber-300'
                }`}
              >
                <ArrowLeft className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-mono uppercase tracking-wider opacity-60 block">
                    Chương trước
                  </span>
                  <span className="text-sm font-serif font-bold truncate block group-hover:text-amber-700 dark:group-hover:text-amber-300">
                    {prevChapter.chapterNumber ? `Chương ${prevChapter.chapterNumber}: ` : ''}
                    {prevChapter.titleVi}
                  </span>
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <button
                onClick={() => onNavigateChapter(nextChapter.id)}
                className={`p-4 rounded-xl border text-right flex items-center justify-end gap-3 transition-all group ${
                  isDark
                    ? 'border-stone-800 hover:bg-stone-900 hover:border-amber-600/50'
                    : isSepia
                    ? 'border-[#e0ceaa] hover:bg-[#f2e2c2] hover:border-[#caa875]'
                    : 'border-stone-200 hover:bg-stone-50 hover:border-amber-300'
                }`}
              >
                <div className="min-w-0">
                  <span className="text-xs font-mono uppercase tracking-wider opacity-60 block">
                    Chương kế tiếp
                  </span>
                  <span className="text-sm font-serif font-bold truncate block group-hover:text-amber-700 dark:group-hover:text-amber-300">
                    {nextChapter.chapterNumber ? `Chương ${nextChapter.chapterNumber}: ` : ''}
                    {nextChapter.titleVi}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-amber-600/40 text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs font-mono font-bold uppercase">Bạn đã đọc hết 21 chương!</span>
                <span className="text-xs opacity-60">Chúc mừng bạn đã hoàn thành cuốn sách kinh điển này.</span>
              </div>
            )}
          </div>

          {/* Scroll to Top and PDF link */}
          <div className="flex items-center justify-between text-xs opacity-60 pt-4">
            <a
              href={BOOK_INFO.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline font-mono"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Xem tệp PDF sách gốc</span>
            </a>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:opacity-100 transition-opacity font-mono"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Lên đầu trang</span>
            </button>
          </div>
        </nav>
      </article>
    </div>
  );
}
