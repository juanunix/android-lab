import type { ComponentType } from 'react';
import type { SkillId } from '../../types/skills';
import { ModuleStructureSection } from './kmp-module-structure/ModuleStructureSection';
import { PresentationMviSection } from './kmp-presentation-mvi/PresentationMviSection';
import { NavigationSection } from './kmp-navigation/NavigationSection';
import { DiKoinSection } from './kmp-di-koin/DiKoinSection';
import { DataLayerSection } from './kmp-data-layer/DataLayerSection';
import { ErrorHandlingSection } from './kmp-error-handling/ErrorHandlingSection';
import { UnitTestingSection } from './kmp-unit-testing/UnitTestingSection';
import { ComposeArchitectureSection } from './kmp-compose-architecture/ComposeArchitectureSection';
import { ComposeComponentsSection } from './kmp-compose-components/ComposeComponentsSection';

export const SKILL_COMPONENTS: Partial<Record<SkillId, ComponentType>> = {
  'kmp-module-structure': ModuleStructureSection,
  'kmp-presentation-mvi': PresentationMviSection,
  'kmp-navigation': NavigationSection,
  'kmp-di-koin': DiKoinSection,
  'kmp-data-layer': DataLayerSection,
  'kmp-error-handling': ErrorHandlingSection,
  'kmp-unit-testing': UnitTestingSection,
  'kmp-compose-architecture': ComposeArchitectureSection,
  'kmp-compose-components': ComposeComponentsSection,
};
