export type EffectCategory = 'coroutines' | 'lifecycle' | 'state_conversion' | 'optimization';

export interface CodeSnippet {
  title: string;
  code: string;
  description: string;
}

export interface ParameterInfo {
  name: string;
  type: string;
  description: string;
  isRequired: boolean;
}

export interface SideEffectInfo {
  id: string;
  name: string;
  badge: string;
  category: EffectCategory;
  categoryLabel: string;
  summary: string;
  description: string;
  whenToUse: string[];
  commonPitfalls: string[];
  parameters: ParameterInfo[];
  lifecycleStage: string;
  kotlinSignature: string;
  snippets: CodeSnippet[];
}

export interface LogItem {
  id: string;
  timestamp: string;
  tag: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
}
