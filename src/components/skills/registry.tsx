import type { ComponentType } from 'react';
import type { SkillId } from '../../types/skills';
import { ModuleStructureSection } from './kmp-module-structure/ModuleStructureSection';

export const SKILL_COMPONENTS: Partial<Record<SkillId, ComponentType>> = {
  'kmp-module-structure': ModuleStructureSection,
};
