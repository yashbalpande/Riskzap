import { describe, it, expect, vi } from 'vitest';
import * as web3 from '../web3';
import { ethers } from 'ethers';

describe('web3 helpers', () => {
  it('getShmBalance throws when no code at address', async () => {
    const fakeProvider: any = {
      getCode: vi.fn().mockResolvedValue('0x'),
    };

    await expect(web3.getShmBalance(fakeProvider, '0xabc')).rejects.toThrow(/No contract found/);
  });

  it('getShmBalance returns formatted balance when contract exists', async () => {
    const fakeRaw = ethers.parseUnits('123.45', 18);

    const abiCoder = new (ethers as any).AbiCoder();
    const encoded = abiCoder.encode(['uint256'], [fakeRaw]);

    const fakeProvider: any = {
      getCode: vi.fn().mockResolvedValue('0x6000356000'),
      // emulate provider.call to return encoded uint256 result for balanceOf
      call: vi.fn(async () => encoded),
    };

  const res = await web3.getShmBalance(fakeProvider, '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    expect(res).toBe('123.45');
  });
});
