import type { UIStrings } from "./types";

/** "(page 2)" label shared by breadcrumbs and paginated page titles. */
export function pageLabel(t: UIStrings, page: number | string): string {
  return `(${t.pagination.page.toLowerCase()} ${page})`;
}

/**
 * Replace `{{key}}` placeholders in UI strings.
 * Translators can reorder placeholders freely within the sentence.
 */
export function tplStr(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = vars[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}
