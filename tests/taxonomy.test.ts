import { describe, expect, it } from 'vitest';
import { CENTURIES, centuryOf, centuryRange, decadesOf, formatRange, overlaps } from '@/taxonomy/eras';
import { inferRegion, REGIONS } from '@/taxonomy/regions';
import { inferStyles, STYLES, styleFromAic, styleFromWikidata } from '@/taxonomy/styles';
import { rankStyles } from '@/taxonomy/compat';

describe('eras', () => {
  it('maps centuries to art-historical year ranges', () => {
    expect(centuryRange(19)).toEqual({ from: 1800, to: 1899 });
    expect(centuryRange(1)).toEqual({ from: 0, to: 99 });
    expect(centuryRange(-5)).toEqual({ from: -499, to: -400 });
    expect(centuryOf(1850)).toBe(19);
    expect(centuryOf(-450)).toBe(-5);
  });

  it('derives ten decades inside a CE century', () => {
    const d = decadesOf(19);
    expect(d).toHaveLength(10);
    expect(d[0]).toEqual({ from: 1800, to: 1809, label: '1800s' });
    expect(decadesOf(-3)).toEqual([]);
  });

  it('has an ordered century strip', () => {
    for (let i = 1; i < CENTURIES.length; i++) expect(CENTURIES[i]!.from).toBeGreaterThan(CENTURIES[i - 1]!.from);
  });

  it('formats ranges including BCE', () => {
    expect(formatRange(-500, -401)).toBe('500–401 BCE');
    expect(formatRange(1800, 1899)).toBe('1800 – 1899');
    expect(formatRange(null, null)).toBe('Any time');
  });

  it('detects overlap with open ends', () => {
    expect(overlaps(1800, 1850, 1840, null)).toBe(true);
    expect(overlaps(1800, 1850, 1900, 1950)).toBe(false);
  });
});

describe('regions', () => {
  it('infers regions from museum place text', () => {
    expect(inferRegion('Japan, Edo period (1615–1868)')).toBe('east-asia');
    expect(inferRegion('Africa, West Africa, Nigeria, Ejagham-style maker')).toBe('africa');
    expect(inferRegion('Mughal India')).toBe('south-asia');
    expect(inferRegion('France')).toBe('europe');
    expect(inferRegion('nowhere in particular')).toBeNull();
  });

  it('does not match keywords inside other words', () => {
    expect(inferRegion('Danish')).toBeNull();
  });

  it('gives every region vocabulary for every keyless source', () => {
    for (const r of REGIONS) {
      expect(r.met.length).toBeGreaterThan(0);
      expect(r.aic.length).toBeGreaterThan(0);
      expect(r.cma.length).toBeGreaterThan(0);
      expect(r.vam.length).toBeGreaterThan(0);
      expect(r.wikidataCountries.length).toBeGreaterThan(0);
    }
  });
});

describe('styles', () => {
  it('has unique ids and sane year spans', () => {
    const ids = STYLES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of STYLES) expect(s.from).toBeLessThanOrEqual(s.to);
  });

  it('maps upstream identifiers back to styles', () => {
    expect(styleFromAic('TM-7543')).toBe('impressionism');
    expect(styleFromWikidata('Q37068')).toBe('romanticism');
    expect(styleFromWikidata('Q0')).toBeNull();
  });

  it('infers styles on word boundaries', () => {
    expect(inferStyles('Post-Impressionism')).toEqual(['post-impressionism']);
    expect(inferStyles('Surrealism')).toEqual(['surrealism']);
    expect(inferStyles('Edo period ukiyo-e print')).toContain('ukiyo-e');
  });
});

describe('style compatibility', () => {
  it('ranks Ukiyo-e above Cubism for 18th-century East Asia', () => {
    const ranked = rankStyles(['east-asia'], 1700, 1799);
    const ukiyo = ranked.find((c) => c.style.id === 'ukiyo-e')!;
    const cubism = ranked.find((c) => c.style.id === 'cubism')!;
    expect(ukiyo.compatible).toBe(true);
    expect(cubism.compatible).toBe(false);
    expect(cubism.reason).toMatch(/Active/);
    expect(ranked.indexOf(ukiyo)).toBeLessThan(ranked.indexOf(cubism));
  });

  it('treats everything as compatible with no filters', () => {
    expect(rankStyles([], null, null).every((c) => c.compatible)).toBe(true);
  });
});
