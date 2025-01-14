import axios from 'axios'

interface TokenPrice {
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
}

interface DexPair {
  liquidity: {
    usd: number
  }
  priceUsd: string
  priceChange24h: string
  volume24h: string
}

export async function getDexScreenerPrice(
  tokenAddress: string
): Promise<TokenPrice> {
  try {
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
    )

    const pairs = response.data.pairs as DexPair[]
    if (!pairs || pairs.length === 0) {
      throw new Error('Pair not found')
    }

    const bestPair = pairs.sort(
      (a: DexPair, b: DexPair) => b.liquidity.usd - a.liquidity.usd
    )[0]

    return {
      price: Number(bestPair.priceUsd || 0),
      priceChange24h: Number(bestPair.priceChange24h || 0),
      volume24h: Number(bestPair.volume24h || 0),
      liquidity: Number(bestPair.liquidity?.usd || 0),
    }
  } catch (error) {
    return {
      price: 0,
      priceChange24h: 0,
      volume24h: 0,
      liquidity: 0,
    }
  }
}
