import { describe, it, expect } from 'vitest';

import { cn } from '@web/lib/utils';

describe('cn', () => {
  it('merges tailwind classes and resolves conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles conditional classes', () => {
    const hide = false;
    const show = true;
    expect(cn('base', hide && 'hidden', show && 'block')).toBe('base block');
  });
});
