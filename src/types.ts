export type TypingResult = {
  timeline: { wpm: number; accuracy: number; raw: number; second: number }[];
  errors: number;
  testType: string | null;
  quoteAuthor?: string;
  date?: Date;
};
export type QuoteLengthType = 'short' | 'medium' | 'long' | 'all';
