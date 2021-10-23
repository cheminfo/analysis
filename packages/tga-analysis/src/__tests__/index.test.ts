import { fromPerkinElmer } from '..';

describe('tga-measurement', () => {
  it('fromPerkinElmer', () => {
    expect(typeof fromPerkinElmer).toBe('function');
  });
});
