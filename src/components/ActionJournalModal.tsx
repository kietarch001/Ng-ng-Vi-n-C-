import { useState, useMemo } from 'react';
import { X, CheckCircle2, Circle, BookOpen, PenTool, Copy, Check, Download } from 'lucide-react';
import { ALL_CHAPTERS } from '../data/bookIndex';
import { ExerciseAnswer, ReaderSettings } from '../types/settings';

interface ActionJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  answersMap: Record<string, ExerciseAnswer>;
  onSaveAnswer: (chapterId: string, exerciseId: number, answer: string, completed?: boolean) => void;
  onToggleCompleted: (chapterId: string, exerciseId: number) => void;
  onSelectChapter: (chapterId: string) => void;
  settings: ReaderSettings;
}

export function ActionJournalModal({
  isOpen,
  onClose,
  answersMap,
  onSaveAnswer,
  onToggleCompleted,
  onSelectChapter,
  settings,
}: ActionJournalModalProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const isSepia = settings.theme === 'sepia';
  const isDark = settings.theme === 'dark';

  const chaptersWithExercises = useMemo(
    () => ALL_CHAPTERS.filter((ch) => ch.actionExercises && ch.actionExercises.length > 0),
    []
  );

  const totalExercises = useMemo(() => {
    return chaptersWithExercises.reduce((sum, ch) => sum + (ch.actionExercises?.length || 0), 0);
  }, [chaptersWithExercises]);

  const completedCount = useMemo(() => {
    return Object.values(answersMap).filter((a) => a.completed).length;
  }, [answersMap]);

  const displayedChapters = useMemo(() => {
    if (selectedChapterId === 'all') return chaptersWithExercises;
    return chaptersWithExercises.filter((ch) => ch.id === selectedChapterId);
  }, [selectedChapterId, chaptersWithExercises]);

  const handleExportText = () => {
    let output = `# SỔ TAY KỶ LUẬT BẢN THÂN - NO EXCUSES (BRIAN TRACY)\n\n`;
    output += `Đã hoàn thành: ${completedCount}/${totalExercises} bài tập (${Math.round(
      (completedCount / totalExercises) * 100
    )}%)\n`;
    output += `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}\n\n`;

    for (const ch of chaptersWithExercises) {
      output += `## ${ch.chapterNumber ? `Chương ${ch.chapterNumber}: ` : ''}${ch.titleVi}\n\n`;
      ch.actionExercises?.forEach((ex) => {
        const key = `${ch.id}_${ex.id}`;
        const item = answersMap[key];
        const status = item?.completed ? '[x]' : '[ ]';
        output += `${status} Bài tập ${ex.id}: ${ex.questionVi}\n`;
        if (item?.answer) {
          output += `   Trả lời: ${item.answer}\n`;
        }
        output += `\n`;
      });
      output += `\n---\n\n`;
    }

    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadText = () => {
    let output = `SỔ TAY KỶ LUẬT BẢN THÂN - NO EXCUSES (BRIAN TRACY)\n\n`;
    output += `Đã hoàn thành: ${completedCount}/${totalExercises} bài tập\n`;
    output += `Ngày: ${new Date().toLocaleDateString('vi-VN')}\n\n`;

    for (const ch of chaptersWithExercises) {
      output += `=========================================\n`;
      output += `${ch.chapterNumber ? `Chương ${ch.chapterNumber}: ` : ''}${ch.titleVi}\n`;
      output += `=========================================\n\n`;
      ch.actionExercises?.forEach((ex) => {
        const key = `${ch.id}_${ex.id}`;
        const item = answersMap[key];
        const status = item?.completed ? '[ĐÃ HOÀN THÀNH]' : '[CHƯA HOÀN THÀNH]';
        output += `${ex.id}. ${ex.questionVi} ${status}\n`;
        if (item?.answer) {
          output += `   Ghi chú cá nhân: ${item.answer}\n`;
        }
        output += `\n`;
      });
      output += `\n`;
    }

    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `So_Tay_Ky_Luat_Brian_Tracy_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full sm:max-w-3xl h-full sm:h-[90vh] sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border transition-colors ${
          isDark
            ? 'bg-stone-900 border-stone-800 text-stone-100'
            : isSepia
            ? 'bg-[#f7eedc] border-[#e5d3aa] text-[#3e3223]'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
            isDark ? 'border-stone-800 bg-stone-900' : isSepia ? 'border-[#e5d3aa] bg-[#f2e5cf]' : 'border-stone-100 bg-stone-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold">
                Sổ Tay Bài Tập Kỷ Luật Thực Hành
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                Đã hoàn thành <strong className="text-emerald-600 font-mono">{completedCount}</strong> / {totalExercises} bài tập
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportText}
              className={`p-2 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
                isDark ? 'hover:bg-stone-800 text-stone-300' : isSepia ? 'hover:bg-[#e7d8bd] text-[#5c4a34]' : 'hover:bg-stone-100 text-stone-700'
              }`}
              title="Sao chép toàn bộ bài tập và câu trả lời vào clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={handleDownloadText}
              className={`p-2 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
                isDark ? 'hover:bg-stone-800 text-stone-300' : isSepia ? 'hover:bg-[#e7d8bd] text-[#5c4a34]' : 'hover:bg-stone-100 text-stone-700'
              }`}
              title="Tải sổ tay bài tập về máy dưới dạng tệp văn bản .txt"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Tải về (.txt)</span>
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-stone-800 text-stone-400' : isSepia ? 'hover:bg-[#e7d8bd] text-[#5c4a34]' : 'hover:bg-stone-100 text-stone-500'
              }`}
              aria-label="Đóng sổ tay"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          className={`p-3 border-b flex items-center gap-2 overflow-x-auto ${
            isDark ? 'border-stone-800 bg-stone-950/40' : isSepia ? 'border-[#e5d3aa] bg-[#ece0c9]/40' : 'border-stone-100 bg-stone-50/60'
          }`}
        >
          <span className="text-xs font-mono uppercase tracking-wider opacity-60 shrink-0 ml-1">Lọc:</span>
          <button
            onClick={() => setSelectedChapterId('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedChapterId === 'all'
                ? 'bg-amber-600 text-white'
                : isDark
                ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                : isSepia
                ? 'bg-[#e5d5b7] text-[#423422] hover:bg-[#d8c5a2]'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            Tất cả ({totalExercises})
          </button>
          {chaptersWithExercises.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapterId(ch.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedChapterId === ch.id
                  ? 'bg-amber-600 text-white'
                  : isDark
                  ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  : isSepia
                  ? 'bg-[#e5d5b7] text-[#423422] hover:bg-[#d8c5a2]'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {ch.chapterNumber ? `Chương ${ch.chapterNumber}` : 'Mở Đầu'}
            </button>
          ))}
        </div>

        {/* Exercises Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          {displayedChapters.map((ch) => (
            <div key={ch.id} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/50 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-600/10 text-amber-700 dark:text-amber-400">
                    {ch.chapterNumber ? `Chương ${ch.chapterNumber}` : 'Mở Đầu'}
                  </span>
                  <h3 className="font-serif font-bold text-base">{ch.titleVi}</h3>
                </div>
                <button
                  onClick={() => {
                    onSelectChapter(ch.id);
                    onClose();
                  }}
                  className="text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-sans"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Đọc chương này
                </button>
              </div>

              <div className="space-y-4 pl-1 sm:pl-3">
                {ch.actionExercises?.map((ex) => {
                  const key = `${ch.id}_${ex.id}`;
                  const currentAnswer = answersMap[key]?.answer || '';
                  const isCompleted = !!answersMap[key]?.completed;

                  return (
                    <div
                      key={ex.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCompleted
                          ? isDark
                            ? 'bg-emerald-950/20 border-emerald-800/40'
                            : isSepia
                            ? 'bg-[#ebf2e4] border-[#b8d1a6]'
                            : 'bg-emerald-50/60 border-emerald-200'
                          : isDark
                          ? 'bg-stone-800/40 border-stone-800'
                          : isSepia
                          ? 'bg-[#f4e8d0] border-[#e2d0ab]'
                          : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => onToggleCompleted(ch.id, ex.id)}
                          className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
                          title={isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div className="space-y-2 flex-1">
                          <p
                            className={`text-sm font-medium leading-relaxed ${
                              isCompleted ? 'line-through opacity-70' : ''
                            }`}
                          >
                            <span className="font-mono mr-1.5 font-bold">#{ex.id}.</span>
                            {ex.questionVi}
                          </p>

                          {/* Editable notes area */}
                          <textarea
                            rows={2}
                            placeholder="Ghi chú kế hoạch hành động hoặc câu trả lời của bạn tại đây (tự động lưu)..."
                            value={currentAnswer}
                            onChange={(e) => onSaveAnswer(ch.id, ex.id, e.target.value, isCompleted)}
                            className={`w-full p-2.5 rounded-lg text-xs sm:text-sm font-sans outline-hidden resize-y transition-colors ${
                              isDark
                                ? 'bg-stone-900/80 border border-stone-700/60 focus:border-amber-500 text-stone-200'
                                : isSepia
                                ? 'bg-[#fffaf0] border border-[#d9c49a] focus:border-amber-700 text-[#3e3223]'
                                : 'bg-white border border-stone-300 focus:border-amber-600 text-stone-900'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
