import { describe, it, expect, vi } from 'vitest';

// Mock ethers so we can control Contract behavior without mutating module exports
vi.mock('ethers', async () => {
  const actual = await vi.importActual<any>('ethers');
  return {
    ...actual,
    Contract: vi.fn(() => ({
      balanceOf: async () => actual.parseUnits('123.45', 18),
    })),
    parseUnits: actual.parseUnits,
    formatUnits: actual.formatUnits,
  };
});

import * as web3 from '../web3';

describe('web3 helpers', () => {
  it('getShmBalance throws when no code at address', async () => {
    const fakeProvider: any = {
      getCode: vi.fn().mockResolvedValue('0x'),
    };

    await expect(web3.getShmBalance(fakeProvider, '0xabc')).rejects.toThrow(/No contract found/);
  });

  it('getShmBalance returns formatted balance when contract exists', async () => {
    const fakeProvider: any = {
      getCode: vi.fn().mockResolvedValue('0x6000356000'),
    };

    const res = await web3.getShmBalance(fakeProvider, '0xabc');
    expect(res).toBe('123.45');
  });
});
