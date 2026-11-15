/**
 * Time model: centuries, decades and named periods.
 *
 * Years are integers; negative numbers are BCE. There is no year 0 in the
 * historical calendar, but museum APIs commonly use 0 / -1 loosely, so we treat
 * ranges as inclusive and tolerant.
 */

export const MIN_YEAR = -3000;
export const MAX_YEAR = new Date().getFullYear();

export interface Century {
  /** 1-based ordinal; negative for BCE (e.g. -5 = 5th century BCE). */
  n: number;
  label: string;
  short: string;
  from: number;
  to: number;
}

export interface Decade {
  from: number;
  to: number;
  label: string;
}

export interface NamedPeriod {
  id: string;
  label: string;
  from: number;
  to: number;
  blurb: string;
}

export function ordinal(n: number): string {
  const abs = Math.abs(n);
  const mod100 = abs % 100;
  const suffix =
    mod100 >= 11 && mod100 <= 13 ? 'th' : abs % 10 === 1 ? 'st' : abs % 10 === 2 ? 'nd' : abs % 10 === 3 ? 'rd' : 'th';
  return `${abs}${suffix}`;
}

/** Century n → year range. 19th century = 1801–1900 strictly, but art history uses 1800–1899; we follow art history. */
export function centuryRange(n: number): { from: number; to: number } {
  if (n > 0) return { from: (n - 1) * 100, to: n * 100 - 1 };
  // BCE: 5th century BCE = -499 … -400 (written 500–401 BCE)
  const abs = Math.abs(n);
  return { from: -abs * 100 + 1, to: -(abs - 1) * 100 };
}

export function centuryOf(year: number): number {
  if (year >= 0) return Math.floor(year / 100) + 1;
  return -(Math.floor((Math.abs(year) - 1) / 100) + 1);
}

export function centuryLabel(n: number): string {
  return n > 0 ? `${ordinal(n)} century` : `${ordinal(n)} century BCE`;
}

export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year}`;
}

export function formatRange(from: number | null, to: number | null): string {
  if (from === null && to === null) return 'Any time';
  if (from !== null && to !== null) {
    if (from < 0 && to < 0) return `${Math.abs(from)}–${Math.abs(to)} BCE`;
    return `${formatYear(from)} – ${formatYear(to)}`;
  }
  if (from !== null) return `From ${formatYear(from)}`;
  return `Up to ${formatYear(to!)}`;
}

/** Centuries offered in the timeline strip (BCE ones are grouped coarsely). */
export const CENTURIES: Century[] = (() => {
  // Deep antiquity is grouped into millennia/half-millennia; museum dating is coarse there.
  const list: Century[] = [
    { n: -30, label: '3rd millennium BCE', short: '3000 BCE', from: -3000, to: -2001 },
    { n: -20, label: '2nd millennium BCE', short: '2000 BCE', from: -2000, to: -1001 },
    { n: -10, label: '1000–501 BCE', short: '1000 BCE', from: -1000, to: -501 },
  ];
  for (const n of [-5, -4, -3, -2, -1]) {
    list.push({ n, label: centuryLabel(n), short: `${ordinal(n)} BCE`, ...centuryRange(n) });
  }
  const current = centuryOf(MAX_YEAR);
  for (let n = 1; n <= current; n++) {
    const { from, to } = centuryRange(n);
    list.push({ n, label: centuryLabel(n), short: `${ordinal(n)} c.`, from, to: Math.min(to, MAX_YEAR) });
  }
  return list;
})();

/** Decades inside a CE century (BCE centuries return []). */
export function decadesOf(centuryN: number): Decade[] {
  if (centuryN <= 0) return [];
  const { from } = centuryRange(centuryN);
  const out: Decade[] = [];
  for (let y = from; y < from + 100 && y <= MAX_YEAR; y += 10) {
    out.push({ from: y, to: Math.min(y + 9, MAX_YEAR), label: `${y}s` });
  }
  return out;
}

export const NAMED_PERIODS: NamedPeriod[] = [
  { id: 'ancient', label: 'Ancient', from: -3000, to: 499, blurb: 'Early civilisations to late antiquity.' },
  { id: 'medieval', label: 'Medieval', from: 500, to: 1399, blurb: 'Roughly 500–1400: Byzantine, Islamic golden age, Tang–Song, Gothic.' },
  { id: 'renaissance', label: 'Renaissance', from: 1400, to: 1599, blurb: 'The 15th and 16th centuries.' },
  { id: 'early-modern', label: 'Early modern', from: 1600, to: 1799, blurb: 'Baroque to Enlightenment; Mughal, Edo and Qing courts.' },
  { id: 'long-19th', label: '19th century', from: 1800, to: 1899, blurb: 'Romanticism, Realism, Impressionism, ukiyo-e prints.' },
  { id: 'modern', label: 'Modern', from: 1900, to: 1969, blurb: 'The avant-gardes and mid-century modernisms worldwide.' },
  { id: 'contemporary', label: 'Contemporary', from: 1970, to: MAX_YEAR, blurb: '1970 to today.' },
];

export function clampYear(y: number): number {
  return Math.max(MIN_YEAR, Math.min(MAX_YEAR, Math.round(y)));
}

/** Does [aFrom,aTo] overlap [bFrom,bTo]? Nulls mean open-ended. */
export function overlaps(
  aFrom: number | null,
  aTo: number | null,
  bFrom: number | null,
  bTo: number | null,
): boolean {
  const lo = Math.max(aFrom ?? -Infinity, bFrom ?? -Infinity);
  const hi = Math.min(aTo ?? Infinity, bTo ?? Infinity);
  return lo <= hi;
}
