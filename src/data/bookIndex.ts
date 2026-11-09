import { Chapter } from '../types/book';
import { INTRO_CHAPTER } from './chapters/intro';
import { PART1_CHAPTERS } from './chapters/part1';
import { PART2_CHAPTERS } from './chapters/part2';
import { PART3_CHAPTERS } from './chapters/part3';
import { BOOK_PARTS, BOOK_INFO } from './bookInfo';

export const ALL_CHAPTERS: Chapter[] = [
  INTRO_CHAPTER,
  ...PART1_CHAPTERS,
  ...PART2_CHAPTERS,
  ...PART3_CHAPTERS,
];

export { BOOK_PARTS, BOOK_INFO };

export function getChapterById(id: string): Chapter | undefined {
  return ALL_CHAPTERS.find((ch) => ch.id === id);
}

export function getChapterIndex(id: string): number {
  return ALL_CHAPTERS.findIndex((ch) => ch.id === id);
}

export function getPrevChapter(id: string): Chapter | null {
  const index = getChapterIndex(id);
  if (index > 0) {
    return ALL_CHAPTERS[index - 1];
  }
  return null;
}

export function getNextChapter(id: string): Chapter | null {
  const index = getChapterIndex(id);
  if (index >= 0 && index < ALL_CHAPTERS.length - 1) {
    return ALL_CHAPTERS[index + 1];
  }
  return null;
}

export function getChapterPart(partId: string) {
  return BOOK_PARTS.find((p) => p.id === partId);
}
