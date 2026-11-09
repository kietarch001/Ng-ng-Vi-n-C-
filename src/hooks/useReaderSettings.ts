import { useState, useEffect } from 'react';
import { ReaderSettings, ExerciseAnswer, ChapterProgress } from '../types/settings';

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'sepia',
  fontSize: 'lg',
  fontFamily: 'serif',
  lineHeight: 'relaxed',
  showBilingual: false,
  autoScroll: false,
};

const SETTINGS_KEY = 'no_excuses_reader_settings';
const PROGRESS_KEY = 'no_excuses_reader_progress';
const ANSWERS_KEY = 'no_excuses_exercise_answers';
const LAST_CHAPTER_KEY = 'no_excuses_last_chapter';

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [currentChapterId, setCurrentChapterId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LAST_CHAPTER_KEY);
      return saved || 'intro';
    } catch {
      return 'intro';
    }
  });

  const [progressMap, setProgressMap] = useState<Record<string, ChapterProgress>>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [answersMap, setAnswersMap] = useState<Record<string, ExerciseAnswer>>(() => {
    try {
      const saved = localStorage.getItem(ANSWERS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  // Save current chapter
  useEffect(() => {
    try {
      localStorage.setItem(LAST_CHAPTER_KEY, currentChapterId);
    } catch (e) {
      console.warn('Failed to save chapter:', e);
    }
  }, [currentChapterId]);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressMap));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }, [progressMap]);

  // Save answers
  useEffect(() => {
    try {
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(answersMap));
    } catch (e) {
      console.warn('Failed to save answers:', e);
    }
  }, [answersMap]);

  const updateSetting = <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const markChapterAsRead = (chapterId: string, read = true) => {
    setProgressMap((prev) => ({
      ...prev,
      [chapterId]: {
        chapterId,
        read,
        bookmarked: prev[chapterId]?.bookmarked || false,
        scrollPercentage: prev[chapterId]?.scrollPercentage || 100,
        lastReadDate: new Date().toISOString(),
      },
    }));
  };

  const toggleBookmark = (chapterId: string) => {
    setProgressMap((prev) => {
      const current = prev[chapterId];
      return {
        ...prev,
        [chapterId]: {
          chapterId,
          read: current?.read || false,
          bookmarked: !current?.bookmarked,
          scrollPercentage: current?.scrollPercentage || 0,
          lastReadDate: new Date().toISOString(),
        },
      };
    });
  };

  const saveExerciseAnswer = (chapterId: string, exerciseId: number, answer: string, completed = false) => {
    const key = `${chapterId}_${exerciseId}`;
    setAnswersMap((prev) => ({
      ...prev,
      [key]: {
        chapterId,
        exerciseId,
        answer,
        completed,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const toggleExerciseCompleted = (chapterId: string, exerciseId: number) => {
    const key = `${chapterId}_${exerciseId}`;
    setAnswersMap((prev) => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: {
          chapterId,
          exerciseId,
          answer: existing?.answer || '',
          completed: !existing?.completed,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  return {
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
  };
}
