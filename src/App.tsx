import { useState, useEffect, useMemo } from 'react';
import { useReaderSettings } from './hooks/useReaderSettings';
import {
  ALL_CHAPTERS,
  getChapterById,
  getPrevChapter,
  getNextChapter,
  getChapterIndex,
} from './data/bookIndex';
import { ReaderHeader } from './components/ReaderHeader';
import { ChapterView } from './components/ChapterView';
import { TableOfContentsModal } from './components/TableOfContentsModal';
import { SearchModal } from './components/SearchModal';
import { SettingsPanel } from './components/SettingsPanel';
import { ActionJournalModal } from './components/ActionJournalModal';
import { AudioReader } from './components/AudioReader';

export default function App() {
  const {
    settings,
    updateSetting,
    currentChapterId,
    setCurrentChapterId,
    progressMap,
    markChapterAsRead,
    toggleBookmark,
    answersMap,
    saveExerciseAnswer,
    toggleExerciseCompleted,
  } = useReaderSettings();

  // Modals state
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);

  // Sync theme class to documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-sepia');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'sepia') {
      root.classList.add('theme-sepia');
    }
  }, [settings.theme]);

  // Current chapter and adjacent chapters
  const currentChapter = useMemo(() => {
    return getChapterById(currentChapterId) || ALL_CHAPTERS[0];
  }, [currentChapterId]);

  const prevChapter = useMemo(() => {
    return getPrevChapter(currentChapter.id);
  }, [currentChapter.id]);

  const nextChapter = useMemo(() => {
    return getNextChapter(currentChapter.id);
  }, [currentChapter.id]);

  const currentChapterIndex = useMemo(() => {
    return getChapterIndex(currentChapter.id);
  }, [currentChapter.id]);

  // Overall book progress
  const readingProgressPercent = useMemo(() => {
    const total = ALL_CHAPTERS.length;
    const current = currentChapterIndex + 1;
    return Math.round((current / total) * 100);
  }, [currentChapterIndex]);

  const isCurrentBookmarked = !!progressMap[currentChapter.id]?.bookmarked;
  const isCurrentRead = !!progressMap[currentChapter.id]?.read;

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in textarea or input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsTocOpen(false);
        setIsSearchOpen(false);
        setIsSettingsOpen(false);
        setIsJournalOpen(false);
        setIsAudioOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`min-h-screen selection:bg-amber-300 selection:text-amber-950 font-sans transition-colors ${
        settings.theme === 'dark'
          ? 'bg-stone-950 text-stone-100'
          : settings.theme === 'sepia'
          ? 'bg-[#fbf0d9] text-[#342718]'
          : 'bg-[#fafaf9] text-stone-900'
      }`}
    >
      {/* Top Header */}
      <ReaderHeader
        currentChapter={currentChapter}
        settings={settings}
        isBookmarked={isCurrentBookmarked}
        isRead={isCurrentRead}
        isAudioPlaying={isAudioOpen}
        onOpenToc={() => setIsTocOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenJournal={() => setIsJournalOpen(true)}
        onToggleAudio={() => setIsAudioOpen((prev) => !prev)}
        onToggleBookmark={() => toggleBookmark(currentChapter.id)}
        onToggleRead={() => markChapterAsRead(currentChapter.id, !isCurrentRead)}
        onToggleBilingual={() => updateSetting('showBilingual', !settings.showBilingual)}
        totalChapters={ALL_CHAPTERS.length}
        currentChapterIndex={currentChapterIndex}
      />

      {/* Main Chapter Reading Area */}
      <main>
        <ChapterView
          chapter={currentChapter}
          settings={settings}
          prevChapter={prevChapter}
          nextChapter={nextChapter}
          onNavigateChapter={(id) => setCurrentChapterId(id)}
          isRead={isCurrentRead}
          onToggleRead={() => markChapterAsRead(currentChapter.id, !isCurrentRead)}
          isBookmarked={isCurrentBookmarked}
          onToggleBookmark={() => toggleBookmark(currentChapter.id)}
          answersMap={answersMap}
          onSaveExerciseAnswer={saveExerciseAnswer}
          onToggleExerciseCompleted={toggleExerciseCompleted}
          readingProgressPercent={readingProgressPercent}
        />
      </main>

      {/* Modals and Drawers */}
      <TableOfContentsModal
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        currentChapterId={currentChapter.id}
        onSelectChapter={(id) => setCurrentChapterId(id)}
        progressMap={progressMap}
        answersMap={answersMap}
        settings={settings}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectChapter={(id) => setCurrentChapterId(id)}
        settings={settings}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSetting={updateSetting}
      />

      <ActionJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        answersMap={answersMap}
        onSaveAnswer={saveExerciseAnswer}
        onToggleCompleted={toggleExerciseCompleted}
        onSelectChapter={(id) => setCurrentChapterId(id)}
        settings={settings}
      />

      {/* Voice Reader Floating Controller */}
      <AudioReader
        chapter={currentChapter}
        isOpen={isAudioOpen}
        onClose={() => setIsAudioOpen(false)}
        settings={settings}
      />
    </div>
  );
}
