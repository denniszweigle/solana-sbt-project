# Revocable Solana Soul-Bound Token (SBT) Implementation

**Configured for:** denniszweigle | **Network:** Solana Devnet | **Hosting:** GitHub Pages | **WSL Compatible**

## 🎯 Project Overview

This project provides a complete implementation for creating **revocable** Solana Soul-Bound Tokens (SBTs) using the Metaplex Umi framework and MPL Core standard. It's specifically configured for **denniszweigle** with GitHub Pages hosting and **Windows WSL compatibility**.

### ✨ Key Features

- ✅ **Revocable SBTs** - Issuer can burn tokens for violations
- ✅ **Soul-Bound Nature** - Non-transferable by holders
- ✅ **Governance Control** - Enforce agreement compliance
- ✅ **Windows WSL Compatible** - Fixed permission issues
- ✅ **GitHub Pages Integration** - Free, permanent hosting
- ✅ **Custom Metadata Fields** - Comprehensive governance data
- ✅ **Oracle Plugin** - Advanced lifecycle control

### 🔗 Configured URLs

- **Image**: `https://denniszweigle.github.io/solana-sbt-assets/images/pog-token.png`
- **Metadata**: `https://denniszweigle.github.io/solana-sbt-assets/metadata/metadata.json`
- **External URL**: [https://www.proofofgovernance.com](https://www.proofofgovernance.com)

## 🚀 Quick Start

### 1. Install Dependencies (WSL Compatible)
```bash
npm install --no-bin-links
```

### 2. Setup GitHub Pages Assets
Follow the detailed guide in `GITHUB_SETUP_GUIDE.md` to:
- Create `solana-sbt-assets` repository
- Upload your POG token image
- Enable GitHub Pages
- Verify URLs are working

### 3. Create Your Revocable SBT
```bash
npm run create-sbt
```

### 4. Verify Non-transferable Behavior
```bash
npm run verify-sbt
```

### 5. Burn/Revoke SBT (When Needed)
```bash
npm run burn-sbt
```

## 📁 Project Structure

```
solana-sbt-project/
├── src/
│   ├── corrected_sbt_logic.mjs     # Revocable SBT creation
│   ├── sbt_verification.mjs        # Transfer verification
│   └── burn_sbt.mjs               # Token revocation
├── scripts/
│   ├── setup.sh                    # Automated setup
│   └── check_github_urls.mjs       # URL verification
├── assets/
│   └── metadata/
│       └── metadata.json           # Governance metadata
├── docs/                           # Documentation
└── README.md                       # This file
```

## 🔧 Revocable SBT Features

### For Token Holders:
- ✅ **Proves governance eligibility**
- ❌ **Cannot transfer** the token (Soul-Bound)
- ❌ **Cannot burn** their own token
- ✅ **Permanent record** (unless revoked for violations)

### For Issuer (You):
- ✅ **Can burn** any token you issued
- ✅ **Can revoke** for violations
- ✅ **Maintain governance standards**
- ✅ **Enforce agreement compliance**

## 🔥 When to Burn/Revoke Tokens

### Valid Reasons:
- **Agreement Violation**: Breach of governance terms
- **Misconduct**: Inappropriate behavior in governance
- **Eligibility Loss**: No longer meets requirements
- **Fraud**: Token obtained through false information
- **Expiration**: Time-limited governance rights

### Revocation Process:
1. **Document Violation**: Record the breach
2. **Issue Warning**: Give holder chance to correct (optional)
3. **Update burn_sbt.mjs**: Add SBT address and authority key
4. **Execute Burn**: Run `npm run burn-sbt`
5. **Update Records**: Maintain governance integrity

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm install --no-bin-links` | Install dependencies (WSL compatible) |
| `npm run check-urls` | Verify GitHub Pages URLs are working |
| `npm run create-sbt` | Create a new revocable SBT on Solana devnet |
| `npm run verify-sbt` | Verify the SBT is non-transferable |
| `npm run burn-sbt` | Burn/revoke an SBT for violations |
| `npm run test` | Run creation and verification together |

## 🔍 Verification Process

The verification script confirms your SBT is properly configured by:

1. **Attempting Transfer** - Tries to send the SBT to another wallet
2. **Expecting Failure** - Transfer should be rejected due to Oracle Plugin
3. **Confirming Soul-Bound** - Validates non-transferable behavior

Expected output: `✅ SUCCESS: The SBT is properly non-transferable!`

## 📄 Metadata Fields

Your SBT includes comprehensive governance data:

### Core Fields:
- **Company/Project Name**: Official organization name
- **Verification Tier**: Iron (expandable to Bronze, Silver, Gold)
- **Token Contract Address**: Primary smart contract
- **Treasury Wallet**: Multi-sig treasury address
- **Website URL**: Official domain

### Compliance Fields:
- **Audit Report Hash**: IPFS hash of audit reports
- **Governance Framework Hash**: IPFS hash of governance docs
- **Issue/Expiry Dates**: Verification timeline
- **Social Media URLs**: Verified accounts

### Technical Fields:
- **Transferable**: No (Soul-Bound)
- **Burnable**: Yes - By Authority Only
- **Network**: Solana Devnet
- **Standard**: MPL Core

## 🆘 Troubleshooting

### WSL Permission Issues:
```bash
# Use WSL-compatible installation
npm install --no-bin-links
```

### GitHub Pages URLs Not Working:
```bash
# Check if URLs are accessible
npm run check-urls

# If failing, follow GITHUB_SETUP_GUIDE.md
```

### SBT Creation Fails:
- Ensure GitHub Pages is enabled and working
- Wait 2-5 minutes after enabling Pages
- Verify metadata file is uploaded correctly

### Burn Script Issues:
- Update `SBT_ADDRESS` with actual token address
- Update `AUTHORITY_SECRET_KEY` with issuer secret key
- Both values are provided by the creation script

## 🔒 Security Notes

### For Testing (Current Setup):
- Uses Solana devnet (no real value)
- Generates new keypairs each run
- Safe for experimentation

### For Production:
- Switch to mainnet-beta
- Use secure key management
- Remove airdrop functionality
- Implement proper governance procedures

## 📖 Additional Documentation

- **`GITHUB_SETUP_GUIDE.md`** - Complete VS Code terminal setup
- **`docs/TECHNICAL_GUIDE.md`** - Technical implementation details
- **`REVOCABLE_SBT_GUIDE.md`** - Revocation policy framework

## 🎯 What Makes This SBT Special

1. **Soul-Bound Nature** - Cannot be transferred by holders
2. **Revocable Authority** - Issuer can burn for violations
3. **Governance Control** - Enforces agreement compliance
4. **Comprehensive Metadata** - Rich governance information
5. **Oracle Plugin** - Advanced lifecycle management
6. **WSL Compatible** - Works on Windows development environments

## ✅ Success Indicators

When everything is working correctly:

1. **Install**: `npm install --no-bin-links` completes without errors
2. **URLs**: `npm run check-urls` shows all URLs working
3. **Creation**: SBT created with transaction link
4. **Verification**: Transfer attempt properly rejected
5. **Revocation**: Burn script works when needed
6. **Explorer**: Token visible on Solana Explorer (devnet)

## 🎉 Ready for Governance!

Your project is configured for comprehensive governance token management:

1. **Create SBTs** for eligible participants
2. **Verify compliance** through non-transferable nature
3. **Revoke tokens** for violations when necessary
4. **Maintain standards** through issuer authority

Your Revocable Soul-Bound Token system is ready for governance enforcement!
