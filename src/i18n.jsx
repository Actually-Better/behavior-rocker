import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
];

const STORAGE_KEY = "behavior-rocker-language";

export function getActuallyBetterUrl(locale) {
  return `https://actually-better.com/?lang=${locale}`;
}

const en = {
  metaTitle: "Behavior Rocker Configurator",
  metaDescription: "Configure and test Behavior Rocker, a clearer two-choice control for decisions that go beyond on or off.",
  customize: "Go to control properties",
  language: "Change language",
  configurator: "Configurator",
  introLabel: "Interactive component configurator",
  introLead: "Some decisions are binary without being on or off.",
  intro1: "A checkbox is excellent for confirming a statement, and a toggle is efficient when a feature is simply enabled or disabled. They become ambiguous when each state produces a different behavior: one short label has to describe two consequences, while the user must remember what “on” means in that particular context.",
  intro2: "Behavior Rocker makes the decision itself visible. Both outcomes remain on screen, written as complete actions rather than hidden behind a Boolean state. People can choose either side directly, use the keyboard or directional controls, or drag the pivot across the full rail. Progressive feedback previews the destination, and a configurable threshold determines when the new behavior commits.",
  intro3: "The proposal is intentionally more explicit than a conventional switch. It trades a little horizontal space for clearer intent, fewer interpretation errors and greater confidence around actions such as keeping versus replacing, sharing versus restricting, or preserving versus transforming. Use it when both choices deserve names; keep the familiar toggle when the decision is genuinely just enabled or disabled.",
  intro4: "Behavior Rocker is more than a demonstration: it is a reusable control. Customize its content, appearance and interaction here, download the generated code, and use it on any website or app. It is available under the MIT License, so you can use, modify and share it under the license terms.",
  reset: "Reset",
  copied: "Copied",
  copy: "Copy configuration",
  codeExportLabel: "Ready-to-use code",
  codeExportTitle: "Use it in your app",
  codeExportDescription: "Choose a common framework and copy a standalone component with your current customizations already applied.",
  codeFormat: "Code format",
  copyCode: "Copy code",
  codeCopied: "Code copied",
  generatedCode: "Generated Behavior Rocker code",
  codeExportNote: "The generated component has no extra UI-library dependency and dispatches a change event with the selected option.",
  livePreview: "Live preview",
  tryControl: "Try the control",
  previewSize: "Preview size",
  wide: "Wide",
  mobile: "Mobile",
  toCommit: "{value}% to commit",
  progressiveTransition: "Progressive transition",
  instantChange: "Instant change",
  insideLabels: "Inside labels",
  outsideLabels: "Outside labels",
  properties: "Control properties",
  content: "Content",
  title: "Title",
  optionA: "Option A",
  optionB: "Option B",
  labelPlacement: "Label placement",
  inside: "Inside",
  outside: "Outside",
  geometry: "Geometry",
  orientation: "Orientation",
  auto: "Auto",
  horizontal: "Horizontal",
  vertical: "Vertical",
  density: "Density",
  compact: "Compact",
  comfortable: "Comfortable",
  spacious: "Spacious",
  radius: "Radius",
  color: "Color",
  scheme: "Scheme",
  monochrome: "Monochrome",
  perOption: "Per option",
  activeColor: "Active color",
  optionAColor: "Option A color",
  optionBColor: "Option B color",
  surface: "Surface",
  text: "Text",
  canvas: "Canvas",
  handle: "Handle",
  icons: "Icons",
  outerBorder: "Outer border",
  innerDivider: "Inner divider",
  selectionBorder: "Selection border",
  style: "Style",
  width: "Width",
  showBorder: "Show border",
  behavior: "Behavior",
  commitThreshold: "Commit threshold",
  colorTransition: "Color transition",
  progressive: "Progressive",
  instant: "Instant",
  initialSelection: "Initial selection",
  options: "Options",
  selectOption: "Select {option}",
  colorPicker: "{label}: color picker",
  hexValue: "{label}: hexadecimal value",
  borderStyles: { none: "None", solid: "Solid", dashed: "Dashed", dotted: "Dotted", double: "Double" },
  defaults: { title: "After uploading a file", optionA: "Keep the original", optionB: "Replace it with the new version" },
};

