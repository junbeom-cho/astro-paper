// Renders ```mermaid code blocks, which Shiki leaves untouched
// (markdown.syntaxHighlight.excludeLangs in astro.config.ts).
// The mermaid bundle is only downloaded on pages that contain a diagram.
type Mermaid = (typeof import("mermaid"))["default"];

let mermaidPromise: Promise<Mermaid> | undefined;
let queue = Promise.resolve();
let idCounter = 0;

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

  const theme =
    document.documentElement.dataset.theme === "dark" ? "dark" : "default";
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
    theme,
    fontFamily,
    suppressErrorRendering: true,
  });

  for (const diagram of pending) {
    const source = diagram.dataset.source ?? "";
    try {
      const { svg } = await mermaid.render(`mermaid-${idCounter++}`, source);
      diagram.innerHTML = svg;
    } catch {
      // Invalid diagram: show the source instead of a blank space.
      const pre = document.createElement("pre");
      pre.className = "text-foreground border border-border";
      pre.textContent = source;
      diagram.replaceChildren(pre);
    }
    diagram.dataset.renderedTheme = theme;
  }
}

// Serialize runs: page loads and theme toggles can fire back to back.
function scheduleRender(): void {
  queue = queue.then(renderDiagrams).catch(() => {
    // The mermaid chunk failed to load: forget it so the next run retries
    // instead of every later run inheriting the rejection.
    mermaidPromise = undefined;
  });
}

document.addEventListener("astro:page-load", scheduleRender);
new MutationObserver(scheduleRender).observe(document.documentElement, {
  attributeFilter: ["data-theme"],
});
