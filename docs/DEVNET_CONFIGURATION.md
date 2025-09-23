# Devnet Configuration Guide

## ✅ Already Configured for Devnet!

Your Solana SBT project is **already configured to run on devnet** by default. No changes are needed!

## Current Configuration

### Network Settings
```javascript
// In src/corrected_sbt_logic.mjs (Line 35)
const umi = createUmi(clusterApiUrl('devnet'));

// In src/corrected_sbt_logic.mjs (Line 48)
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
```

### Verification Script
```javascript
// In src/sbt_verification.mjs (Line 25)
const umi = createUmi(clusterApiUrl('devnet'));
```

## What This Means

✅ **Automatic Airdrop** - Script requests 2 SOL from devnet faucet  
✅ **Free Testing** - No real SOL required  
✅ **Safe Environment** - Perfect for development and testing  
✅ **Explorer Links** - All transactions viewable on Solana Explorer with `?cluster=devnet`  

## Running on Devnet

Simply run the commands as provided:

```bash
# Create your SBT on devnet
npm run create-sbt

# Verify it's non-transferable on devnet
npm run verify-sbt
```

## Network Options Available

If you want to change networks later, here are the options:

### Devnet (Current - Recommended for Testing)
```javascript
const umi = createUmi(clusterApiUrl('devnet'));
```

### Mainnet (Production - Costs Real SOL)
```javascript
const umi = createUmi(clusterApiUrl('mainnet-beta'));
```

### Testnet (Alternative Testing)
```javascript
const umi = createUmi(clusterApiUrl('testnet'));
```

### Local (Requires Local Validator)
```javascript
const umi = createUmi('http://127.0.0.1:8899');
```

## Important Notes

🔥 **Devnet is Perfect for Your Needs:**
- Free SOL via airdrop
- Same functionality as mainnet
- No risk of losing real funds
- Full testing capabilities

🚨 **Before Moving to Mainnet:**
- Test thoroughly on devnet first
- Remove airdrop code
- Use real SOL for transactions
- Update metadata URIs to permanent storage

## Ready to Go!

Your project is already configured for devnet. Just run:

```bash
cd solana-sbt-project
npm run setup
npm run create-sbt
```

The script will automatically:
1. Connect to Solana devnet
2. Request free SOL via airdrop
3. Create your SBT
4. Provide devnet explorer links
