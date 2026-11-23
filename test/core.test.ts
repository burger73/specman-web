import { describe, expect, it } from 'vitest';
import { SPECMAN_WEB_VERSION } from '../src/core/index.ts';

describe('core', () => {
  it('lädt', () => {
    expect(SPECMAN_WEB_VERSION).toBe('0.0.1');
  });
});
