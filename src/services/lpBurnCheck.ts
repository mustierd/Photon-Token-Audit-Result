// File moved from src/services/lpBurnCheck.ts tosrc/pumpfun/lpBurnCheck.ts
import { Connection, PublicKey } from '@solana/web3.js'
import { getMint, getAccount } from '@solana/spl-token'

export async function checkLPBurned(
  connection: Connection,
  lpTokenAddress: string
) {
  try {
    const lpTokenPubkey = new PublicKey(lpTokenAddress)
    const lpMintInfo = await getMint(connection, lpTokenPubkey)

    // Dead address'e gönderilen LP token miktarını kontrol et
    const deadAddress = new PublicKey(
      '1nc1nerator11111111111111111111111111111111'
    )
    const burnedAccount = await getAccount(
      connection,
      deadAddress,
      'confirmed'
    ).catch(() => null)

    return {
      isLPBurned: burnedAccount !== null && Number(burnedAccount.amount) > 0,
      burnedAmount: burnedAccount ? Number(burnedAccount.amount) : 0,
      totalSupply: Number(lpMintInfo.supply),
    }
  } catch (error) {
    console.error('LP burn kontrolü hatası:', error)
    throw error
  }
}
