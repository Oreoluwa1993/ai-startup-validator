import { PitchCreationAgent } from '../PitchCreationAgent';

describe('PitchCreationAgent', () => {
  let agent: PitchCreationAgent;

  beforeEach(() => {
    agent = new PitchCreationAgent();
  });

  test('creates a pitch with standard template', async () => {
    const data = {
      problem: 'Test problem',
      solution: 'Test solution',
      market: 'Test market'
    };

    const pitch = await agent.createPitch(data);
    expect(pitch).toContain('## Problem');
    expect(pitch).toContain('## Solution');
    expect(pitch).toContain('## Market Size');
  });

  test('throws error for invalid template', async () => {
    const data = {};
    await expect(agent.createPitch(data, 'invalid')).rejects.toThrow();
  });
});