import { normalizeHealthToFlags } from './healthNlp.js';

describe('normalizeHealthToFlags', () => {
  it('returns empty array for empty or null', () => {
    expect(normalizeHealthToFlags('')).toEqual([]);
    expect(normalizeHealthToFlags(null)).toEqual([]);
  });

  it('detects recent_illness from synonyms', () => {
    expect(normalizeHealthToFlags('I was ill last week')).toContain('recent_illness');
    expect(normalizeHealthToFlags('had fever')).toContain('recent_illness');
    expect(normalizeHealthToFlags('no illness')).toContain('recent_illness');
  });

  it('detects diabetes', () => {
    expect(normalizeHealthToFlags('diabetic')).toContain('diabetes');
    expect(normalizeHealthToFlags('blood sugar high')).toContain('diabetes');
  });

  it('returns multiple flags when multiple match', () => {
    const r = normalizeHealthToFlags('diabetes and fever');
    expect(r).toContain('diabetes');
    expect(r).toContain('recent_illness');
    expect(r.length).toBeGreaterThanOrEqual(2);
  });
});
