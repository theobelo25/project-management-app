import { describe, it, expect } from 'vitest';

import { getInitials } from '@web/components/projects/utils/string';

describe('getInitials', () => {
  it('returns up to two uppercase letters from words', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL');
  });

  it('handles single names', () => {
    expect(getInitials('Cher')).toBe('C');
  });

  it('truncates to two characters for long names', () => {
    expect(getInitials('One Two Three Four')).toBe('OT');
  });
});
