import { computeEligibilityScore, getXAIReasons } from './eligibility.js';

describe('computeEligibilityScore', () => {
  it('returns a number between 0 and 100', () => {
    const score = computeEligibilityScore({
      daysSinceLastDonation: 100,
      distanceKm: 5,
      isAvailableNow: true,
      healthFlags: [],
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('gives higher score when available and far since donation', () => {
    const high = computeEligibilityScore({
      daysSinceLastDonation: 120,
      distanceKm: 2,
      isAvailableNow: true,
      healthFlags: [],
    });
    const low = computeEligibilityScore({
      daysSinceLastDonation: 10,
      distanceKm: 50,
      isAvailableNow: false,
      healthFlags: ['recent_illness'],
    });
    expect(high).toBeGreaterThan(low);
  });
});

describe('getXAIReasons', () => {
  it('returns array of strings', () => {
    const reasons = getXAIReasons({
      daysSinceLastDonation: 100,
      distanceKm: 3,
      isAvailableNow: true,
      eligibilityScore: 85,
    });
    expect(Array.isArray(reasons)).toBe(true);
    reasons.forEach((r) => expect(typeof r).toBe('string'));
  });

  it('includes proximity when distance is small', () => {
    const reasons = getXAIReasons({
      daysSinceLastDonation: 90,
      distanceKm: 1,
      isAvailableNow: true,
      eligibilityScore: 90,
    });
    expect(reasons.some((r) => r.toLowerCase().includes('proximity') || r.toLowerCase().includes('near'))).toBe(true);
  });
});
