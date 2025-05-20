import { GetBalancesTool } from '../tools/get-balances.js';
import { createOutput } from '../utils/create-output.js';
import { describe, it, expect, jest } from '@jest/globals';
import type { SigningStargateClient } from '@cosmjs/stargate';

describe('GetBalancesTool', () => {
  const mockContext = {
    client: {
      getAllBalances: jest.fn() as jest.MockedFunction<SigningStargateClient['getAllBalances']>,
    },
    wallet: {} as any,
    certificate: {} as any,
  };

  const mockAddress = 'akash1skc28275u3dzwggtj8vmlqw3xpl86ry0f897yt';

  it('returns balances for a valid address', async () => {
    const balances = [{ denom: 'uakt', amount: '1000' }];
    mockContext.client.getAllBalances.mockResolvedValue(balances);

    const params = { address: mockAddress };
    const result = await GetBalancesTool.handler(params, mockContext as any);

    expect(result).toEqual(createOutput(balances));
    expect(mockContext.client.getAllBalances).toHaveBeenCalledWith(mockAddress);
  });

  it('returns error for invalid address', async () => {
    mockContext.client.getAllBalances.mockRejectedValue(new Error('Invalid address'));

    const params = { address: 'invalid' };
    const result = await GetBalancesTool.handler(params, mockContext as any);

    expect(result).toEqual(createOutput({ error: 'Invalid address' }));
  });

  it('returns error for API failure', async () => {
    mockContext.client.getAllBalances.mockRejectedValue(new Error('API failure'));

    const params = { address: mockAddress };
    const result = await GetBalancesTool.handler(params, mockContext as any);

    expect(result).toEqual(createOutput({ error: 'API failure' }));
  });
}); 