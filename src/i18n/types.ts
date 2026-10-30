export type Language = 'es' | 'pt' | 'en';

export interface ParameterTranslation {
  name: string;
  type: string;
  description: string;
}

export interface SnippetTranslation {
  title: string;
  description: string;
  code: string;
}

export interface SideEffectTranslation {
  id: string;
  name: string;
  badge: string;
  categoryLabel: string;
  summary: string;
  description: string;
  lifecycleStage: string;
  kotlinSignature: string;
  parameters: ParameterTranslation[];
  whenToUse: string[];
  commonPitfalls: string[];
  snippets: SnippetTranslation[];
}

export interface Translations {
  nav: {
    effects: string;
    lifecycle: string;
    matrix: string;
    pitfalls: string;
    whichToUse: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    exploreBtn: string;
    whichToUseBtn: string;
  };
  catalog: {
    title: string;
    subtitle: string;
    categories: {
      all: string;
      coroutines: string;
      lifecycle: string;
      state_conversion: string;
      optimization: string;
    };
  };
  simulator: {
    title: string;
    recompositions: string;
    runtime: string;
    parametersTitle: string;
    codeTitle: string;
    exampleLabel: string;
    whenToUseTitle: string;
    pitfallsTitle: string;
  };
  logcat: {
    title: string;
    eventsCount: string;
    emptyWaiting: string;
    emptyHint: string;
    clearTooltip: string;
  };
  matrix: {
    kicker: string;
    title: string;
    subtitle: string;
    colEffect: string;
    colCoroutines: string;
    colCleanup: string;
    colTrigger: string;
    colPurpose: string;
    colAction: string;
    viewInLab: string;
    yesSuspend: string;
    noSync: string;
    automaticOrNA: string;
  };
  lifecycle: {
    kicker: string;
    title: string;
    subtitle: string;
    initialPhase: string;
    initialDesc: string;
    recompPhase: string;
    recompDesc: string;
    leavingPhase: string;
    leavingDesc: string;
    phasePrefix: string;
    activeHandlers: string;
    viewDemoAndCode: string;
  };
  pitfallsSection: {
    kicker: string;
    title: string;
    subtitle: string;
    rules: {
      rule1Title: string;
      rule1Desc: string;
      rule2Title: string;
      rule2Desc: string;
      rule3Title: string;
      rule3Desc: string;
      rule4Title: string;
      rule4Desc: string;
    };
  };
  decisionModal: {
    title: string;
    stepOf: string;
    q1Title: string;
    q1Opt1Title: string;
    q1Opt1Desc: string;
    q1Opt2Title: string;
    q1Opt2Desc: string;
    q1Opt3Title: string;
    q1Opt3Desc: string;
    q2CoroutinesTitle: string;
    q2CoroutinesOpt1Title: string;
    q2CoroutinesOpt1Desc: string;
    q2CoroutinesOpt2Title: string;
    q2CoroutinesOpt2Desc: string;
    q2LifecycleTitle: string;
    q2LifecycleOpt1Title: string;
    q2LifecycleOpt1Desc: string;
    q2LifecycleOpt2Title: string;
    q2LifecycleOpt2Desc: string;
    q2StateTitle: string;
    q2StateOpt1Title: string;
    q2StateOpt1Desc: string;
    q2StateOpt2Title: string;
    q2StateOpt2Desc: string;
    q2StateOpt3Title: string;
    q2StateOpt3Desc: string;
    q2StateOpt4Title: string;
    q2StateOpt4Desc: string;
    recommendedTag: string;
    exploreBtn: string;
    restartBtn: string;
    backBtn: string;
    footerNote: string;
  };
  footer: {
    copy: string;
    assistantLink: string;
    diagramLink: string;
  };
}
