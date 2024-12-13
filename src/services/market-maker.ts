import { Connection, Keypair, Transaction } from '@solana/web3.js';
import { Market, Liquidity, MAINNET_PROGRAM_ID } from '@raydium-io/raydium-sdk';
import { CONFIG } from '../config';
import type { MarketMakingStrategy, PoolState } from '../types/market-maker';

export class MarketMaker {
  private connection: Connection;
  private keypair: Keypair;
  
  constructor() {
    this.connection = new Connection(CONFIG.HELIUS_RPC_URL);
    this.keypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(CONFIG.PRIVATE_KEY))
    );
  }
  
  calculateStrategy(poolState: PoolState): MarketMakingStrategy {
    const currentPrice = poolState.price;
    const spread = Math.max(
      CONFIG.MIN_SPREAD,
      Math.min(CONFIG.MAX_SPREAD, 1 / Math.sqrt(poolState.baseReserve))
    );
    
    return {
      bidPrice: currentPrice * (1 - spread),
      askPrice: currentPrice * (1 + spread),
      bidSize: CONFIG.ORDER_SIZE,
      askSize: CONFIG.ORDER_SIZE,
      spreadPercentage: spread * 100
    };
  }
  
  async executeTrades(strategy: MarketMakingStrategy) {
    try {
      // Get pool info first
      const poolInfo = await Liquidity.fetchMultipleInfo({
        connection: this.connection,
        programId: MAINNET_PROGRAM_ID.LIQUIDITY_POOL_PROGRAM_ID_V4,
        poolKeys: [{ id: CONFIG.RAYDIUM_POOL }],
      });

      // Use the pool info to get the associated market address
      const pool = poolInfo[0];
      const market = await Market.load(
        this.connection,
        pool.marketId,
        {}, // market options
        MAINNET_PROGRAM_ID.LIQUIDITY_POOL_PROGRAM_ID_V4
      );
      
      // Create and sign swap transaction
      const swapTransaction = new Transaction();
      
      // Use the market to create orders (example)
      const { bidPrice, askPrice, bidSize, askSize } = strategy;
      swapTransaction.add(
        await market.makePlaceOrderInstruction({
          owner: this.keypair.publicKey,
          price: bidPrice,
          size: bidSize,
          side: 'buy'  // or 'sell' for ask orders
        })
      );
      
      const signature = await this.connection.sendTransaction(
        swapTransaction,
        [this.keypair]
      );
      
      await this.connection.confirmTransaction(signature);
      
      return signature;
    } catch (error) {
      console.error('Error executing trades:', error);
      throw error;
    }
  }
}