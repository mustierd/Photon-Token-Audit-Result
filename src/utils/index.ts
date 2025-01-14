import { PublicKey } from '@solana/web3.js'

export async function getBondingCurvePDA(mint: string, programId: string) {
  const BONDING_CURVE_SEED = 'bonding-curve'

  return PublicKey.findProgramAddressSync(
    [Buffer.from(BONDING_CURVE_SEED), new PublicKey(mint).toBuffer()],
    new PublicKey(programId)
  )[0]
}
