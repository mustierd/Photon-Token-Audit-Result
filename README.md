# Photon Token Audit Results

It ensures the accuracy of Mint Auth, Freeze Auth, LP burn and top 10 holder information of tokens produced on the Solana network. It also shows the amount of tokens held by token holders, the percentage and the dollar value.

Notes: LP Burned control will be added...

Token Example: https://photon-sol.tinyastro.io/en/lp/4LuGwek6Jv4xpGvsQwZXonmLuRhrpHtmKVs95bN9EkTm?handle=1210453050a1fbff1d6629 
<img width="1238" alt="image" src="https://github.com/user-attachments/assets/821c0549-e2c6-4409-a3f1-da767134bf47" />

<img width="1697" alt="image" src="https://github.com/user-attachments/assets/cbe6dee9-81ef-43fd-a2c8-4eb1859005b6" />


## 🚀 Features

- View detailed token information
- Top holders analysis
- LP token burn verification
- Real-time token price tracking
- Token authority status check

## 📋️ Quick Start

```bash
# Clone and install
git clone https://github.com/mustierd/Photon-Token-Audit-Result.git
cd Photon-Token-Audit-Result
npm install

# Add to .env file:
NEXT_PUBLIC_HELIUS_APIKEY=your_helius_api_key

# Run
npm start
```

## 📦 Project Structure

```
src/
├── index.ts              # Main entry point
├── services/
    ├── getTokenPrice.ts  # Token price service
    ├── lpBurnCheck.ts    # LP token burn verification service
    ├── tokenAuth.ts      # Token authority check service
    ├── tokenInfo.ts      # Token information service
    └── topHolders.ts     # Top holders analysis service
```

## 📞 Contact

X: [@mustierd](https://x.com/mustierd)
