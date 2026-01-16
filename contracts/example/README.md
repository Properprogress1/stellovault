# StelloVault Contracts

This directory contains the Soroban smart contracts for StelloVault, a trade finance dApp built on Stellar.

## Overview

The contracts implement:
- **Collateral Tokenization**: Convert real-world assets (invoices, commodities) into tokenized Stellar assets
- **Multi-Signature Escrows**: Secure trade finance deals with automated release conditions
- **Oracle Integration**: Support for external data feeds to trigger escrow releases

## Contract Structure

- `StelloVaultContract`: Main contract handling tokenization and escrow operations
- `CollateralToken`: Data structure for tokenized collateral
- `TradeEscrow`: Data structure for trade finance escrows

## Development

### Prerequisites

- [Rust](https://rustup.rs/)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)

### Building

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

### Testing

```bash
cd contracts
cargo test
```

### Deploying

```bash
# Build the contract
soroban contract build

# Optimize the WASM
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/stellovault_contracts.wasm

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellovault_contracts.wasm \
  --source <your-secret-key> \
  --network testnet
```

## Key Features

- **Collateral Tokenization**: Mint fractional tokens from real assets with embedded metadata
- **Escrow Management**: Create, activate, and release escrows based on oracle confirmations
- **Multi-Sig Security**: Require multiple parties for critical operations
- **Event Logging**: Comprehensive event emission for off-chain monitoring

## Architecture

The contracts follow Soroban best practices:
- Persistent storage for long-term data
- Instance storage for contract metadata
- Event-driven architecture for external integrations
- Comprehensive error handling and validation