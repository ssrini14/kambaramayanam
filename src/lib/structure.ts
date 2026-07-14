/**
 * Canonical skeleton of Kamba Ramayanam's six kaandams, in narrative order.
 *
 * The TOC drawer renders this full skeleton so visitors see the scope of the
 * whole epic; kaandams (and padalams) with no verses yet are shown with a
 * "Content to be added" marker. The `name` MUST match the `kandam` field used
 * in verse frontmatter so real content merges into the right kaandam.
 */
export interface Kaandam {
  /** Display name — must match verse frontmatter `kandam`. */
  name: string;
  /** Tamil name for display. */
  tamil: string;
  /**
   * Known padalams in narrative order. Seed these as they are VERIFIED against a
   * printed edition — do not fabricate names/counts. A padalam listed here with
   * no verses yet renders under a "Content to be added" marker; padalams that
   * appear only in verse frontmatter are merged in automatically. Names MUST
   * match verse frontmatter `padalam` so real content merges correctly.
   */
  padalams?: readonly string[];
}

export const KAANDAMS: readonly Kaandam[] = [
  { name: 'Bala Kandam', tamil: 'பால காண்டம்' },
  { name: 'Ayodhya Kandam', tamil: 'அயோத்தியா காண்டம்' },
  { name: 'Aranya Kandam', tamil: 'ஆரண்ய காண்டம்' },
  { name: 'Kishkindha Kandam', tamil: 'கிட்கிந்தா காண்டம்' },
  { name: 'Sundara Kandam', tamil: 'சுந்தர காண்டம்' },
  { name: 'Yuddha Kandam', tamil: 'யுத்த காண்டம்' },
];
