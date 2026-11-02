import type { ComponentType } from 'react';
import type { SkillId } from '../../types/skills';
import { ModuleStructureSection } from './kmp-module-structure/ModuleStructureSection';
import { ComposeArchitectureSection } from './kmp-compose-architecture/ComposeArchitectureSection';
import { ComposeComponentsSection } from './kmp-compose-components/ComposeComponentsSection';

export const SKILL_COMPONENTS: Partial<Record<SkillId, ComponentType>> = {
  'kmp-module-structure': ModuleStructureSection,
  'kmp-compose-architecture': ComposeArchitectureSection,
  'kmp-compose-components': ComposeComponentsSection,
};
