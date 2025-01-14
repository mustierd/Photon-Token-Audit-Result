import { Connection, PublicKey } from '@solana/web3.js'
import { getMint, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

export async function checkTokenAuthorities(
  connection: Connection,
  mintAddress: string
): Promise<{
  isMintAuthDisabled: boolean
  isFreezeAuthDisabled: boolean
  mintAuthority: string | null
  freezeAuthority: string | null
  isToken2022: boolean
}> {
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
      isMintAuthDisabled: mintInfo.mintAuthority === null,
      isFreezeAuthDisabled: mintInfo.freezeAuthority === null,
      mintAuthority: mintInfo.mintAuthority?.toBase58() || null,
      freezeAuthority: mintInfo.freezeAuthority?.toBase58() || null,
      isToken2022: programId.equals(TOKEN_2022_PROGRAM_ID),
    }
  } catch (error) {
    console.error('Token authorization check error:', error)
    throw error
  }
}
