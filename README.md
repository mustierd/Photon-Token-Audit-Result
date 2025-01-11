# Photon Token Audit Results

It ensures the accuracy of Mint Auth, Freeze Auth, LP burn and top 10 holder information of tokens produced on the Solana network. It also shows the amount of tokens held by token holders, the percentage and the dollar value.

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

## 🔍 License

This project is licensed under the MIT License.

## 📞 Contact

GitHub: [@mustierd](https://github.com/mustierd)
