export interface LangText {
  en: string;
  es: string;
}

export interface LessonSection {
  heading: LangText;
  paragraphs: LangText[];
  bullets?: LangText[][];
  keyIdea?: LangText;
  equation?: string;
  equationCaption?: LangText;
  mathExtra?: string;
  mathExtraCaption?: LangText;
}

export interface LessonQuizQ {
  q: LangText;
  options: LangText[];
  answer: number;
  why: LangText;
}

export interface LessonContent {
  intro: LangText;
  sections: LessonSection[];
  misconceptions: Array<{ myth: LangText; reality: LangText }>;
  quiz: LessonQuizQ[];
}
