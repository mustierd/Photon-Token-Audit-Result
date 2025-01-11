# Photon Token Audit Results

This project is an audit tool that analyzes various features and metrics of the Photon Token on the Solana blockchain.

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
