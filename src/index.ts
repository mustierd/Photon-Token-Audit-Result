import { config } from 'dotenv'
import { Connection } from '@solana/web3.js'
// import { checkLPBurned } from './services/lpBurnCheck'
import { getTopHolders } from './services/topHolders'
import { getTokenInfo } from './services/tokenInfo'
import { checkTokenAuthorities } from './services/tokenAuth'
config()

async function main() {
  const connection = new Connection(
    `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_APIKEY}`,
    'confirmed'
  )
  /* 
    bioJ9JTqW62MLz7UKHU69gtKhPpGi1BQhccj2kmSvUJ -> Token-2022 OwnerProgram Example
    Qma6aqrGVpi1QQKyiBQgLa1rBDDKonpAk258LN9pump -> spl-token OwnerProgram Example
  */
  const tokenMintAddress = 'bioJ9JTqW62MLz7UKHU69gtKhPpGi1BQhccj2kmSvUJ'

  try {
    const tokenInfo = await getTokenInfo(connection, tokenMintAddress)

    const authorities = await checkTokenAuthorities(
      connection,
      tokenMintAddress
    )
    const { sortedHolders, activeAddresses } = await getTopHolders(
      connection,
      tokenMintAddress
    )

    console.log('\nToken Analysis Results:')
    console.log('----------------')
    console.log('Token Address:', tokenMintAddress)
    console.log('Program:', tokenInfo.programId)
    console.log('Is Token-2022?:', tokenInfo.isToken2022)
    console.log('Total Supply:', tokenInfo.mintInfo.supply.toString())
    console.log('Decimal:', tokenInfo.mintInfo.decimals)
    console.log('Is Mint Authority Disabled?:', authorities.isMintAuthDisabled)
    console.log('Mint Authority:', authorities.mintAuthority)
    console.log(
      ' Is Freeze Authority Disabled?:',
      authorities.isFreezeAuthDisabled
    )
    console.log('Freeze Authority:', authorities.freezeAuthority)
    console.log('\nHolder Infos:')
    console.log('----------------')
    console.log('Number of Active Owners:', activeAddresses.length)
    console.log('Top10 Holders:')
    sortedHolders.slice(0, 10).forEach((holder, index) => {
      console.log(`${index + 1}. Address: ${holder.address}`)
      console.log(`   Ownership rate: ${holder.percentOwned}`)
      console.log(`   Amount: ${holder.formattedAmount}`)
      console.log(`   Value: ${holder.value}`)
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
