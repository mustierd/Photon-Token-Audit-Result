import { Connection, PublicKey } from '@solana/web3.js'
import { getDexScreenerPrice } from './getTokenPrice'

import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  unpackAccount,
  getMint,
} from '@solana/spl-token'

export async function getTopHolders(
  connection: Connection,
  mintAddress: string,
  limit: number = 10
) {
  try {
    const mintPubkey = new PublicKey(mintAddress)
    const mintInfo = await connection.getAccountInfo(mintPubkey)
    const tokenPrice = await getDexScreenerPrice(mintAddress)

    if (!mintInfo) throw new Error('Token information not found')

    const programId = mintInfo.owner

    const mint = await getMint(connection, mintPubkey, 'confirmed', programId)
    const totalSupply = Number(mint.supply)

    let holders = []

    if (programId.equals(TOKEN_2022_PROGRAM_ID)) {
      const accounts = await connection.getProgramAccounts(programId, {
        filters: [{ memcmp: { offset: 0, bytes: mintPubkey.toBase58() } }],
      })
      holders = accounts.map((account) => {
        try {
          const tokenAccount = unpackAccount(
            account.pubkey,
            account.account,
            programId
          )
          return {
            address: tokenAccount.owner.toBase58(),
            amount: Number(tokenAccount.amount),
            decimals: 9,
          }
        } catch (error) {
          console.error('Hesap okuma hatası:', error)
          return null
        }
      })
    } else {
      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            { dataSize: 165 },
            { memcmp: { offset: 0, bytes: mintPubkey.toBase58() } },
          ],
        }
      )
      holders = accounts
        .map((res) => {
          if ('parsed' in res.account.data) {
            return {
              address: res.account.data.parsed.info.owner,
              amount: Number(res.account.data.parsed.info.tokenAmount.amount),
              decimals: res.account.data.parsed.info.tokenAmount.decimals,
            }
          }
          return null
        })
        .filter((account) => account !== null)
    }

    const validHolders = holders.filter(
      (holder): holder is NonNullable<typeof holder> => holder !== null
    )

    const sortedHolders = validHolders
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit)
      .map((holder) => {
        const percentOwned = ((holder.amount / totalSupply) * 100).toFixed(2)
        const formattedAmount = (
          holder.amount / Math.pow(10, holder.decimals)
        ).toFixed(2)

        const amountWithDecimals = holder.amount / Math.pow(10, holder.decimals)
        const value = (tokenPrice.price * amountWithDecimals).toFixed(2)

        return {
          ...holder,
          percentOwned: `${percentOwned}%`,
          formattedAmount: `${formattedAmount}`,
          value: `$${value}`,
        }
      })

    const activeAddresses = validHolders
      .filter((holder) => holder.amount > 0)
      .map((holder) => holder.address)

    return {
      sortedHolders,
      activeAddresses,
      isToken2022: programId.equals(TOKEN_2022_PROGRAM_ID),
    }
  } catch (error) {
    console.error('Top holders analizi hatası:', error)
    throw error
  }
}
