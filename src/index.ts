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
  const tokenMintAddress = '543LdYxPd3vFAnUcSvXhP5BYpauuUK5yMvPDaai4pump'

  try {
    const tokenInfo = await getTokenInfo(connection, tokenMintAddress)

    const authorities = await checkTokenAuthorities(
      connection,
      tokenMintAddress
    )

    const {
      sortedHolders,
      activeAddresses,
      totalPercentageHeld,
      isTop10HolderSafe,
      riskThreshold,
    } = await getTopHolders(connection, tokenMintAddress, 11)

    console.log('\nToken Analysis Results:')
    console.log('----------------')
    console.log('Token Address:', tokenMintAddress)
    console.log('Program:', tokenInfo.programId)
    console.log('Is Token-2022?:', tokenInfo.isToken2022)
    console.log('Total Supply:', tokenInfo.mintInfo.supply.toString())
    console.log('Decimal:', tokenInfo.mintInfo.decimals)

    console.log('\nAuthority Infos:')
    console.log('----------------')
    console.log(
      'Is Mint Authority Disabled?:',
      authorities.isMintAuthDisabled
        ? '✅ Safe (Disabled)'
        : '❌ Risk (Enabled)'
    )
    console.log('Mint Authority:', authorities.mintAuthority)
    console.log(
      'Is Freeze Authority Disabled?:',
      authorities.isFreezeAuthDisabled
        ? '✅ Safe (Disabled)'
        : '❌ Risk (Enabled)'
    )
    console.log('Freeze Authority:', authorities.freezeAuthority)

    console.log('\nHolder Infos:')
    console.log('----------------')
    console.log('Number of Active Owners:', activeAddresses.length)

    const topHolderStatus = isTop10HolderSafe ? '✅ Safe' : '❌ Risk'
    console.log('Top Holder Status:', topHolderStatus)

    console.log(
      'Total Percentage Held by Top Holders:',
      `${totalPercentageHeld.toFixed(2)}%`
    )
    console.log('Safety Threshold:', `${riskThreshold}%`)
    console.log(
      'Remaining Until Risk:',
      isTop10HolderSafe
        ? `${(riskThreshold - totalPercentageHeld).toFixed(
            2
          )}% until risk threshold`
        : `${(totalPercentageHeld - riskThreshold).toFixed(
            2
          )}% above risk threshold`
    )

    if (!isTop10HolderSafe) {
      const warningMessage = `⚠️ Warning: Top 10 holders (excluding pools) own ${totalPercentageHeld.toFixed(
        2
      )}% of the total supply (>${riskThreshold}%)`
      console.log('\x1b[33m%s\x1b[0m', warningMessage)
    }

    console.log('\nAll Top Holders (Including Pools):')
    sortedHolders.forEach((holder, index) => {
      console.log(`${index + 1}. Address: ${holder.address}${holder.label}`)
      console.log(`   Ownership rate: ${holder.percentOwned}`)
      console.log(`   Amount: ${holder.formattedAmount}`)
      console.log(`   Value: ${holder.value}`)
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
