export interface TokenHolder {
  address: string
  amount: number
  decimals: number
  totalSupply: number
  percentOwned: string
  percentOwnedNumber: number
  formattedAmount: string
  value: string
  label: string
}

export interface TokenInfo {
  programId: string
  isToken2022: boolean
  mintInfo: {
    supply: bigint
    decimals: number
  }
}

export interface TokenAuthorities {
  mintAuthority: string | null
  freezeAuthority: string | null
  isMintAuthDisabled: boolean
  isFreezeAuthDisabled: boolean
}

export interface TokenPrice {
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
}

export interface DexPair {
  liquidity: {
    usd: number
  }
  priceUsd: string
  priceChange24h: string
  volume24h: string
}

export interface RaydiumPoolInfo {
  id: string
  authority: string
  marketAuthority: string
  bestDexScannerPoolId: string
}

export interface TopHoldersResponse {
  sortedHolders: TokenHolder[]
  activeAddresses: any[]
  totalPercentageHeld: number
  isTop10HolderSafe: boolean
  riskThreshold: number
}
