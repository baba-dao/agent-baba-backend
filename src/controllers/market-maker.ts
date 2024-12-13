import type { Context } from 'hono';
import { PoolMonitor } from '../services/pool-monitor';
import { MarketMaker } from '../services/market-maker';

const poolMonitor = new PoolMonitor();
const marketMaker = new MarketMaker();

export async function getPoolState(c: Context) {
  try {
    const poolState = await poolMonitor.getPoolState();
    return c.json({
      success: true,
      data: poolState
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, 500);
  }
}

export async function getStrategy(c: Context) {
  try {
    const poolState = await poolMonitor.getPoolState();
    const strategy = marketMaker.calculateStrategy(poolState);
    return c.json({
      success: true,
      data: strategy
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, 500);
  }
}
