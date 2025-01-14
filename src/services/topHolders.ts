import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

import {
  TOKEN_PROGRAM_ID as SPL_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID as SPL_TOKEN_2022_PROGRAM_ID,
  unpackAccount,
  getMint,
} from '@solana/spl-token'
import {
  findRaydiumPoolInfo,
  getBondingCurvePDA,
  getDexScreenerPrice,
} from '../utils'

interface TokenHolder {
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

const RAYDIUM_AUTH_ADDRESS = '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'
const PUMPFUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
const TOKEN_MINT_SOL = new PublicKey(
  'So11111111111111111111111111111111111111112'
) // Wrapped SOL (WSOL) Mint Address
const RISK_THRESHOLD = 15 // Top holders risk threshold percentage

export async function getTopHolders(
  connection: Connection,
  mintAddress: string,
  limit: number = 11
) {
  try {
    const mintPubkey = new PublicKey(mintAddress)
    const mintInfo = await connection.getAccountInfo(mintPubkey)
    const tokenPrice = await getDexScreenerPrice(mintAddress)
    if (!mintInfo) throw new Error('Token information not found')
    const programId = mintInfo.owner

    const KNOWN_POOL_ADDRESSES = [RAYDIUM_AUTH_ADDRESS]

    const bindingCurveAddress = await getBondingCurvePDA(
      mintAddress,
      PUMPFUN_PROGRAM_ID
    )

    const poolAddresses = [...KNOWN_POOL_ADDRESSES]

    if (bindingCurveAddress) {
      poolAddresses.push(bindingCurveAddress.toBase58())
    }

    const raydiumPoolInfo = await findRaydiumPoolInfo(
      connection,
      mintAddress,
      TOKEN_MINT_SOL.toBase58()
    )

    if (raydiumPoolInfo?.id) {
      const foundPoolId = raydiumPoolInfo.id.toBase58()
      if (!poolAddresses.includes(foundPoolId)) {
        poolAddresses.push(foundPoolId)
      }
    }

    if (raydiumPoolInfo?.authority) {
      const poolAuthority = raydiumPoolInfo.authority.toBase58()
      if (!poolAddresses.includes(poolAuthority)) {
        poolAddresses.push(poolAuthority)
      }
    }

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
          console.error('Account reading error:', error)
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
      (holder): holder is NonNullable<typeof holder> => {
        if (!holder) return false
        return !poolAddresses.includes(holder.address)
      }
    )

    const sortedHolders = holders
      .filter((holder): holder is NonNullable<typeof holder> => holder !== null)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit)
      .map((holder) => {
        const exactPercentage = (holder.amount / totalSupply) * 100
        const displayPercentage = Number(exactPercentage.toFixed(2))

        let label = ''
        if (poolAddresses.includes(holder.address)) {
          if (holder.address === RAYDIUM_AUTH_ADDRESS) {
            label = ' 🌊 [Raydium Pool]'
          } else {
            label = ' 🌊 [Liquidity Pool]'
          }
        } else if (holder.address.startsWith('D4R')) {
          label = ' ⚠️ [Excluded Address]'
        }

        return {
          address: holder.address,
          amount: holder.amount,
          decimals: holder.decimals,
          totalSupply,
          percentOwned: `${displayPercentage}%`,
          percentOwnedNumber: exactPercentage,
          formattedAmount: (
            holder.amount / Math.pow(10, holder.decimals)
          ).toFixed(2),
          value: `$${(
            tokenPrice.price *
            (holder.amount / Math.pow(10, holder.decimals))
          ).toFixed(2)}`,
          label,
        } as TokenHolder
      })

    const totalPercentageHeld = validHolders
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .reduce((total, holder) => {
        const percentage = (holder.amount / totalSupply) * 100
        return total + percentage
      }, 0)

    const isTop10HolderSafe = totalPercentageHeld < RISK_THRESHOLD

    return {
      sortedHolders,
      activeAddresses: validHolders,
      totalPercentageHeld,
      isTop10HolderSafe,
      riskThreshold: RISK_THRESHOLD,
    }
  } catch (error) {
    console.error('Error in getTopHolders:', error)
    throw error
  }
}
