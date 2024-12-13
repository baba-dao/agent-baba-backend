import { PublicKey } from '@solana/web3.js';

export const CONFIG = {
  HELIUS_RPC_URL: process.env.HELIUS_RPC_URL || '',
  PRIVATE_KEY: process.env.PRIVATE_KEY || '',
  
  // Addresses from the green paper
  BABABILL_TOKEN: new PublicKey('39xVYiSXUAed2ksrr7KJLxJfbsM9TL7Cs8MMEsKZuABX'),
  RAYDIUM_POOL: new PublicKey('GtveJQpWcUY4PENc9CxnBws5ccMF5VvnGohrj1enUzfr'),
  
  // Market Making Parameters
  MIN_SPREAD: 0.002, // 0.2%
  MAX_SPREAD: 0.02,  // 2%
  ORDER_SIZE: 100,   // Base size for orders
  REFRESH_INTERVAL: 10000, // 10 seconds
  MAX_SLIPPAGE: 0.01 // 1%
};