const translations = {
  en,
  es: {
    ...en,
    metaTitle: "Configurador de Behavior Rocker",
    metaDescription: "Configura y prueba Behavior Rocker, un control de dos opciones más claro para decisiones que van más allá de activar o desactivar.",
    customize: "Ir a las propiedades del control",
    language: "Cambiar idioma",
    configurator: "Configurador",
    introLabel: "Configurador interactivo de componentes",
    introLead: "Algunas decisiones son binarias sin ser activar o desactivar.",
    intro1: "Una casilla funciona muy bien para confirmar una afirmación y un interruptor es eficaz cuando una función simplemente está activada o desactivada. Ambos resultan ambiguos cuando cada estado produce un comportamiento distinto: una sola etiqueta debe explicar dos consecuencias y la persona tiene que recordar qué significa «activado» en ese contexto.",
    intro2: "Behavior Rocker hace visible la propia decisión. Los dos resultados permanecen en pantalla y se expresan como acciones completas, no como un estado booleano oculto. Se puede elegir directamente cualquiera de los lados, usar el teclado o los controles direccionales, o arrastrar el pivote por todo el recorrido. La respuesta progresiva anticipa el destino y un umbral configurable determina cuándo se confirma el nuevo comportamiento.",
    intro3: "La propuesta es deliberadamente más explícita que un interruptor convencional. A cambio de un poco más de espacio, ofrece una intención más clara, menos errores de interpretación y mayor confianza en decisiones como conservar o sustituir, compartir o restringir, y preservar o transformar. Úsalo cuando ambas alternativas merecen un nombre; conserva el interruptor habitual cuando la decisión sea realmente solo activar o desactivar.",
    intro4: "Behavior Rocker es más que una demostración: es un control reutilizable. Aquí puedes personalizar su contenido, aspecto e interacción, descargar el código generado y usarlo en cualquier web o aplicación. Está disponible bajo licencia MIT, por lo que puedes usarlo, modificarlo y compartirlo conforme a sus términos.",
    reset: "Restablecer", copied: "Copiado", copy: "Copiar configuración", codeExportLabel: "Código listo para usar", codeExportTitle: "Úsalo en tu app", codeExportDescription: "Elige un framework habitual y copia un componente autónomo con tus personalizaciones actuales ya aplicadas.", codeFormat: "Formato de código", copyCode: "Copiar código", codeCopied: "Código copiado", generatedCode: "Código generado de Behavior Rocker", codeExportNote: "El componente generado no depende de otra librería de interfaz y emite un evento change con la opción seleccionada.", livePreview: "Vista previa", tryControl: "Prueba el control", previewSize: "Tamaño de vista", wide: "Ancha", mobile: "Móvil", toCommit: "{value}% para confirmar", progressiveTransition: "Transición progresiva", instantChange: "Cambio inmediato", insideLabels: "Etiquetas interiores", outsideLabels: "Etiquetas exteriores", properties: "Propiedades del control", content: "Contenido", title: "Título", optionA: "Opción A", optionB: "Opción B", labelPlacement: "Posición de etiquetas", inside: "Dentro", outside: "Fuera", geometry: "Geometría", orientation: "Orientación", auto: "Automática", horizontal: "Horizontal", vertical: "Vertical", density: "Densidad", compact: "Compacta", comfortable: "Cómoda", spacious: "Amplia", radius: "Radio", color: "Color", scheme: "Esquema", monochrome: "Monocromo", perOption: "Por opción", activeColor: "Color activo", optionAColor: "Color de opción A", optionBColor: "Color de opción B", surface: "Superficie", text: "Texto", canvas: "Lienzo", handle: "Pivote", icons: "Iconos", outerBorder: "Borde exterior", innerDivider: "Divisor interior", selectionBorder: "Borde de selección", style: "Estilo", width: "Anchura", showBorder: "Mostrar borde", behavior: "Comportamiento", commitThreshold: "Umbral de confirmación", colorTransition: "Transición de color", progressive: "Progresiva", instant: "Inmediata", initialSelection: "Selección inicial", options: "Opciones", selectOption: "Seleccionar {option}", colorPicker: "{label}: selector de color", hexValue: "{label}: valor hexadecimal",
    borderStyles: { none: "Ninguno", solid: "Continuo", dashed: "Discontinuo", dotted: "Punteado", double: "Doble" },
    defaults: { title: "Después de subir un archivo", optionA: "Conservar el original", optionB: "Sustituirlo por la nueva versión" },
  },
  fr: {
    ...en,
    metaTitle: "Configurateur Behavior Rocker", metaDescription: "Configurez et testez Behavior Rocker, une commande à deux choix plus claire pour les décisions qui dépassent activé ou désactivé.", customize: "Accéder aux propriétés de la commande", language: "Changer de langue", configurator: "Configurateur", introLabel: "Configurateur interactif de composant", introLead: "Certaines décisions sont binaires sans être activées ou désactivées.", intro1: "Une case à cocher convient parfaitement pour confirmer une affirmation, et un interrupteur est efficace lorsqu’une fonction est simplement activée ou désactivée. Ils deviennent ambigus lorsque chaque état produit un comportement différent : un seul libellé doit expliquer deux conséquences et l’utilisateur doit se rappeler ce que signifie « activé » dans ce contexte.", intro2: "Behavior Rocker rend la décision elle-même visible. Les deux résultats restent affichés et sont formulés comme des actions complètes plutôt que cachés derrière un état booléen. Chacun peut sélectionner directement un côté, utiliser le clavier ou les commandes directionnelles, ou faire glisser le pivot sur toute la course. Le retour progressif prévisualise la destination et un seuil configurable détermine quand le nouveau comportement est validé.", intro3: "La proposition est volontairement plus explicite qu’un interrupteur classique. Elle échange un peu d’espace contre une intention plus claire, moins d’erreurs d’interprétation et davantage de confiance pour conserver ou remplacer, partager ou restreindre, préserver ou transformer. Utilisez-la lorsque les deux choix méritent un nom ; gardez l’interrupteur familier lorsque la décision est réellement simplement activée ou désactivée.",
    intro4: "Behavior Rocker est plus qu’une démonstration : c’est une commande réutilisable. Personnalisez ici son contenu, son apparence et son interaction, téléchargez le code généré et utilisez-le sur n’importe quel site web ou application. Il est disponible sous licence MIT : vous pouvez l’utiliser, le modifier et le partager conformément aux termes de la licence.",
    reset: "Réinitialiser", copied: "Copié", copy: "Copier la configuration", codeExportLabel: "Code prêt à l’emploi", codeExportTitle: "Utilisez-le dans votre app", codeExportDescription: "Choisissez un framework courant et copiez un composant autonome avec vos personnalisations actuelles déjà appliquées.", codeFormat: "Format du code", copyCode: "Copier le code", codeCopied: "Code copié", generatedCode: "Code Behavior Rocker généré", codeExportNote: "Le composant généré ne dépend d’aucune autre bibliothèque d’interface et émet un événement change avec l’option sélectionnée.", livePreview: "Aperçu en direct", tryControl: "Essayez la commande", previewSize: "Taille de l’aperçu", wide: "Large", mobile: "Mobile", toCommit: "{value}% pour valider", progressiveTransition: "Transition progressive", instantChange: "Changement immédiat", insideLabels: "Libellés intérieurs", outsideLabels: "Libellés extérieurs", properties: "Propriétés de la commande", content: "Contenu", title: "Titre", optionA: "Option A", optionB: "Option B", labelPlacement: "Position des libellés", inside: "Intérieur", outside: "Extérieur", geometry: "Géométrie", orientation: "Orientation", auto: "Automatique", horizontal: "Horizontale", vertical: "Verticale", density: "Densité", compact: "Compacte", comfortable: "Confortable", spacious: "Spacieuse", radius: "Rayon", color: "Couleur", scheme: "Schéma", monochrome: "Monochrome", perOption: "Par option", activeColor: "Couleur active", optionAColor: "Couleur option A", optionBColor: "Couleur option B", surface: "Surface", text: "Texte", canvas: "Fond", handle: "Pivot", icons: "Icônes", outerBorder: "Bordure extérieure", innerDivider: "Séparateur intérieur", selectionBorder: "Bordure de sélection", style: "Style", width: "Largeur", showBorder: "Afficher la bordure", behavior: "Comportement", commitThreshold: "Seuil de validation", colorTransition: "Transition de couleur", progressive: "Progressive", instant: "Immédiate", initialSelection: "Sélection initiale", options: "Options", selectOption: "Sélectionner {option}", colorPicker: "{label} : sélecteur de couleur", hexValue: "{label} : valeur hexadécimale",
    borderStyles: { none: "Aucune", solid: "Continue", dashed: "Tirets", dotted: "Pointillés", double: "Double" }, defaults: { title: "Après l’import d’un fichier", optionA: "Conserver l’original", optionB: "Le remplacer par la nouvelle version" },
  },
  it: {
    ...en,
    metaTitle: "Configuratore Behavior Rocker", metaDescription: "Configura e prova Behavior Rocker, un controllo a due opzioni più chiaro per decisioni che vanno oltre acceso o spento.", customize: "Vai alle proprietà del controllo", language: "Cambia lingua", configurator: "Configuratore", introLabel: "Configuratore interattivo del componente", introLead: "Alcune decisioni sono binarie senza essere acceso o spento.", intro1: "Una casella di controllo è ottima per confermare un’affermazione e un interruttore è efficiente quando una funzione è semplicemente attiva o disattiva. Entrambi diventano ambigui quando ogni stato produce un comportamento diverso: una sola etichetta deve descrivere due conseguenze e la persona deve ricordare cosa significa «attivo» in quel contesto.", intro2: "Behavior Rocker rende visibile la decisione. Entrambi i risultati rimangono sullo schermo e sono espressi come azioni complete, invece di essere nascosti dietro uno stato booleano. È possibile scegliere direttamente uno dei lati, usare la tastiera o i controlli direzionali, oppure trascinare il perno lungo l’intera guida. Il feedback progressivo anticipa la destinazione e una soglia configurabile stabilisce quando il nuovo comportamento viene confermato.", intro3: "La proposta è volutamente più esplicita di un interruttore convenzionale. Scambia un po’ di spazio con intenzioni più chiare, meno errori di interpretazione e maggiore sicurezza in azioni come conservare o sostituire, condividere o limitare, preservare o trasformare. Usalo quando entrambe le scelte meritano un nome; mantieni l’interruttore familiare quando la decisione è davvero solo attiva o disattiva.",
    intro4: "Behavior Rocker è più di una demo: è un controllo riutilizzabile. Qui puoi personalizzarne contenuto, aspetto e interazione, scaricare il codice generato e usarlo su qualsiasi sito web o app. È disponibile con licenza MIT, quindi puoi utilizzarlo, modificarlo e condividerlo nel rispetto dei termini della licenza.",
    reset: "Ripristina", copied: "Copiato", copy: "Copia configurazione", codeExportLabel: "Codice pronto all’uso", codeExportTitle: "Usalo nella tua app", codeExportDescription: "Scegli un framework comune e copia un componente autonomo con le personalizzazioni attuali già applicate.", codeFormat: "Formato del codice", copyCode: "Copia codice", codeCopied: "Codice copiato", generatedCode: "Codice Behavior Rocker generato", codeExportNote: "Il componente generato non dipende da altre librerie di interfaccia ed emette un evento change con l’opzione selezionata.", livePreview: "Anteprima dal vivo", tryControl: "Prova il controllo", previewSize: "Dimensione anteprima", wide: "Ampia", mobile: "Mobile", toCommit: "{value}% per confermare", progressiveTransition: "Transizione progressiva", instantChange: "Cambio immediato", insideLabels: "Etichette interne", outsideLabels: "Etichette esterne", properties: "Proprietà del controllo", content: "Contenuto", title: "Titolo", optionA: "Opzione A", optionB: "Opzione B", labelPlacement: "Posizione etichette", inside: "Interna", outside: "Esterna", geometry: "Geometria", orientation: "Orientamento", auto: "Automatico", horizontal: "Orizzontale", vertical: "Verticale", density: "Densità", compact: "Compatta", comfortable: "Comoda", spacious: "Ampia", radius: "Raggio", color: "Colore", scheme: "Schema", monochrome: "Monocromatico", perOption: "Per opzione", activeColor: "Colore attivo", optionAColor: "Colore opzione A", optionBColor: "Colore opzione B", surface: "Superficie", text: "Testo", canvas: "Sfondo", handle: "Perno", icons: "Icone", outerBorder: "Bordo esterno", innerDivider: "Divisore interno", selectionBorder: "Bordo selezione", style: "Stile", width: "Larghezza", showBorder: "Mostra bordo", behavior: "Comportamento", commitThreshold: "Soglia di conferma", colorTransition: "Transizione colore", progressive: "Progressiva", instant: "Immediata", initialSelection: "Selezione iniziale", options: "Opzioni", selectOption: "Seleziona {option}", colorPicker: "{label}: selettore colore", hexValue: "{label}: valore esadecimale",
    borderStyles: { none: "Nessuno", solid: "Continuo", dashed: "Tratteggiato", dotted: "Punteggiato", double: "Doppio" }, defaults: { title: "Dopo aver caricato un file", optionA: "Mantieni l’originale", optionB: "Sostituiscilo con la nuova versione" },
  },
  pt: {
    ...en,
    metaTitle: "Configurador Behavior Rocker", metaDescription: "Configura e testa o Behavior Rocker, um controlo de duas opções mais claro para decisões que vão além de ligado ou desligado.", customize: "Ir para as propriedades do controlo", language: "Mudar idioma", configurator: "Configurador", introLabel: "Configurador interativo do componente", introLead: "Algumas decisões são binárias sem serem ligar ou desligar.", intro1: "Uma caixa de seleção é excelente para confirmar uma afirmação e um interruptor é eficiente quando uma funcionalidade está simplesmente ligada ou desligada. Ambos se tornam ambíguos quando cada estado produz um comportamento diferente: uma única etiqueta tem de explicar duas consequências e a pessoa precisa de recordar o que «ligado» significa naquele contexto.", intro2: "O Behavior Rocker torna visível a própria decisão. Ambos os resultados permanecem no ecrã e são escritos como ações completas, em vez de escondidos num estado booleano. É possível selecionar diretamente qualquer lado, usar o teclado ou os controlos direcionais, ou arrastar o pivô por todo o percurso. O feedback progressivo antecipa o destino e um limiar configurável determina quando o novo comportamento é confirmado.", intro3: "A proposta é intencionalmente mais explícita do que um interruptor convencional. Troca um pouco de espaço por uma intenção mais clara, menos erros de interpretação e maior confiança em ações como manter ou substituir, partilhar ou restringir, preservar ou transformar. Utilize-o quando ambas as escolhas merecem um nome; mantenha o interruptor familiar quando a decisão for realmente apenas ligada ou desligada.",
    intro4: "O Behavior Rocker é mais do que uma demonstração: é um controlo reutilizável. Aqui pode personalizar o conteúdo, o aspeto e a interação, descarregar o código gerado e utilizá-lo em qualquer site ou aplicação. Está disponível sob a licença MIT, pelo que pode usá-lo, modificá-lo e partilhá-lo de acordo com os termos da licença.",
    reset: "Repor", copied: "Copiado", copy: "Copiar configuração", codeExportLabel: "Código pronto a usar", codeExportTitle: "Use-o na sua app", codeExportDescription: "Escolha um framework comum e copie um componente autónomo com as personalizações atuais já aplicadas.", codeFormat: "Formato do código", copyCode: "Copiar código", codeCopied: "Código copiado", generatedCode: "Código Behavior Rocker gerado", codeExportNote: "O componente gerado não depende de outra biblioteca de interface e emite um evento change com a opção selecionada.", livePreview: "Pré-visualização", tryControl: "Experimentar o controlo", previewSize: "Tamanho da vista", wide: "Larga", mobile: "Móvel", toCommit: "{value}% para confirmar", progressiveTransition: "Transição progressiva", instantChange: "Mudança imediata", insideLabels: "Etiquetas interiores", outsideLabels: "Etiquetas exteriores", properties: "Propriedades do controlo", content: "Conteúdo", title: "Título", optionA: "Opção A", optionB: "Opção B", labelPlacement: "Posição das etiquetas", inside: "Dentro", outside: "Fora", geometry: "Geometria", orientation: "Orientação", auto: "Automática", horizontal: "Horizontal", vertical: "Vertical", density: "Densidade", compact: "Compacta", comfortable: "Confortável", spacious: "Espaçosa", radius: "Raio", color: "Cor", scheme: "Esquema", monochrome: "Monocromático", perOption: "Por opção", activeColor: "Cor ativa", optionAColor: "Cor da opção A", optionBColor: "Cor da opção B", surface: "Superfície", text: "Texto", canvas: "Fundo", handle: "Pivô", icons: "Ícones", outerBorder: "Contorno exterior", innerDivider: "Divisor interior", selectionBorder: "Contorno da seleção", style: "Estilo", width: "Largura", showBorder: "Mostrar contorno", behavior: "Comportamento", commitThreshold: "Limiar de confirmação", colorTransition: "Transição de cor", progressive: "Progressiva", instant: "Imediata", initialSelection: "Seleção inicial", options: "Opções", selectOption: "Selecionar {option}", colorPicker: "{label}: seletor de cor", hexValue: "{label}: valor hexadecimal",
    borderStyles: { none: "Nenhum", solid: "Contínuo", dashed: "Tracejado", dotted: "Pontilhado", double: "Duplo" }, defaults: { title: "Depois de carregar um ficheiro", optionA: "Manter o original", optionB: "Substituí-lo pela nova versão" },
  },
};

const I18nContext = createContext(null);

function resolve(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function interpolate(value, variables = {}) {
  return String(value).replace(/\{(\w+)\}/g, (_, key) => variables[key] ?? "");
}

function initialLocale() {
  if (typeof window === "undefined") return "en";
  const requested = new URLSearchParams(window.location.search).get("lang")?.toLowerCase().split(/[-_]/)[0];
  if (translations[requested]) return requested;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (translations[saved]) return saved;
  const browserLocale = navigator.language?.slice(0, 2).toLowerCase();
  return translations[browserLocale] ? browserLocale : "en";
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(initialLocale);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.title = translations[locale].metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", translations[locale].metaDescription);
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: (key, variables) => interpolate(resolve(translations[locale], key) ?? resolve(en, key) ?? key, variables),
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
