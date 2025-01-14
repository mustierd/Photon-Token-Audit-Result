import axios from 'axios'
import { Connection, PublicKey } from '@solana/web3.js'
import { LIQUIDITY_STATE_LAYOUT_V4, Liquidity } from '@raydium-io/raydium-sdk'

const RAYDIUM_AMM_V4_PROGRAM_ID = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'

export async function getBondingCurvePDA(mint: string, programId: string) {
  const BONDING_CURVE_SEED = 'bonding-curve'

  return PublicKey.findProgramAddressSync(
    [Buffer.from(BONDING_CURVE_SEED), new PublicKey(mint).toBuffer()],
    new PublicKey(programId)
  )[0]
}

export const findRaydiumPoolInfo = async (
  connection: Connection,
  baseMint: string,
  quoteMint: string
) => {
  try {
    const layout = LIQUIDITY_STATE_LAYOUT_V4

    const pools = await Promise.all([
      fetch(`https://api.dexscreener.com/latest/dex/search?q=${baseMint}`),
      fetch(`https://api.dexscreener.com/latest/dex/search?q=${quoteMint}`),
    ])
    const resp = await Promise.all([...pools.map((x) => x.json())])

    const pairs = resp.flatMap((x) => x.pairs || [])
    const tokenPairs = pairs.filter(
      (x: any) =>
        x.baseToken?.address === baseMint || x.quoteToken?.address === baseMint
    )

    const raydiumPairs = tokenPairs.filter((x: any) => x.dexId === 'raydium')

    const bestDexScannerPoolId = raydiumPairs[0]?.pairAddress

    if (!bestDexScannerPoolId) {
      return
    }

    try {
      const poolAccountInfo = await connection.getAccountInfo(
        new PublicKey(bestDexScannerPoolId)
      )

      if (!poolAccountInfo) {
        console.log('Pool account not found')
        return undefined
      }

      let poolData
      try {
        poolData = layout.decode(poolAccountInfo.data)
      } catch (error) {
        console.log('Error decoding pool data')
        return undefined
      }

      const pool = {
        id: new PublicKey(bestDexScannerPoolId),
        version: 4,
        programId: new PublicKey(RAYDIUM_AMM_V4_PROGRAM_ID),
        ...poolData,
      }

      const authority = Liquidity.getAssociatedAuthority({
        programId: new PublicKey(RAYDIUM_AMM_V4_PROGRAM_ID),
      }).publicKey

      return {
        id: pool.id,
        authority,
        bestDexScannerPoolId,
      }
    } catch (error) {
      console.log('Error processing pool:', error)
      return
    }
  } catch (error) {
    console.error('Error in findRaydiumPoolInfo:', error)
    return
  }
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
