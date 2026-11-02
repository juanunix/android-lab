import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  LayoutGrid,
  Palette,
  Puzzle,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { CodeViewer } from '../../CodeViewer';
import {
  Callout,
  Checklist,
  CodeCompare,
  ConceptCard,
  Quiz,
  SimulatorFrame,
  SkillSection,
} from '../shared/primitives';

interface PreviewOption {
  key: string;
  label: string;
  previewName: string;
}

interface M3Option {
  key: string;
  label: string;
  base: string;
  why: string;
  code: string;
}

export const ComposeComponentsSection: React.FC = () => {
  const { language } = useLanguage();
  const t = {
    es: {
      kicker: 'Compose · Componentes KMP',
      title: 'Componentes Compose reutilizables',
      subtitle:
        'Un componente recibe solo lo que necesita, no guarda estado de dominio y se apoya en Material 3 y el design system. Practica cada regla con demos interactivas.',
      linterTitle: 'Linter de componentes',
      linterDescription:
        'Activa las prácticas que cumple tu componente. El linter calcula el score y lista lo que falta.',
      linterScore: 'Score del componente',
      linterRulesMet: 'reglas cumplidas',
      linterIssues: 'Problemas detectados',
      linterPass: 'El componente cumple todas las reglas. Listo para review.',
      reset: 'Reiniciar',
      rules: [
        { label: 'Incluye modifier: Modifier = Modifier', hint: 'Permite al llamador ajustar layout sin envolver el componente.' },
        { label: 'Recibe solo los parámetros que necesita', hint: 'No pases el estado completo del Screen; limita el blast radius de recomposición.' },
        { label: 'Acciones con lambdas nombradas', hint: 'onNoteClick / onDeleteClick describen el evento, no la implementación.' },
        { label: 'Sin estado local de dominio', hint: 'El estado de negocio vive en el ViewModel; remember solo para foco, scroll o animación.' },
        { label: 'Iconos clicables en IconButton con contentDescription', hint: 'Garantiza 48dp de touch target, ripple y accesibilidad.' },
        { label: 'Sizing relativo, sin tamaños fijos', hint: 'fillMaxWidth, weight, widthIn y aspectRatio en lugar de width(360.dp).' },
        { label: 'Colores desde MaterialTheme.colorScheme', hint: 'Los colores hardcodeados se rompen en dark theme.' },
        { label: 'Strings desde stringResource(Res.string…)', hint: 'Sin texto hardcodeado: necesario para i18n y accesibilidad.' },
        { label: 'Sin APIs exclusivas de Android', hint: 'Sin R, LocalContext ni androidx.activity.* en commonMain.' },
        { label: 'Animación leída en graphicsLayer / offset', hint: 'Evita recomponer en cada frame de la animación.' },
        { label: 'Un @Preview por cada estado distinto', hint: 'Booleanos, enum, datos, light/dark y anchos que reflowan.' },
      ],
      iconTitle: 'IconButton bien hecho',
      iconDescription:
        'Compara el touch target y el ripple de un IconButton real frente a un Icon con Modifier.clickable.',
      iconGood: 'IconButton + contentDescription',
      iconBad: 'Icon + clickable',
      iconGoodCaption: '48dp de touch target, ripple y descripción accesible.',
      iconBadCaption: 'Área táctil mínima, sin ripple y sin semántica accesible.',
      iconDemo: 'Mock visual',
      iconCodeTitle: 'Implementación correcta',
      iconCode: `IconButton(onClick = onDelete) {
    Icon(
        painter = AppIcons.Bin,
        contentDescription = stringResource(Res.string.cd_delete)
    )
}`,
      paramsTitle: 'Diseño de parámetros',
      parameterQuestion: '¿Qué firma es correcta para NoteItem?',
      parameterOptions: [
        'fun NoteItem(state: NoteListState, onAction: (NoteListAction) -> Unit)',
        'fun NoteItem(title: String, formattedDate: String, onNoteClick: () -> Unit, onDeleteClick: () -> Unit, modifier: Modifier = Modifier)',
        'fun NoteItem(note: NoteUi)',
        'fun NoteItem(viewModel: NoteViewModel)',
      ],
      parameterAnswer: 1,
      parameterExplanation:
        'El componente recibe solo lo que renderiza. Las acciones suben por lambdas nombradas y el modifier siempre está presente.',
      previewTitle: 'Generador de matriz de previews',
      previewDescription:
        'Selecciona los estados de tu componente y obtén la lista exacta de @Preview que debes escribir.',
      previewCount: 'previews requeridos',
      previewEmpty: 'Selecciona al menos un estado para generar la matriz.',
      previewNote:
        'Un componente con cinco estados visualmente distintos necesita cinco funciones @Preview separadas, nunca PreviewParameter.',
      previewOptions: [
        { key: 'expandedOn', label: 'isExpanded = true', previewName: 'NoteItemExpandedPreview' },
        { key: 'expandedOff', label: 'isExpanded = false', previewName: 'NoteItemCollapsedPreview' },
        { key: 'selected', label: 'isSelected = true', previewName: 'NoteItemSelectedPreview' },
        { key: 'dark', label: 'Dark theme', previewName: 'NoteItemDarkPreview' },
        { key: 'longTitle', label: 'Texto largo / truncado', previewName: 'NoteItemLongTitlePreview' },
        { key: 'empty', label: 'Estado vacío', previewName: 'NoteItemEmptyPreview' },
        { key: 'compact', label: 'widthDp = 320', previewName: 'NoteItemCompactPreview' },
        { key: 'wide', label: 'widthDp = 840', previewName: 'NoteItemWidePreview' },
        { key: 'font', label: 'fontScale = 2f', previewName: 'NoteItemLargeFontPreview' },
      ],
      m3Title: 'Material 3 primero',
      m3Description:
        'Elige qué quieres construir y descubre de qué componente M3 debes partir.',
      m3BaseLabel: 'Base Material 3',
      m3WhyLabel: 'Por qué',
      m3CodeLabel: 'Punto de partida',
      m3Options: [
        {
          key: 'iconTile',
          label: 'Icon button con fondo',
          base: 'FilledTonalIconButton',
          why: 'Ya aporta 48dp, ripple y state layer. Personaliza con shape, colors y contentPadding.',
          code: `FilledTonalIconButton(
    onClick = onClick,
    shape = CircleShape,
    colors = IconButtonDefaults.filledTonalIconButtonColors(
        containerColor = MaterialTheme.colorScheme.secondaryContainer,
        contentColor = MaterialTheme.colorScheme.onSecondaryContainer
    )
) {
    Icon(painter = icon, contentDescription = contentDescription)
}`,
        },
        {
          key: 'segmented',
          label: 'Selector segmentado',
          base: 'TabRow + Tab',
          why: 'Reutiliza la semántica de tabs, el indicador y la navegación por teclado en lugar de un Row de Boxes.',
          code: `TabRow(selectedTabIndex = selectedIndex) {
    options.forEachIndexed { index, label ->
        Tab(
            selected = selectedIndex == index,
            onClick = { onSelect(index) },
            text = { Text(label) }
        )
    }
}`,
        },
        {
          key: 'dialog',
          label: 'Diálogo destructivo',
          base: 'AlertDialog',
          why: 'Gestiona el foco, el scrim, el botón de escape y los roles de accesibilidad por ti.',
          code: `AlertDialog(
    onDismissRequest = onDismiss,
    title = { Text(stringResource(Res.string.delete_title)) },
    text = { Text(stringResource(Res.string.delete_message)) },
    confirmButton = {
        TextButton(onClick = onConfirm) { Text(stringResource(Res.string.action_delete)) }
    },
    dismissButton = {
        TextButton(onClick = onDismiss) { Text(stringResource(Res.string.action_cancel)) }
    }
)`,
        },
        {
          key: 'textField',
          label: 'Campo de texto',
          base: 'OutlinedTextField',
          why: 'Incluye label, estados de error, soporte de IME y semántica correcta sin reconstruirla.',
          code: `OutlinedTextField(
    value = value,
    onValueChange = onValueChange,
    label = { Text(stringResource(Res.string.note_title_label)) },
    modifier = Modifier.fillMaxWidth()
)`,
        },
        {
          key: 'fab',
          label: 'Botón flotante',
          base: 'FloatingActionButton',
          why: 'Mantiene la elevación, el tamaño mínimo y el rol de acción principal del design system.',
          code: `FloatingActionButton(onClick = onAddNote) {
    Icon(
        painter = AppIcons.Add,
        contentDescription = stringResource(Res.string.cd_add_note)
    )
}`,
        },
      ],
      concept1Title: 'Slots con intención',
      concept1Body:
        'Usa lambdas @Composable en componentes del design system cuando el contenido cambia de forma. En features, prefiere parámetros tipados.',
      concept2Title: 'Visibilidad desde el inicio',
      concept2Body:
        'private si solo se usa en el archivo, internal si vive en el módulo feature y public solo si pertenece a :core:designsystem.',
      concept3Title: 'Design system como fuente única',
      concept3Body:
        'Antes de crear un componente, revisa :core:designsystem. Si existe algo cercano, extiéndelo con parámetros o slots.',
      codeParamsTitle: 'Parámetros vs estado completo',
      codeBadParams: `// MAL: el componente depende del Screen entero
@Composable
fun NoteItem(
    state: NoteListState,
    onAction: (NoteListAction) -> Unit
)`,
      codeGoodParams: `// BIEN: solo lo que renderiza + lambdas nombradas
@Composable
fun NoteItem(
    title: String,
    formattedDate: String,
    onNoteClick: () -> Unit,
    onDeleteClick: () -> Unit,
    modifier: Modifier = Modifier
)`,
      codeSizingTitle: 'Sizing relativo',
      codeBadSizing: `// MAL: medidas fijas que se rompen en otra pantalla
Row(modifier = Modifier.width(360.dp)) {
    Text(text = title, modifier = Modifier.width(280.dp))
}`,
      codeGoodSizing: `// BIEN: distribución proporcional
Row(modifier = Modifier.fillMaxWidth()) {
    Text(text = title, modifier = Modifier.weight(1f))
    IconButton(onClick = onDeleteClick) {
        Icon(painter = AppIcons.Bin, contentDescription = null)
    }
}`,
      codeColorsTitle: 'Colores del tema',
      codeBadColors: `// MAL: color fijo, invisible o ilegible en dark theme
Text(text = title, color = Color(0xFF1C1B1F))`,
      codeGoodColors: `// BIEN: color del tema
Text(
    text = title,
    color = MaterialTheme.colorScheme.onSurface
)`,
      quiz: '¿En qué debe basarse un componente del design system?',
      quizOptions: [
        'En un Box construido a mano',
        'En el componente Material 3 más cercano',
        'En un Canvas',
        'En un Icon con Modifier.clickable',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Partir de M3 te da touch targets reales, paddings, ripple, state layers y accesibilidad probada. Los primitivos son el fallback.',
      checklistTitle: 'Checklist: nuevo componente',
      checklist: [
        'Revisar :core:designsystem antes de crearlo',
        'Partir del componente Material 3 correcto',
        'Recibir solo los parámetros necesarios',
        'Incluir modifier: Modifier = Modifier',
        'Acciones mediante lambdas nombradas',
        'Sin estado de dominio local',
        'Iconos en IconButton con contentDescription',
        'Strings desde stringResource(Res.string…)',
        'Sin APIs exclusivas de Android en commonMain',
        'Un @Preview por cada estado distinto, light y dark',
        'Definir visibilidad private / internal / public',
      ],
    },
    pt: {
      kicker: 'Compose · Componentes KMP',
      title: 'Componentes Compose reutilizáveis',
      subtitle:
        'Um componente recebe apenas o que precisa, não guarda estado de domínio e se apoia no Material 3 e no design system. Pratique cada regra com demos interativas.',
      linterTitle: 'Linter de componentes',
      linterDescription:
        'Ative as práticas que seu componente cumpre. O linter calcula o score e lista o que falta.',
      linterScore: 'Score do componente',
      linterRulesMet: 'regras cumpridas',
      linterIssues: 'Problemas detectados',
      linterPass: 'O componente cumpre todas as regras. Pronto para review.',
      reset: 'Reiniciar',
      rules: [
        { label: 'Inclui modifier: Modifier = Modifier', hint: 'Permite ao chamador ajustar layout sem envolver o componente.' },
        { label: 'Recebe apenas os parâmetros necessários', hint: 'Não passe o estado inteiro do Screen; limite o blast radius da recomposição.' },
        { label: 'Ações com lambdas nomeadas', hint: 'onNoteClick / onDeleteClick descrevem o evento, não a implementação.' },
        { label: 'Sem estado local de domínio', hint: 'O estado de negócio vive no ViewModel; remember apenas para foco, scroll ou animação.' },
        { label: 'Ícones clicáveis em IconButton com contentDescription', hint: 'Garante 48dp de touch target, ripple e acessibilidade.' },
        { label: 'Sizing relativo, sem tamanhos fixos', hint: 'fillMaxWidth, weight, widthIn e aspectRatio em vez de width(360.dp).' },
        { label: 'Cores de MaterialTheme.colorScheme', hint: 'Cores hardcoded quebram no dark theme.' },
        { label: 'Strings de stringResource(Res.string…)', hint: 'Sem texto hardcoded: necessário para i18n e acessibilidade.' },
        { label: 'Sem APIs exclusivas do Android', hint: 'Sem R, LocalContext nem androidx.activity.* em commonMain.' },
        { label: 'Animação lida em graphicsLayer / offset', hint: 'Evita recompor a cada frame da animação.' },
        { label: 'Um @Preview para cada estado distinto', hint: 'Booleanos, enum, dados, light/dark e larguras que reflowam.' },
      ],
      iconTitle: 'IconButton bem feito',
      iconDescription:
        'Compare o touch target e o ripple de um IconButton real com um Icon com Modifier.clickable.',
      iconGood: 'IconButton + contentDescription',
      iconBad: 'Icon + clickable',
      iconGoodCaption: '48dp de touch target, ripple e descrição acessível.',
      iconBadCaption: 'Área tátil mínima, sem ripple e sem semântica acessível.',
      iconDemo: 'Mock visual',
      iconCodeTitle: 'Implementação correta',
      iconCode: `IconButton(onClick = onDelete) {
    Icon(
        painter = AppIcons.Bin,
        contentDescription = stringResource(Res.string.cd_delete)
    )
}`,
      paramsTitle: 'Design de parâmetros',
      parameterQuestion: 'Qual assinatura é correta para NoteItem?',
      parameterOptions: [
        'fun NoteItem(state: NoteListState, onAction: (NoteListAction) -> Unit)',
        'fun NoteItem(title: String, formattedDate: String, onNoteClick: () -> Unit, onDeleteClick: () -> Unit, modifier: Modifier = Modifier)',
        'fun NoteItem(note: NoteUi)',
        'fun NoteItem(viewModel: NoteViewModel)',
      ],
      parameterAnswer: 1,
      parameterExplanation:
        'O componente recebe apenas o que renderiza. As ações sobem por lambdas nomeadas e o modifier está sempre presente.',
      previewTitle: 'Gerador de matriz de previews',
      previewDescription:
        'Selecione os estados do seu componente e obtenha a lista exata de @Preview que você deve escrever.',
      previewCount: 'previews requeridos',
      previewEmpty: 'Selecione ao menos um estado para gerar a matriz.',
      previewNote:
        'Um componente com cinco estados visualmente distintos precisa de cinco funções @Preview separadas, nunca PreviewParameter.',
      previewOptions: [
        { key: 'expandedOn', label: 'isExpanded = true', previewName: 'NoteItemExpandedPreview' },
        { key: 'expandedOff', label: 'isExpanded = false', previewName: 'NoteItemCollapsedPreview' },
        { key: 'selected', label: 'isSelected = true', previewName: 'NoteItemSelectedPreview' },
        { key: 'dark', label: 'Dark theme', previewName: 'NoteItemDarkPreview' },
        { key: 'longTitle', label: 'Texto longo / truncado', previewName: 'NoteItemLongTitlePreview' },
        { key: 'empty', label: 'Estado vazio', previewName: 'NoteItemEmptyPreview' },
        { key: 'compact', label: 'widthDp = 320', previewName: 'NoteItemCompactPreview' },
        { key: 'wide', label: 'widthDp = 840', previewName: 'NoteItemWidePreview' },
        { key: 'font', label: 'fontScale = 2f', previewName: 'NoteItemLargeFontPreview' },
      ],
      m3Title: 'Material 3 primeiro',
      m3Description:
        'Escolha o que quer construir e descubra de qual componente M3 deve partir.',
      m3BaseLabel: 'Base Material 3',
      m3WhyLabel: 'Por quê',
      m3CodeLabel: 'Ponto de partida',
      m3Options: [
        {
          key: 'iconTile',
          label: 'Icon button com fundo',
          base: 'FilledTonalIconButton',
          why: 'Já entrega 48dp, ripple e state layer. Personalize com shape, colors e contentPadding.',
          code: `FilledTonalIconButton(
    onClick = onClick,
    shape = CircleShape,
    colors = IconButtonDefaults.filledTonalIconButtonColors(
        containerColor = MaterialTheme.colorScheme.secondaryContainer,
        contentColor = MaterialTheme.colorScheme.onSecondaryContainer
    )
) {
    Icon(painter = icon, contentDescription = contentDescription)
}`,
        },
        {
          key: 'segmented',
          label: 'Seletor segmentado',
          base: 'TabRow + Tab',
          why: 'Reutiliza a semântica de tabs, o indicador e a navegação por teclado em vez de um Row de Boxes.',
          code: `TabRow(selectedTabIndex = selectedIndex) {
    options.forEachIndexed { index, label ->
        Tab(
            selected = selectedIndex == index,
            onClick = { onSelect(index) },
            text = { Text(label) }
        )
    }
}`,
        },
        {
          key: 'dialog',
          label: 'Diálogo destrutivo',
          base: 'AlertDialog',
          why: 'Gerencia foco, scrim, botão de escape e roles de acessibilidade por você.',
          code: `AlertDialog(
    onDismissRequest = onDismiss,
    title = { Text(stringResource(Res.string.delete_title)) },
    text = { Text(stringResource(Res.string.delete_message)) },
    confirmButton = {
        TextButton(onClick = onConfirm) { Text(stringResource(Res.string.action_delete)) }
    },
    dismissButton = {
        TextButton(onClick = onDismiss) { Text(stringResource(Res.string.action_cancel)) }
    }
)`,
        },
        {
          key: 'textField',
          label: 'Campo de texto',
          base: 'OutlinedTextField',
          why: 'Inclui label, estados de erro, suporte de IME e semântica correta sem reconstruí-la.',
          code: `OutlinedTextField(
    value = value,
    onValueChange = onValueChange,
    label = { Text(stringResource(Res.string.note_title_label)) },
    modifier = Modifier.fillMaxWidth()
)`,
        },
        {
          key: 'fab',
          label: 'Botão flutuante',
          base: 'FloatingActionButton',
          why: 'Mantém a elevação, o tamanho mínimo e o papel de ação principal do design system.',
          code: `FloatingActionButton(onClick = onAddNote) {
    Icon(
        painter = AppIcons.Add,
        contentDescription = stringResource(Res.string.cd_add_note)
    )
}`,
        },
      ],
      concept1Title: 'Slots com intenção',
      concept1Body:
        'Use lambdas @Composable em componentes do design system quando o conteúdo muda de forma. Em features, prefira parâmetros tipados.',
      concept2Title: 'Visibilidade desde o início',
      concept2Body:
        'private se só é usado no arquivo, internal se vive no módulo feature e public apenas se pertence a :core:designsystem.',
      concept3Title: 'Design system como fonte única',
      concept3Body:
        'Antes de criar um componente, revise :core:designsystem. Se existe algo próximo, estenda com parâmetros ou slots.',
      codeParamsTitle: 'Parâmetros vs estado completo',
      codeBadParams: `// ERRADO: o componente depende do Screen inteiro
@Composable
fun NoteItem(
    state: NoteListState,
    onAction: (NoteListAction) -> Unit
)`,
      codeGoodParams: `// CERTO: apenas o que renderiza + lambdas nomeadas
@Composable
fun NoteItem(
    title: String,
    formattedDate: String,
    onNoteClick: () -> Unit,
    onDeleteClick: () -> Unit,
    modifier: Modifier = Modifier
)`,
      codeSizingTitle: 'Sizing relativo',
      codeBadSizing: `// ERRADO: medidas fixas que quebram em outra tela
Row(modifier = Modifier.width(360.dp)) {
    Text(text = title, modifier = Modifier.width(280.dp))
}`,
      codeGoodSizing: `// CERTO: distribuição proporcional
Row(modifier = Modifier.fillMaxWidth()) {
    Text(text = title, modifier = Modifier.weight(1f))
    IconButton(onClick = onDeleteClick) {
        Icon(painter = AppIcons.Bin, contentDescription = null)
    }
}`,
      codeColorsTitle: 'Cores do tema',
      codeBadColors: `// ERRADO: cor fixa, invisível ou ilegível no dark theme
Text(text = title, color = Color(0xFF1C1B1F))`,
      codeGoodColors: `// CERTO: cor do tema
Text(
    text = title,
    color = MaterialTheme.colorScheme.onSurface
)`,
      quiz: 'Em que deve se basear um componente do design system?',
      quizOptions: [
        'Em um Box construído à mão',
        'No componente Material 3 mais próximo',
        'Em um Canvas',
        'Em um Icon com Modifier.clickable',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Partir do M3 entrega touch targets reais, paddings, ripple, state layers e acessibilidade testada. Os primitivos são o fallback.',
      checklistTitle: 'Checklist: novo componente',
      checklist: [
        'Revisar :core:designsystem antes de criá-lo',
        'Partir do componente Material 3 correto',
        'Receber apenas os parâmetros necessários',
        'Incluir modifier: Modifier = Modifier',
        'Ações via lambdas nomeadas',
        'Sem estado de domínio local',
        'Ícones em IconButton com contentDescription',
        'Strings de stringResource(Res.string…)',
        'Sem APIs exclusivas do Android em commonMain',
        'Um @Preview por cada estado distinto, light e dark',
        'Definir visibilidade private / internal / public',
      ],
    },
    en: {
      kicker: 'Compose · KMP components',
      title: 'Reusable Compose components',
      subtitle:
        'A component receives only what it needs, holds no domain state, and builds on Material 3 and the design system. Practice each rule with interactive demos.',
      linterTitle: 'Component linter',
      linterDescription:
        'Turn on the practices your component follows. The linter computes the score and lists what is missing.',
      linterScore: 'Component score',
      linterRulesMet: 'rules met',
      linterIssues: 'Detected issues',
      linterPass: 'The component meets every rule. Ready for review.',
      reset: 'Reset',
      rules: [
        { label: 'Includes modifier: Modifier = Modifier', hint: 'Lets the caller adjust layout without wrapping the component.' },
        { label: 'Takes only the parameters it needs', hint: 'Do not pass the whole Screen state; it limits the recomposition blast radius.' },
        { label: 'Named action lambdas', hint: 'onNoteClick / onDeleteClick describe the event, not the implementation.' },
        { label: 'No local domain state', hint: 'Business state lives in the ViewModel; remember is for focus, scroll, or animation only.' },
        { label: 'Clickable icons in IconButton with contentDescription', hint: 'Guarantees a 48dp touch target, ripple, and accessibility.' },
        { label: 'Relative sizing, no fixed dimensions', hint: 'Use fillMaxWidth, weight, widthIn, and aspectRatio instead of width(360.dp).' },
        { label: 'Colors from MaterialTheme.colorScheme', hint: 'Hardcoded colors break in dark theme.' },
        { label: 'Strings from stringResource(Res.string…)', hint: 'No hardcoded text: required for i18n and accessibility.' },
        { label: 'No Android-only APIs', hint: 'No R, LocalContext, or androidx.activity.* in commonMain.' },
        { label: 'Animation read in graphicsLayer / offset', hint: 'Avoids recomposing on every animation frame.' },
        { label: 'One @Preview per distinct state', hint: 'Booleans, enums, data, light/dark, and widths that reflow.' },
      ],
      iconTitle: 'A proper IconButton',
      iconDescription:
        'Compare the touch target and ripple of a real IconButton against an Icon with Modifier.clickable.',
      iconGood: 'IconButton + contentDescription',
      iconBad: 'Icon + clickable',
      iconGoodCaption: '48dp touch target, ripple, and an accessible description.',
      iconBadCaption: 'Minimal touch area, no ripple, and no accessible semantics.',
      iconDemo: 'Visual mock',
      iconCodeTitle: 'Correct implementation',
      iconCode: `IconButton(onClick = onDelete) {
    Icon(
        painter = AppIcons.Bin,
        contentDescription = stringResource(Res.string.cd_delete)
    )
}`,
      paramsTitle: 'Parameter design',
      parameterQuestion: 'Which signature is correct for NoteItem?',
      parameterOptions: [
        'fun NoteItem(state: NoteListState, onAction: (NoteListAction) -> Unit)',
        'fun NoteItem(title: String, formattedDate: String, onNoteClick: () -> Unit, onDeleteClick: () -> Unit, modifier: Modifier = Modifier)',
        'fun NoteItem(note: NoteUi)',
        'fun NoteItem(viewModel: NoteViewModel)',
      ],
      parameterAnswer: 1,
      parameterExplanation:
        'The component receives only what it renders. Actions bubble up through named lambdas and modifier is always present.',
      previewTitle: 'Preview matrix generator',
      previewDescription:
        'Select your component’s states and get the exact list of @Preview functions you need to write.',
      previewCount: 'required previews',
      previewEmpty: 'Select at least one state to generate the matrix.',
      previewNote:
        'A component with five visually distinct states needs five separate @Preview functions, never PreviewParameter.',
      previewOptions: [
        { key: 'expandedOn', label: 'isExpanded = true', previewName: 'NoteItemExpandedPreview' },
        { key: 'expandedOff', label: 'isExpanded = false', previewName: 'NoteItemCollapsedPreview' },
        { key: 'selected', label: 'isSelected = true', previewName: 'NoteItemSelectedPreview' },
        { key: 'dark', label: 'Dark theme', previewName: 'NoteItemDarkPreview' },
        { key: 'longTitle', label: 'Long / truncated text', previewName: 'NoteItemLongTitlePreview' },
        { key: 'empty', label: 'Empty state', previewName: 'NoteItemEmptyPreview' },
        { key: 'compact', label: 'widthDp = 320', previewName: 'NoteItemCompactPreview' },
        { key: 'wide', label: 'widthDp = 840', previewName: 'NoteItemWidePreview' },
        { key: 'font', label: 'fontScale = 2f', previewName: 'NoteItemLargeFontPreview' },
      ],
      m3Title: 'Material 3 first',
      m3Description:
        'Pick what you want to build and discover which M3 component to start from.',
      m3BaseLabel: 'Material 3 base',
      m3WhyLabel: 'Why',
      m3CodeLabel: 'Starting point',
      m3Options: [
        {
          key: 'iconTile',
          label: 'Icon button with background',
          base: 'FilledTonalIconButton',
          why: 'It already provides 48dp, ripple, and a state layer. Customize with shape, colors, and contentPadding.',
          code: `FilledTonalIconButton(
    onClick = onClick,
    shape = CircleShape,
    colors = IconButtonDefaults.filledTonalIconButtonColors(
        containerColor = MaterialTheme.colorScheme.secondaryContainer,
        contentColor = MaterialTheme.colorScheme.onSecondaryContainer
    )
) {
    Icon(painter = icon, contentDescription = contentDescription)
}`,
        },
        {
          key: 'segmented',
          label: 'Segmented selector',
          base: 'TabRow + Tab',
          why: 'Reuses tab semantics, indicator, and keyboard navigation instead of a Row of Boxes.',
          code: `TabRow(selectedTabIndex = selectedIndex) {
    options.forEachIndexed { index, label ->
        Tab(
            selected = selectedIndex == index,
            onClick = { onSelect(index) },
            text = { Text(label) }
        )
    }
}`,
        },
        {
          key: 'dialog',
          label: 'Destructive dialog',
          base: 'AlertDialog',
          why: 'Handles focus, scrim, the escape action, and accessibility roles for you.',
          code: `AlertDialog(
    onDismissRequest = onDismiss,
    title = { Text(stringResource(Res.string.delete_title)) },
    text = { Text(stringResource(Res.string.delete_message)) },
    confirmButton = {
        TextButton(onClick = onConfirm) { Text(stringResource(Res.string.action_delete)) }
    },
    dismissButton = {
        TextButton(onClick = onDismiss) { Text(stringResource(Res.string.action_cancel)) }
    }
)`,
        },
        {
          key: 'textField',
          label: 'Text field',
          base: 'OutlinedTextField',
          why: 'Includes label, error states, IME support, and correct semantics without rebuilding them.',
          code: `OutlinedTextField(
    value = value,
    onValueChange = onValueChange,
    label = { Text(stringResource(Res.string.note_title_label)) },
    modifier = Modifier.fillMaxWidth()
)`,
        },
        {
          key: 'fab',
          label: 'Floating action button',
          base: 'FloatingActionButton',
          why: 'Keeps the elevation, minimum size, and primary-action role of the design system.',
          code: `FloatingActionButton(onClick = onAddNote) {
    Icon(
        painter = AppIcons.Add,
        contentDescription = stringResource(Res.string.cd_add_note)
    )
}`,
        },
      ],
      concept1Title: 'Slots with intent',
      concept1Body:
        'Use @Composable lambdas in design system components when content changes shape. In features, prefer typed parameters.',
      concept2Title: 'Visibility from the start',
      concept2Body:
        'private if used only in the file, internal if it lives in a feature module, and public only inside :core:designsystem.',
      concept3Title: 'Design system as the single source',
      concept3Body:
        'Before building a component, check :core:designsystem. If something is close, extend it with parameters or slots.',
      codeParamsTitle: 'Parameters vs whole state',
      codeBadParams: `// WRONG: the component depends on the whole Screen
@Composable
fun NoteItem(
    state: NoteListState,
    onAction: (NoteListAction) -> Unit
)`,
      codeGoodParams: `// RIGHT: only what it renders + named lambdas
@Composable
fun NoteItem(
    title: String,
    formattedDate: String,
    onNoteClick: () -> Unit,
    onDeleteClick: () -> Unit,
    modifier: Modifier = Modifier
)`,
      codeSizingTitle: 'Relative sizing',
      codeBadSizing: `// WRONG: fixed sizes that break on another screen
Row(modifier = Modifier.width(360.dp)) {
    Text(text = title, modifier = Modifier.width(280.dp))
}`,
      codeGoodSizing: `// RIGHT: proportional distribution
Row(modifier = Modifier.fillMaxWidth()) {
    Text(text = title, modifier = Modifier.weight(1f))
    IconButton(onClick = onDeleteClick) {
        Icon(painter = AppIcons.Bin, contentDescription = null)
    }
}`,
      codeColorsTitle: 'Theme colors',
      codeBadColors: `// WRONG: fixed color, invisible or unreadable in dark theme
Text(text = title, color = Color(0xFF1C1B1F))`,
      codeGoodColors: `// RIGHT: theme color
Text(
    text = title,
    color = MaterialTheme.colorScheme.onSurface
)`,
      quiz: 'What should a design system component be based on?',
      quizOptions: [
        'A hand-built Box',
        'The closest Material 3 component',
        'A Canvas',
        'An Icon with Modifier.clickable',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Starting from M3 gives you real touch targets, paddings, ripple, state layers, and tested accessibility. Primitives are the fallback.',
      checklistTitle: 'Checklist: new component',
      checklist: [
        'Check :core:designsystem before building it',
        'Start from the right Material 3 component',
        'Accept only the required parameters',
        'Include modifier: Modifier = Modifier',
        'Actions through named lambdas',
        'No local domain state',
        'Icons in IconButton with contentDescription',
        'Strings from stringResource(Res.string…)',
        'No Android-only APIs in commonMain',
        'One @Preview per distinct state, light and dark',
        'Set visibility: private / internal / public',
      ],
    },
  }[language];

  const ruleCount = t.rules.length;
  const [rulesMet, setRulesMet] = useState<Set<number>>(() => new Set());

  const toggleRule = (index: number) => {
    setRulesMet((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const score = Math.round((rulesMet.size / ruleCount) * 100);

  const [iconGood, setIconGood] = useState(true);

  const previewOptionList = t.previewOptions as PreviewOption[];
  const [selectedPreviews, setSelectedPreviews] = useState<Set<string>>(
    () => new Set(['expandedOn', 'expandedOff', 'dark', 'longTitle'])
  );

  const togglePreview = (key: string) => {
    setSelectedPreviews((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const generatedPreviews = useMemo(
    () => previewOptionList.filter((option) => selectedPreviews.has(option.key)),
    [previewOptionList, selectedPreviews]
  );

  const [m3Option, setM3Option] = useState(0);
  const activeM3 = (t.m3Options as M3Option[])[m3Option];

  return (
    <div className="space-y-10">
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-low space-y-3">
        <span className="text-xs font-mono text-brand uppercase font-semibold">{t.kicker}</span>
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface">{t.title}</h2>
        <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">{t.subtitle}</p>
      </div>

      <SimulatorFrame title={t.linterTitle} description={t.linterDescription}>
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-surface-high overflow-hidden">
            <div
              className="h-full bg-brand transition-all"
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-on-surface leading-none">{score}%</p>
            <span className="text-[10px] font-mono text-on-surface-variant">
              {rulesMet.size}/{ruleCount} {t.linterRulesMet}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {t.rules.map((rule, index) => {
            const active = rulesMet.has(index);
            return (
              <button
                key={rule.label}
                onClick={() => toggleRule(index)}
                className={`text-left p-3 rounded-xl border transition-colors flex items-start gap-2 ${
                  active
                    ? 'border-brand/40 bg-brand/10'
                    : 'border-transparent bg-surface-lowest hover:bg-surface-container'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center ${
                    active ? 'bg-brand border-brand text-on-brand' : 'border-outline-variant'
                  }`}
                >
                  {active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-on-surface-variant" />}
                </span>
                <span className="min-w-0">
                  <span className={`block text-[11px] font-semibold ${active ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {rule.label}
                  </span>
                  <span className="block text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                    {rule.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {rulesMet.size === ruleCount ? (
          <Callout tone="brand" title={t.linterPass}>
            <span className="line-through opacity-60">{t.linterIssues}</span>
          </Callout>
        ) : (
          <div className="p-3 rounded-xl bg-amber-500/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{t.linterIssues}</span>
            </div>
            <ul className="space-y-1">
              {t.rules.map((rule, index) =>
                rulesMet.has(index) ? null : (
                  <li key={rule.label} className="text-[11px] text-on-surface-variant flex items-start gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{rule.label}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </SimulatorFrame>

      <SimulatorFrame title={t.iconTitle} description={t.iconDescription}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIconGood(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              iconGood
                ? 'bg-brand text-on-brand'
                : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.iconGood}
          </button>
          <button
            onClick={() => setIconGood(false)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              !iconGood
                ? 'bg-brand text-on-brand'
                : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.iconBad}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-surface-lowest flex flex-col items-center justify-center gap-2 min-h-[132px]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
              {t.iconDemo}
            </span>
            {iconGood ? (
              <button
                className="w-12 h-12 rounded-full bg-brand/15 text-brand flex items-center justify-center ring-2 ring-brand/30 transition-colors hover:bg-brand/25"
                aria-label="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            ) : (
              <span className="w-5 h-5 text-rose-400 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </span>
            )}
            <p className="text-[10px] text-center text-on-surface-variant max-w-[180px]">
              {iconGood ? t.iconGoodCaption : t.iconBadCaption}
            </p>
          </div>
          <CodeViewer title={t.iconCodeTitle} code={t.iconCode} />
        </div>
      </SimulatorFrame>

      <SkillSection title={t.paramsTitle}>
        <Quiz
          question={t.parameterQuestion}
          options={t.parameterOptions}
          correctIndex={t.parameterAnswer}
          explanation={t.parameterExplanation}
        />
      </SkillSection>

      <SimulatorFrame title={t.previewTitle} description={t.previewDescription}>
        <div className="flex flex-wrap gap-2">
          {(t.previewOptions as PreviewOption[]).map((option) => {
            const active = selectedPreviews.has(option.key);
            return (
              <button
                key={option.key}
                onClick={() => togglePreview(option.key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors ${
                  active
                    ? 'bg-brand text-on-brand'
                    : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span className="text-on-surface-variant">{t.previewCount}:</span>
          <span className="text-brand font-bold">{generatedPreviews.length}</span>
        </div>

        {generatedPreviews.length === 0 ? (
          <p className="text-xs text-on-surface-variant">{t.previewEmpty}</p>
        ) : (
          <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
            {generatedPreviews.map((option) => `@Preview\nfun ${option.previewName}() { … }`).join('\n\n')}
          </pre>
        )}

        <Callout tone="warning">{t.previewNote}</Callout>
      </SimulatorFrame>

      <SimulatorFrame title={t.m3Title} description={t.m3Description}>
        <div className="flex flex-wrap gap-2">
          {(t.m3Options as M3Option[]).map((option, index) => (
            <button
              key={option.key}
              onClick={() => setM3Option(index)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold transition-colors ${
                m3Option === index
                  ? 'bg-brand text-on-brand'
                  : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-surface-lowest space-y-3">
            <div>
              <p className="ds-label text-on-surface-variant">{t.m3BaseLabel}</p>
              <p className="text-sm font-bold text-brand font-mono">{activeM3.base}</p>
            </div>
            <div>
              <p className="ds-label text-on-surface-variant">{t.m3WhyLabel}</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">{activeM3.why}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="ds-label text-on-surface-variant">{t.m3CodeLabel}</p>
            <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
              {activeM3.code}
            </pre>
          </div>
        </div>
      </SimulatorFrame>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConceptCard icon={Puzzle} title={t.concept1Title}>
          {t.concept1Body}
        </ConceptCard>
        <ConceptCard icon={LayoutGrid} title={t.concept2Title} tone="brand">
          {t.concept2Body}
        </ConceptCard>
        <ConceptCard icon={Palette} title={t.concept3Title} tone="warning">
          {t.concept3Body}
        </ConceptCard>
      </div>

      <SkillSection title={t.codeParamsTitle}>
        <CodeCompare title={t.codeParamsTitle} badCode={t.codeBadParams} goodCode={t.codeGoodParams} />
      </SkillSection>

      <SkillSection title={t.codeSizingTitle}>
        <CodeCompare title={t.codeSizingTitle} badCode={t.codeBadSizing} goodCode={t.codeGoodSizing} />
      </SkillSection>

      <SkillSection title={t.codeColorsTitle}>
        <CodeCompare title={t.codeColorsTitle} badCode={t.codeBadColors} goodCode={t.codeGoodColors} />
      </SkillSection>

      <Quiz question={t.quiz} options={t.quizOptions} correctIndex={t.quizAnswer} explanation={t.quizExplanation} />

      <Checklist title={t.checklistTitle} items={t.checklist} />

      <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
        <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
        <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
        <span>{t.linterScore}</span>
        <span className="text-brand font-bold ml-auto">{score}%</span>
      </div>
    </div>
  );
};
