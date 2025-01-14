# Solana Meme Token Audit Results

It ensures the accuracy of Mint Auth, Freeze Auth, LP burn and top 10 holder information of tokens produced on the Solana network. It also shows the amount of tokens held by token holders, the percentage and the dollar value.
Notes: LP Burned control will be added...
Token Example: https://photon-sol.tinyastro.io/en/lp/4LuGwek6Jv4xpGvsQwZXonmLuRhrpHtmKVs95bN9EkTm?handle=1210453050a1fbff1d6629
<img width="1238" alt="image" src="https://github.com/user-attachments/assets/821c0549-e2c6-4409-a3f1-da767134bf47" />
<img width="1697" alt="image" src="https://github.com/user-attachments/assets/cbe6dee9-81ef-43fd-a2c8-4eb1859005b6" />

## 🚀 Features

- View detailed token information
- Top holders analysis with risk assessment
- Liquidity pool detection (Raydium & PumpFun)
- Real-time token price tracking
- Token authority status check (Mint & Freeze)
- Risk analysis for token holder concentration

## 📋️ Quick Start

```bash
# Clone and install
git clone https://github.com/mustierd/Solana-MemeToken-Audit-Result.git
cd Solana-MemeToken-Audit-Result
npm install

# Add to .env file:
NEXT_PUBLIC_HELIUS_APIKEY=your_helius_api_key

# Run
npm start
```

## 📦 Project Structure

```
src/
├── index.ts            # Main entry point
├── types/              # Type definitions
│   └── index.ts            # Centralized type definitions
├── utils/              # Utility functions
│   └── index.ts            # Common utilities
└── services/           # Core services
    ├── lpBurnCheck.ts     # LP token burn verification
    ├── tokenAuth.ts       # Token authority check
    ├── tokenInfo.ts       # Token information
    └── topHolders.ts      # Holder analysis & risk assessment
```

## 🔍 Risk Assessment

The tool performs several security checks:

- Mint Authority Status (✅ Safe if disabled)
- Freeze Authority Status (✅ Safe if disabled)
- Top 10 Holders Concentration (✅ Safe if < 15%)
- Liquidity Pool Detection (🌊 Marked in holder list)

## 🌐 Social

X: [@mustierd](https://x.com/mustierd)
