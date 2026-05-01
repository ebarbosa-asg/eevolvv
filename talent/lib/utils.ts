/**
 * Class name utility — merges conditional class strings.
 * Replaces the cn() helper formerly imported from @archimedes/lib.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
