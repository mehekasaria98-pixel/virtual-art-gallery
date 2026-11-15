import { formatRange, overlaps } from './eras';
import { getRegion, type RegionId } from './regions';
import { STYLES, type Style, type StyleId } from './styles';

export interface StyleCompat {
  style: Style;
  compatible: boolean;
  /** Higher = more relevant to the current era/region selection. */
  score: number;
  /** Why it is not compatible (shown as a tooltip). */
  reason?: string;
}

/**
 * Rank styles against the current era and region selection.
 *
 * Styles are never hidden, only greyed out with a reason, so users can still
 * pick them deliberately (e.g. to see Japonisme-influenced European prints).
 */
export function rankStyles(regions: RegionId[], from: number | null, to: number | null): StyleCompat[] {
  return (STYLES as readonly Style[])
    .map((style) => {
      const eraOk = overlaps(style.from, style.to, from, to);
      const regionOk =
        regions.length === 0 || style.regions.length === 0 || style.regions.some((r) => regions.includes(r));
      let reason: string | undefined;
      if (!eraOk && !regionOk) {
        reason = `Active ${formatRange(style.from, style.to)}, mainly in ${regionList(style)}`;
      } else if (!eraOk) {
        reason = `Active ${formatRange(style.from, style.to)}, outside your era`;
      } else if (!regionOk) {
        reason = `Mainly found in ${regionList(style)}`;
      }
      const score =
        (eraOk ? 2 : 0) +
        (regionOk ? 2 : 0) +
        (regions.length > 0 && style.regions.some((r) => regions.includes(r)) ? 1 : 0) +
        (from !== null || to !== null ? eraTightness(style, from, to) : 0);
      return { style, compatible: eraOk && regionOk, score, reason };
    })
    .sort((a, b) => b.score - a.score);
}

export function isCompatible(id: StyleId, regions: RegionId[], from: number | null, to: number | null): boolean {
  return rankStyles(regions, from, to).find((c) => c.style.id === id)?.compatible ?? false;
}

function regionList(style: Style): string {
  if (style.regions.length === 0) return 'all regions';
  return style.regions.map((r) => getRegion(r).label).join(', ');
}

/** 0..1 — share of the selected window covered by the style's active years. */
function eraTightness(style: Style, from: number | null, to: number | null): number {
  const lo = Math.max(style.from, from ?? style.from);
  const hi = Math.min(style.to, to ?? style.to);
  if (hi < lo) return 0;
  const window = (to ?? style.to) - (from ?? style.from) + 1;
  return window > 0 ? Math.min(1, (hi - lo + 1) / window) : 0;
}
