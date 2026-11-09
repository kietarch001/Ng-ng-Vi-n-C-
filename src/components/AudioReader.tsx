import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, X } from 'lucide-react';
import { Chapter } from '../types/book';
import { ReaderSettings } from '../types/settings';

interface AudioReaderProps {
  chapter: Chapter;
  isOpen: boolean;
  onClose: () => void;
  onParagraphChange?: (index: number) => void;
  settings: ReaderSettings;
}

export function AudioReader({
  chapter,
  isOpen,
  onClose,
  onParagraphChange,
  settings,
}: AudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [voiceAvailable, setVoiceAvailable] = useState(true);

  // Flatten paragraphs for audio reading
  const paragraphs = useRef<string[]>([]);

  useEffect(() => {
    const list: string[] = [];
    list.push(`${chapter.titleVi}. Trích dẫn: ${chapter.quote || ''}`);
    chapter.sections.forEach((sec) => {
      list.push(`Mục: ${sec.titleVi}`);
      sec.contentVi.forEach((p) => list.push(p));
    });
    if (chapter.actionExercises && chapter.actionExercises.length > 0) {
      list.push('Bài tập thực hành kỷ luật bản thân:');
      chapter.actionExercises.forEach((ex) => {
        list.push(`Bài tập ${ex.id}: ${ex.questionVi}`);
      });
    }
    paragraphs.current = list;
    setCurrentIdx(0);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [chapter]);

  const speakCurrent = useCallback(
    (index: number) => {
      if (!('speechSynthesis' in window)) {
        setVoiceAvailable(false);
        return;
      }

      window.speechSynthesis.cancel();

      if (index >= paragraphs.current.length) {
        setIsPlaying(false);
        setCurrentIdx(0);
        return;
      }

      const text = paragraphs.current[index];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;

      // Select Vietnamese voice if available
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.startsWith('vi'));
      if (viVoice) {
        utterance.voice = viVoice;
      }
      utterance.lang = viVoice?.lang || 'vi-VN';

      utterance.onend = () => {
        const next = index + 1;
        if (next < paragraphs.current.length) {
          setCurrentIdx(next);
          if (onParagraphChange) onParagraphChange(next);
          speakCurrent(next);
        } else {
          setIsPlaying(false);
          setCurrentIdx(0);
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    },
    [playbackRate, onParagraphChange]
  );

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speakCurrent(currentIdx);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentIdx(0);
  };

  const handleNext = () => {
    const next = Math.min(paragraphs.current.length - 1, currentIdx + 1);
    setCurrentIdx(next);
    if (isPlaying) {
      speakCurrent(next);
    }
  };

  const handlePrev = () => {
    const prev = Math.max(0, currentIdx - 1);
    setCurrentIdx(prev);
    if (isPlaying) {
      speakCurrent(prev);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const isSepia = settings.theme === 'sepia';
  const isDark = settings.theme === 'dark';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg shadow-2xl rounded-2xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-4">
      <div
        className={`p-4 rounded-2xl ${
          isDark
            ? 'bg-stone-900/95 border-stone-800 text-stone-100'
            : isSepia
            ? 'bg-[#f7eedc]/95 border-[#e5d3aa] text-[#3e3223]'
            : 'bg-white/95 border-stone-200 text-stone-900'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-stone-200/40 dark:border-stone-800 text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="font-semibold truncate max-w-[240px]">
              Đang đọc: {chapter.titleVi}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] opacity-70">
              {currentIdx + 1} / {paragraphs.current.length}
            </span>
            <button
              onClick={() => {
                handleStop();
                onClose();
              }}
              className="p-1 rounded-md opacity-60 hover:opacity-100"
              aria-label="Đóng thanh đọc sách"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current reading preview */}
        <p className="text-xs sm:text-sm font-serif line-clamp-1 py-2 opacity-80 italic">
          &quot;{paragraphs.current[currentIdx] || ''}&quot;
        </p>

        {/* Audio controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-2 rounded-lg opacity-80 hover:opacity-100 disabled:opacity-30"
              title="Đoạn trước"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-transform active:scale-95"
              title={isPlaying ? 'Tạm dừng đọc' : 'Tiếp tục phát'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              disabled={currentIdx >= paragraphs.current.length - 1}
              className="p-2 rounded-lg opacity-80 hover:opacity-100 disabled:opacity-30"
              title="Đoạn tiếp theo"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleStop}
              className="p-2 rounded-lg opacity-70 hover:opacity-100"
              title="Dừng hẳn"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono opacity-60 mr-1">Tốc độ:</span>
            {[0.85, 1.0, 1.25].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  playbackRate === rate
                    ? 'bg-amber-600 text-white font-bold'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {!voiceAvailable && (
          <p className="text-[11px] text-amber-600 mt-2 text-center">
            Trình duyệt của bạn hiện chưa cài đặt giọng nói tiếng Việt tiêu chuẩn; hệ thống sẽ sử dụng giọng đọc tổng hợp mặc định.
          </p>
        )}
      </div>
    </div>
  );
}
