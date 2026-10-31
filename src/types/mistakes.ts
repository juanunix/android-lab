export type MistakeCategory =
  | 'composition'
  | 'state'
  | 'lists'
  | 'performance'
  | 'lifecycle'
  | 'architecture'
  | 'layout'
  | 'animation'
  | 'accessibility';

export interface LocalizedText {
  es: string;
  pt: string;
  en: string;
}

export interface ComposeMistake {
  id: string;
  number: number;
  category: MistakeCategory;
  title: LocalizedText;
  why: LocalizedText;
  fix: LocalizedText;
  badCode: string;
  goodCode: string;
}

export interface LocalizedCategory {
  id: MistakeCategory;
  label: LocalizedText;
}
