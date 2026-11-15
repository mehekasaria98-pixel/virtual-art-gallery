import { describe, expect, it } from 'vitest';
import { EMPTY_QUERY, parseQuery, toSearchParams } from '@/lib/query';

describe('URL query schema', () => {
  it('parses, normalises and drops unknown values', () => {
    const q = parseQuery(
      new URLSearchParams('regions=europe,mars&styles=romanticism,nope&from=1900&to=1800&sources=aic,xyz&pd=1&sort=oldest&q=%20sea%20'),
    );
    expect(q).toEqual({
      regions: ['europe'],
      styles: ['romanticism'],
      sources: ['aic'],
      from: 1800,
      to: 1900,
      q: 'sea',
      openAccess: true,
      sort: 'oldest',
    });
  });

  it('round-trips through toSearchParams', () => {
    const q = parseQuery(new URLSearchParams('regions=africa&from=-500&to=1500&styles=benin-court'));
    expect(parseQuery(toSearchParams(q))).toEqual(q);
  });

  it('omits defaults so links stay short', () => {
    expect(toSearchParams(EMPTY_QUERY).toString()).toBe('');
  });

  it('clamps absurd years', () => {
    expect(parseQuery(new URLSearchParams('from=-99999')).from).toBe(-3000);
  });
});
