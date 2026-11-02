import {
  Database,
  FlaskConical,
  Layers,
  LayoutDashboard,
  Plug,
  Puzzle,
  Route,
  ShieldAlert,
  Smartphone,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { SkillId } from '../types/skills';

export interface SkillMeta {
  id: SkillId;
  name: string;
  category: string;
  icon: ComponentType<{ className?: string }>;
  title: Record<'es' | 'pt' | 'en', string>;
  summary: Record<'es' | 'pt' | 'en', string>;
}

export const SKILLS: SkillMeta[] = [
  {
    id: 'kmp-module-structure',
    name: 'kmp-module-structure',
    category: 'Architecture',
    icon: Layers,
    title: {
      es: 'Estructura de módulos KMP',
      pt: 'Estrutura de módulos KMP',
      en: 'KMP module structure',
    },
    summary: {
      es: 'Diseña módulos, reglas de dependencia, version catalogs y convention plugins de Gradle 9.',
      pt: 'Projete módulos, regras de dependência, version catalogs e convention plugins do Gradle 9.',
      en: 'Design modules, dependency rules, version catalogs, and Gradle 9 convention plugins.',
    },
  },
  {
    id: 'kmp-presentation-mvi',
    name: 'kmp-presentation-mvi',
    category: 'Presentation',
    icon: LayoutDashboard,
    title: {
      es: 'Presentación KMP con MVI',
      pt: 'Apresentação KMP com MVI',
      en: 'KMP presentation with MVI',
    },
    summary: {
      es: 'State, Action, Event, ViewModel, UiText y SavedStateHandle para pantallas compartidas.',
      pt: 'State, Action, Event, ViewModel, UiText e SavedStateHandle para telas compartilhadas.',
      en: 'State, Action, Event, ViewModel, UiText, and SavedStateHandle for shared screens.',
    },
  },
  {
    id: 'kmp-navigation',
    name: 'kmp-navigation',
    category: 'Presentation',
    icon: Route,
    title: {
      es: 'Navegación type-safe',
      pt: 'Navegação type-safe',
      en: 'Type-safe navigation',
    },
    summary: {
      es: 'Rutas serializables, feature nav graphs, argumentos y callbacks entre features.',
      pt: 'Rotas serializáveis, feature nav graphs, argumentos e callbacks entre features.',
      en: 'Serializable routes, feature nav graphs, arguments, and feature-to-feature callbacks.',
    },
  },
  {
    id: 'kmp-di-koin',
    name: 'kmp-di-koin',
    category: 'Architecture',
    icon: Plug,
    title: {
      es: 'Inyección de dependencias con Koin',
      pt: 'Injeção de dependências com Koin',
      en: 'Dependency injection with Koin',
    },
    summary: {
      es: 'Módulos por capa, scoping, plataforma y ensamblado de Koin en composeApp.',
      pt: 'Módulos por camada, scoping, plataforma e montagem do Koin no composeApp.',
      en: 'Per-layer modules, scoping, platform bindings, and Koin assembly in composeApp.',
    },
  },
  {
    id: 'kmp-data-layer',
    name: 'kmp-data-layer',
    category: 'Data',
    icon: Database,
    title: {
      es: 'Capa de datos KMP',
      pt: 'Camada de dados KMP',
      en: 'KMP data layer',
    },
    summary: {
      es: 'Data sources, repositories, DTOs, Ktor, Room y flujos offline-first.',
      pt: 'Data sources, repositories, DTOs, Ktor, Room e fluxos offline-first.',
      en: 'Data sources, repositories, DTOs, Ktor, Room, and offline-first flows.',
    },
  },
  {
    id: 'kmp-error-handling',
    name: 'kmp-error-handling',
    category: 'Data',
    icon: ShieldAlert,
    title: {
      es: 'Manejo de errores tipado',
      pt: 'Tratamento de erros tipado',
      en: 'Typed error handling',
    },
    summary: {
      es: 'Result, DataError, safeCall y mapeo de errores a UiText en Compose.',
      pt: 'Result, DataError, safeCall e mapeamento de erros para UiText no Compose.',
      en: 'Result, DataError, safeCall, and mapping errors to UiText in Compose.',
    },
  },
  {
    id: 'kmp-unit-testing',
    name: 'kmp-unit-testing',
    category: 'Testing',
    icon: FlaskConical,
    title: {
      es: 'Testing unitario de ViewModels',
      pt: 'Testes unitários de ViewModels',
      en: 'ViewModel unit testing',
    },
    summary: {
      es: 'Attack surface, fakes, Turbine, dispatchers y mutación para romper el código.',
      pt: 'Attack surface, fakes, Turbine, dispatchers e mutação para quebrar o código.',
      en: 'Attack surface, fakes, Turbine, dispatchers, and mutation testing to break the code.',
    },
  },
  {
    id: 'kmp-compose-architecture',
    name: 'kmp-compose-architecture',
    category: 'Compose',
    icon: Smartphone,
    title: {
      es: 'Arquitectura de pantallas Compose',
      pt: 'Arquitetura de telas Compose',
      en: 'Compose screen architecture',
    },
    summary: {
      es: 'Estabilidad, recomposición, propiedad del estado, side effects y TextField.',
      pt: 'Estabilidade, recomposição, propriedade do estado, side effects e TextField.',
      en: 'Stability, recomposition, state ownership, side effects, and TextField.',
    },
  },
  {
    id: 'kmp-compose-components',
    name: 'kmp-compose-components',
    category: 'Compose',
    icon: Puzzle,
    title: {
      es: 'Componentes Compose reutilizables',
      pt: 'Componentes Compose reutilizáveis',
      en: 'Reusable Compose components',
    },
    summary: {
      es: 'Parámetros, slots, modifiers, previews, accesibilidad y design system.',
      pt: 'Parâmetros, slots, modifiers, previews, acessibilidade e design system.',
      en: 'Parameters, slots, modifiers, previews, accessibility, and design system.',
    },
  },
];

export const getSkill = (id: string) => SKILLS.find((skill) => skill.id === id);
