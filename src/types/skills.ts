import type { ComponentType } from 'react';

export type SkillId =
  | 'kmp-module-structure'
  | 'kmp-presentation-mvi'
  | 'kmp-navigation'
  | 'kmp-di-koin'
  | 'kmp-data-layer'
  | 'kmp-error-handling'
  | 'kmp-unit-testing'
  | 'kmp-compose-architecture'
  | 'kmp-compose-components';

export interface LocalizedText {
  es: string;
  pt: string;
  en: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  category: string;
  icon: ComponentType<{ className?: string }>;
  title: Record<string, string>;
  summary: Record<string, string>;
}
