import { useState, useMemo } from 'react';
import { Search as SearchIcon, X, ArrowRight, BookOpen } from 'lucide-react';
import { ALL_CHAPTERS } from '../data/bookIndex';
import { ReaderSettings } from '../types/settings';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapterId: string) => void;
  settings: ReaderSettings;
}

interface SearchResult {
  chapterId: string;
  chapterTitle: string;
  chapterNumber?: number;
  sectionTitle: string;
  snippet: string;
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectChapter,
  settings,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  const isSepia = settings.theme === 'sepia';
  const isDark = settings.theme === 'dark';

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    const matches: SearchResult[] = [];

    for (const ch of ALL_CHAPTERS) {
      // Check chapter title
      if (ch.titleVi.toLowerCase().includes(q) || ch.titleEn.toLowerCase().includes(q)) {
        matches.push({
          chapterId: ch.id,
          chapterTitle: ch.titleVi,
          chapterNumber: ch.chapterNumber,
          sectionTitle: 'Tiêu đề chương',
          snippet: ch.quote ? `${ch.quote} — ${ch.quoteAuthor}` : ch.titleVi,
        });
      }

      // Check sections
      for (const sec of ch.sections) {
        if (sec.titleVi.toLowerCase().includes(q)) {
          matches.push({
            chapterId: ch.id,
            chapterTitle: ch.titleVi,
            chapterNumber: ch.chapterNumber,
            sectionTitle: sec.titleVi,
            snippet: sec.contentVi[0] || sec.titleVi,
          });
          continue;
        }

        // Check content paragraphs
        for (const p of sec.contentVi) {
          const lowerP = p.toLowerCase();
          const matchIdx = lowerP.indexOf(q);
          if (matchIdx !== -1) {
            const start = Math.max(0, matchIdx - 40);
            const end = Math.min(p.length, matchIdx + q.length + 60);
            const snippet = (start > 0 ? '...' : '') + p.slice(start, end) + (end < p.length ? '...' : '');
            matches.push({
              chapterId: ch.id,
              chapterTitle: ch.titleVi,
              chapterNumber: ch.chapterNumber,
              sectionTitle: sec.titleVi,
              snippet,
            });
            break; // Max 1 match per section for concise display
          }
        }
      }
    }

    return matches.slice(0, 30);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl max-h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden border transition-colors ${
          isDark
            ? 'bg-stone-900 border-stone-800 text-stone-100'
            : isSepia
            ? 'bg-[#f7eedc] border-[#e5d3aa] text-[#3e3223]'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`p-4 border-b flex items-center gap-3 ${
            isDark ? 'border-stone-800 bg-stone-900' : isSepia ? 'border-[#e5d3aa] bg-[#f2e5cf]' : 'border-stone-100 bg-stone-50'
          }`}
        >
          <SearchIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Tìm kiếm từ khóa trong toàn bộ sách (ví dụ: mục tiêu, lãi kép, tha thứ, tập trung)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base outline-hidden placeholder:text-stone-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono opacity-50 hover:opacity-100"
            >
              Xóa
            </button>
          )}
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-stone-800' : isSepia ? 'hover:bg-[#e7d8bd]' : 'hover:bg-stone-200'
            }`}
            aria-label="Đóng tìm kiếm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {query.trim().length < 2 ? (
            <div className="text-center py-12 opacity-50 space-y-2">
              <SearchIcon className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-sm">Nhập ít nhất 2 ký tự để tìm kiếm nội dung trong toàn bộ sách</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Mục tiêu', 'Lãi kép', 'Tha thứ', 'Trách nhiệm', 'ABCDE', '40 giờ', 'Tự trọng'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full font-mono transition-colors ${
                      isDark ? 'bg-stone-800 hover:bg-stone-700' : isSepia ? 'bg-[#ede1c8] hover:bg-[#e2d3b5]' : 'bg-stone-100 hover:bg-stone-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 opacity-60">
              <p className="text-sm">Không tìm thấy kết quả nào cho &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-2">
                Tìm thấy {results.length} đoạn văn bản phù hợp:
              </p>
              {results.map((res, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectChapter(res.chapterId);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 group ${
                    isDark
                      ? 'border-stone-800 hover:bg-stone-800/60 hover:border-amber-700/60'
                      : isSepia
                      ? 'border-[#e8d7b3] hover:bg-[#efe3cb] hover:border-[#caa875]'
                      : 'border-stone-200 hover:bg-stone-50 hover:border-amber-300'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>{res.chapterNumber ? `Chương ${res.chapterNumber}: ` : ''}{res.chapterTitle}</span>
                      <span>•</span>
                      <span className="opacity-75">{res.sectionTitle}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-serif line-clamp-2 leading-relaxed opacity-90">
                      {res.snippet}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
