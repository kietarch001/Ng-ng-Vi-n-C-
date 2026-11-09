export type ReadingTheme = 'light' | 'sepia' | 'dark';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type FontFamily = 'serif' | 'sans';
export type LineHeight = 'normal' | 'relaxed' | 'loose';

export interface ReaderSettings {
  theme: ReadingTheme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  showBilingual: boolean;
  autoScroll: boolean;
}

export interface ChapterProgress {
  chapterId: string;
  read: boolean;
  bookmarked: boolean;
  scrollPercentage: number;
  lastReadDate?: string;
}

export interface ExerciseAnswer {
  chapterId: string;
  exerciseId: number;
  answer: string;
  completed: boolean;
  updatedAt: string;
}
