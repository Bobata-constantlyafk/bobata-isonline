export interface ProseBlock {
  type: "p" | "quote";
  text: string;
}

/**
 * Reviews are plain DB text, not files run through the MDX build — there's
 * no compilation step for them. This mirrors just enough of the essay
 * convention (blank line = new paragraph, "> " = pull quote) that writing
 * one feels the same as writing an essay body, without pulling in MDX for
 * a single admin textarea.
 */
export function parseProseBlocks(text: string): ProseBlock[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) =>
      block.startsWith(">")
        ? { type: "quote" as const, text: block.replace(/^>\s?/, "").trim() }
        : { type: "p" as const, text: block },
    );
}
