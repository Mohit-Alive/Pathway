import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes chapter HTML before it is rendered with dangerouslySetInnerHTML.
 *
 * Uses sanitize-html (pure JS, htmlparser2-based) rather than
 * isomorphic-dompurify/jsdom: jsdom pulls in ~20 transitive dependencies
 * with heavy dynamic `require()` usage, which Vercel's serverless
 * function bundler has repeatedly failed to fully trace in production,
 * even when the exact same code works in a local production build. This
 * was the root cause of a 500 on every chapter page in production while
 * every other route (which does not import isomorphic-dompurify) worked
 * fine, including the same auth-gated redirect this route also does.
 *
 * The allowlist below is exactly what the seeded chapter content in
 * lib/courseData.ts actually uses: div, h3, p, ul, ol, li, pre, code,
 * strong, em, span, with only a `class` attribute (for the Tailwind
 * classes on the dark <pre> code blocks).
 */
export function sanitizeChapterHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["div", "h3", "p", "ul", "ol", "li", "pre", "code", "strong", "em", "span"],
    allowedAttributes: {
      "*": ["class"],
    },
  });
}
