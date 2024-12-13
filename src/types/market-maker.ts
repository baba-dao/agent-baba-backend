export interface PoolState {
  baseReserve: number;
  quoteReserve: number;
  lpSupply: number;
  price: number;
}

export interface MarketMakingStrategy {
  bidPrice: number;
  askPrice: number;
  bidSize: number;
  askSize: number;
  spreadPercentage: number;
}