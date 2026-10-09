import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Font } from "satori";

// satori can't read woff2, so OG images use the full Pretendard woff files
// shipped in the npm package. They are read at build time only.
const FONT_DIR = join(
  process.cwd(),
  "node_modules/pretendard/dist/web/static/woff"
);

const load = async (): Promise<Font[]> => {
  const [regular, bold] = await Promise.all([
    readFile(join(FONT_DIR, "Pretendard-Regular.woff")),
    readFile(join(FONT_DIR, "Pretendard-Bold.woff")),
  ]);
  return [
    { name: "Pretendard", data: regular, weight: 400, style: "normal" },
    { name: "Pretendard", data: bold, weight: 700, style: "normal" },
  ];
};

let fonts: Promise<Font[]> | undefined;

/** Pretendard 400/700 for satori, loaded once per build. */
export const loadOgFonts = () => (fonts ??= load());
