import { Hono } from 'hono';
import { logger } from 'hono/logger';  // Updated import
import { getPoolState, getStrategy } from './controllers/market-maker.ts';
import { PoolMonitor } from './services/pool-monitor.ts';
import { MarketMaker } from './services/market-maker.ts';
import { CONFIG } from './config';

const app = new Hono();
app.use('*', logger()); 

// Initialize services
const poolMonitor = new PoolMonitor();
const marketMaker = new MarketMaker();

// Routes
app.get('/api/pool-state', getPoolState);
app.get('/api/strategy', getStrategy);

// Health check
app.get('/health', (c) => c.json({ status: 'healthy' }));

// Market making loop
let isRunning = false;

async function startMarketMaking() {
  if (isRunning) return;
  isRunning = true;
  
  while (isRunning) {
    try {
      const poolState = await poolMonitor.getPoolState();
      const strategy = marketMaker.calculateStrategy(poolState);
      await marketMaker.executeTrades(strategy);
    } catch (error) {
      console.error('Market making error:', error);
    }
    
    await new Promise(resolve => setTimeout(resolve, CONFIG.REFRESH_INTERVAL));
  }
}

// Start market making on server start
startMarketMaking().catch(console.error);

export default {
  port: 3000,
  fetch: app.fetch
};