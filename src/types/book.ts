export interface Section {
  titleVi: string;
  titleEn?: string;
  contentVi: string[];
  contentEn?: string[];
}

export interface ActionExercise {
  id: number;
  questionVi: string;
  questionEn?: string;
}

export interface Chapter {
  id: string; // e.g., 'intro', 'ch1', 'ch2'
  chapterNumber?: number; // 1 to 21 (null for intro)
  partId: 'intro' | 'part1' | 'part2' | 'part3';
  partTitleVi: string;
  partTitleEn: string;
  titleVi: string;
  titleEn: string;
  quote?: string;
  quoteAuthor?: string;
  sections: Section[];
  actionExercises?: ActionExercise[];
  pageRange?: string;
}

export interface BookPart {
  id: 'intro' | 'part1' | 'part2' | 'part3';
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  chapterIds: string[];
}
