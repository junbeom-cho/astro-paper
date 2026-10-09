// Rough reading speeds: Korean is counted per syllable, everything else per word.
const HANGUL_PER_MINUTE = 500;
const WORDS_PER_MINUTE = 200;

const HANGUL = /[가-힣]/g;

/** Estimated minutes to read a post's markdown body (at least 1). */
export function getReadingTime(body = ""): number {
  const hangul = body.match(HANGUL)?.length ?? 0;
  const words = body.replace(HANGUL, " ").match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  return Math.max(
    1,
    Math.round(hangul / HANGUL_PER_MINUTE + words / WORDS_PER_MINUTE)
  );
}
