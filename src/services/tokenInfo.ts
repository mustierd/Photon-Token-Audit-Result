import { Connection, PublicKey } from '@solana/web3.js'
import {
  getMint,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'

export async function getTokenInfo(
  connection: Connection,
  mintAddress: string
) {
  try {
    const mintPubkey = new PublicKey(mintAddress)

    const accountInfo = await connection.getAccountInfo(mintPubkey)
    if (!accountInfo) throw new Error('Token information not found')

    const programId = accountInfo.owner

    const mintInfo = await getMint(
      connection,
      mintPubkey,
      'confirmed',
      programId
    )

    return {
      mintInfo,
      programId: programId.toBase58(),
      isToken2022: programId.equals(TOKEN_2022_PROGRAM_ID),
    }
  } catch (error) {
    console.error('Token bilgileri alınırken hata:', error)
    throw error
  }
}
