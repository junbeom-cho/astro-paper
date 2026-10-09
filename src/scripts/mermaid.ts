// Renders ```mermaid code blocks, which Shiki leaves untouched
// (markdown.syntaxHighlight.excludeLangs in astro.config.ts).
// The mermaid bundle is only downloaded on pages that contain a diagram.
type Mermaid = (typeof import("mermaid"))["default"];

let mermaidPromise: Promise<Mermaid> | undefined;
let queue = Promise.resolve();
let idCounter = 0;

// Show the diagram source instead of a blank space.
function showSource(diagram: HTMLElement): void {
  const pre = document.createElement("pre");
  pre.className = "text-foreground border border-border";
  pre.textContent = diagram.dataset.source ?? "";
  diagram.replaceChildren(pre);
}

// t of color a over color b, both "#rrggbb"
function mix(a: string, b: string, t: number): string {
  const channel = (hex: string, i: number) => parseInt(hex.slice(i, i + 2), 16);
  return `#${[1, 3, 5]
    .map(i =>
      Math.round(channel(a, i) * t + channel(b, i) * (1 - t))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

// Mermaid's "base" theme is the only one that takes custom colors, and only
// as hex, so the site's palette (theme.css, kept as #rrggbb) is read at render time.
function themeVariables(darkMode: boolean) {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string) => css.getPropertyValue(`--${name}`).trim();
  const accent = token("accent");
  const background = token("background");
  return {
    darkMode,
    background,
    primaryColor: mix(accent, background, 0.15),
    primaryBorderColor: accent,
    primaryTextColor: token("foreground"),
    textColor: token("foreground"),
    lineColor: token("muted-foreground"),
    clusterBkg: token("muted"),
    clusterBorder: token("border"),
    edgeLabelBackground: background,
    // Pie: accent shades instead of the pale hue-rotated defaults (pie5+ keep them)
    pie1: mix(accent, background, 0.5),
    pie2: mix(accent, background, 0.32),
    pie3: mix(accent, background, 0.18),
    pie4: mix(accent, background, 0.08),
    pieSectionTextColor: token("foreground"),
    pieStrokeColor: background,
    pieOuterStrokeColor: token("border"),
    // Gantt: done tasks default to light grey, glaring in dark mode
    doneTaskBkgColor: token("muted"),
    doneTaskBorderColor: token("muted-foreground"),
  };
}

async function renderDiagrams(): Promise<void> {
  document
    .querySelectorAll<HTMLElement>("pre > code.language-mermaid")
    .forEach(code => {
      const diagram = document.createElement("div");
      diagram.className =
        "mermaid-diagram my-6 flex justify-center overflow-x-auto";
      diagram.dataset.source = code.textContent ?? "";
      code.parentElement?.replaceWith(diagram);
    });

  const dark = document.documentElement.dataset.theme === "dark";
  const theme = dark ? "dark" : "light";
  const pending = Array.from(
    document.querySelectorAll<HTMLElement>(".mermaid-diagram")
  ).filter(diagram => diagram.dataset.renderedTheme !== theme);
  if (pending.length === 0) return;

  // Same font as the body text. Mermaid sizes label boxes by measuring text,
  // so load the glyphs first or labels overflow once the font swaps in.
  const fontFamily = getComputedStyle(document.body).fontFamily;
  const sources = pending.map(diagram => diagram.dataset.source).join("");
  await document.fonts.load(`16px ${fontFamily}`, sources);

  mermaidPromise ??= import("mermaid").then(m => m.default);
  const mermaid = await mermaidPromise;
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: themeVariables(dark),
    fontFamily,
    suppressErrorRendering: true,
  });

  for (const diagram of pending) {
    const source = diagram.dataset.source ?? "";
    try {
      const { svg } = await mermaid.render(`mermaid-${idCounter++}`, source);
      diagram.innerHTML = svg;
    } catch {
      showSource(diagram); // invalid diagram
    }
    diagram.dataset.renderedTheme = theme;
  }
}

// Serialize runs: page loads and theme toggles can fire back to back.
function scheduleRender(): void {
  queue = queue.then(renderDiagrams).catch(() => {
    // The mermaid chunk failed to load: show the sources for now and forget
    // the failed import so the next run retries.
    document
      .querySelectorAll<HTMLElement>(".mermaid-diagram:empty")
      .forEach(showSource);
    mermaidPromise = undefined;
  });
}

document.addEventListener("astro:page-load", scheduleRender);
new MutationObserver(scheduleRender).observe(document.documentElement, {
  attributeFilter: ["data-theme"],
});
