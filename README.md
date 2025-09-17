# Coinbase ATM

A modern, secure cryptocurrency ATM interface built with Next.js and Coinbase SDK. This application provides a user-friendly interface for buying, selling, swapping, and managing cryptocurrency assets on the Base network.

## Features

### 🏦 Core ATM Functionality
- **Buy with Card**: Purchase cryptocurrency using credit/debit cards via Coinbase onramp
- **Deposit Tokens**: Generate QR codes and addresses for receiving cryptocurrency
- **Send Crypto**: Transfer tokens to other addresses with step-by-step guidance
- **Trade Tokens**: Swap between different cryptocurrencies with real-time pricing

### 🔐 Security & Wallet Management
- **Email-based Authentication**: Secure sign-in using email and OTP verification
- **Private Key Management**: Secure private key export with blurred display and copy functionality
- **Wallet Integration**: Seamless integration with Coinbase SDK for wallet operations
- **Transaction Receipts**: Detailed transaction confirmations and tracking

### 🎨 User Experience
- **Responsive Design**: Optimized for mobile and desktop interfaces
- **Interactive Tutorial**: Guided onboarding for new users
- **Real-time Balances**: Live cryptocurrency balance updates
- **Token Search**: Easy token discovery and selection
- **Slippage Control**: Customizable slippage settings for trades

### 🌐 Network Support
- **Base Network**: Built specifically for Base blockchain operations
- **Multi-token Support**: Support for ETH, USDC, USDT, and other popular tokens
- **Real-time Pricing**: Live price feeds and USD value calculations

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **Blockchain**: Coinbase SDK (@coinbase/cdp-hooks)
- **State Management**: React hooks and context
- **UI Components**: Custom component library with Lucide React icons
- **Fonts**: Pixelify Sans for retro ATM aesthetic

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun
- Coinbase Developer Platform API keys

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Syntax-Studios-Org/coinbase-ATM
cd coinbase-atm
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following environment variables:
- `CDP_API_KEY_SECRET`: Your Coinbase Developer Platform API key
- `NEXT_PUBLIC_CDP_PROJECT_ID`: Your CDP project ID
- Additional configuration as needed

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes for backend functionality
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── atm/              # ATM-specific components
│   ├── common/           # Shared components
│   └── ui/               # UI component library
├── config/               # Configuration files
├── constants/            # Application constants
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── providers/            # React context providers
├── services/             # API service layers
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Key Components

### ATMContainer
The main container component that manages the overall ATM interface, including navigation, screen routing, and state management.

### Screen Components
- **SwapScreen**: Token swapping interface with slippage controls
- **SendCryptoScreen**: Multi-step crypto sending workflow
- **BuyWithCardScreen**: Fiat-to-crypto purchase interface
- **DepositTokenScreen**: QR code generation for deposits
- **PrivateKeyScreen**: Secure private key display and export
- **TokenSelectorScreen**: Token search and selection interface

### UserHeader
Navigation header with wallet connection status, settings, and private key access.

## Security Features

- **Private Key Protection**: Keys are blurred by default with toggle visibility
- **Secure Export**: Private keys are exported only when explicitly requested
- **Transaction Validation**: All transactions are validated before execution
- **Error Handling**: Comprehensive error handling for failed operations

## Development

### Type Checking
```bash
npx tsc --noEmit
```

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the [Coinbase Developer Platform documentation](https://docs.cdp.coinbase.com/)
- Review the [Next.js documentation](https://nextjs.org/docs)
- Open an issue in this repository

## Disclaimer

This is a demo application for educational purposes. It creates real on-chain transactions and collects email addresses for authentication. Please review the [Coinbase Privacy Policy](https://www.coinbase.com/legal/privacy) for details on data handling.
