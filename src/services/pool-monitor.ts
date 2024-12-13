import { Connection, PublicKey } from '@solana/web3.js';
import { Market, MAINNET_PROGRAM_ID } from '@raydium-io/raydium-sdk';
import { CONFIG } from '../config';
import { PoolState } from '../types/market-maker';

export class PoolMonitor {
  private connection: Connection;
  
  constructor() {
    this.connection = new Connection(CONFIG.HELIUS_RPC_URL);
  }
  
  async getPoolState(): Promise<PoolState> {
    try {
      const poolInfo = await Market.fetchMultipleInfo({
        connection: this.connection,
        programId: MAINNET_PROGRAM_ID.LIQUIDITY_POOL_PROGRAM_ID_V4,
        pools: [{ id: CONFIG.RAYDIUM_POOL }],
      });
      
      const pool = poolInfo[0];
      
      return {
        baseReserve: pool.baseReserve.toNumber(),
        quoteReserve: pool.quoteReserve.toNumber(),
        lpSupply: pool.lpSupply.toNumber(),
        price: pool.quoteReserve.toNumber() / pool.baseReserve.toNumber()
      };
    } catch (error) {
      console.error('Error fetching pool state:', error);
      throw error;
    }
  }
}