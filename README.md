# Solana Soul-Bound Token (SBT) Implementation

**Configured for:** denniszweigle | **Network:** Solana Devnet | **Hosting:** GitHub Pages | **WSL Compatible**

## 🎯 Project Overview

This project provides a complete implementation for creating Solana Soul-Bound Tokens (SBTs) using the Metaplex Umi framework and MPL Core standard. It's specifically configured for **denniszweigle** with GitHub Pages hosting and **Windows WSL compatibility**.

### ✨ Key Features

- ✅ **Windows WSL Compatible** - Fixed permission issues
- ✅ **Fixed EddsaInterface Error** - Uses proper `umi-bundle-defaults`
- ✅ **Solana Devnet Ready** - Free testing environment
- ✅ **GitHub Pages Integration** - Free, permanent hosting
- ✅ **Custom Metadata Fields** - fName, lName, clickable URLs
- ✅ **Non-transferable Tokens** - True Soul-Bound behavior
- ✅ **Verification System** - Automated testing

### 🔗 Configured URLs

- **Image**: `https://denniszweigle.github.io/solana-sbt-assets/images/pog-token.png`
- **Metadata**: `https://denniszweigle.github.io/solana-sbt-assets/metadata/pog-metadata.json`
- **Token URL**: [https://www.tradebot.cash](https://www.tradebot.cash)
- **POG URL**: [https://www.proofofgovernance.com](https://www.proofofgovernance.com)

## 🚀 Quick Start

### 1. Setup Dependencies
```bash
npm run setup
```

### 2. Setup GitHub Repository (First Time Only)
Follow the detailed guide in `GITHUB_SETUP_GUIDE.md` to:
- Create `solana-sbt-assets` repository
- Upload your POG token image
- Enable GitHub Pages
- Verify URLs are working

### 3. Create Your SBT
```bash
npm run create-sbt
```

### 4. Verify Non-transferable Behavior
```bash
npm run verify-sbt
```

## 📁 Project Structure

```
solana-sbt-project/
├── src/
│   ├── corrected_sbt_logic.mjs     # Main SBT creation (devnet)
│   └── sbt_verification.mjs        # Transfer verification
├── scripts/
│   ├── setup.sh                    # Automated setup
│   └── check_github_urls.mjs       # URL verification
├── assets/
│   └── metadata/
│       └── pog-metadata.json       # Template metadata
├── docs/                           # Documentation
├── GITHUB_SETUP_GUIDE.md          # GitHub setup instructions
└── README.md                       # This file
```

## 🔧 Configuration Details

### Network Configuration
- **Blockchain**: Solana
- **Network**: Devnet (free testing)
- **Cluster URL**: `https://api.devnet.solana.com`
- **Explorer**: `https://explorer.solana.com/?cluster=devnet`

### GitHub Pages Setup
- **Username**: denniszweigle
- **Repository**: solana-sbt-assets
- **Base URL**: `https://denniszweigle.github.io/solana-sbt-assets/`

### Metadata Fields
The SBT includes these custom fields:
- **fName**: First name of token holder
- **lName**: Last name of token holder  
- **TokenURL**: Clickable link to https://www.tradebot.cash
- **PogURL**: Clickable link to https://www.proofofgovernance.com

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Install dependencies and check configuration |
| `npm run create-sbt` | Create a new SBT on Solana devnet |
| `npm run verify-sbt` | Verify the SBT is non-transferable |
| `npm run check-urls` | Verify GitHub Pages URLs are working |
| `npm run test` | Run creation and verification together |

## 🔍 Verification Process

The verification script confirms your SBT is properly configured by:

1. **Attempting Transfer** - Tries to send the SBT to another wallet
2. **Expecting Failure** - Transfer should be rejected due to freeze
3. **Confirming Soul-Bound** - Validates non-transferable behavior

Expected output: `✅ SUCCESS: The SBT is properly non-transferable!`

## 🆘 Troubleshooting

### GitHub Pages URLs Not Working
```bash
# Check if URLs are accessible
npm run check-urls

# If failing, follow GITHUB_SETUP_GUIDE.md
```

### SBT Creation Fails
Common issues and solutions:

**Metadata URL Error**
- Ensure GitHub Pages is enabled
- Wait 2-5 minutes after enabling Pages
- Verify files are in correct directories

**Airdrop Fails**
- Normal on devnet, script will continue
- You may already have sufficient SOL

**Network Connection**
- Check internet connection
- Verify devnet is accessible

### Verification Script Issues
- Update `sbtMintAddress` with actual SBT address
- Update `payerSecretKey` with actual secret key array
- Both values are provided by the creation script

## 🔒 Security Notes

### For Testing (Current Setup)
- Uses Solana devnet (no real value)
- Generates new keypairs each run
- Safe for experimentation

### For Production
- Switch to mainnet-beta
- Use secure key management
- Remove airdrop functionality
- Use permanent storage (Arweave)

## 📖 Additional Documentation

- **`GITHUB_SETUP_GUIDE.md`** - Complete VS Code terminal setup
- **`docs/TECHNICAL_GUIDE.md`** - Technical implementation details
- **`assets/metadata/pog-metadata.json`** - Metadata template

## 🎯 What Makes This SBT Special

1. **Soul-Bound Nature** - Cannot be transferred once created
2. **Permanent Freeze** - Uses MPL Core PermanentFreezeDelegate
3. **Custom Fields** - Includes personal and URL information
4. **Devnet Safe** - Free testing environment
5. **GitHub Hosted** - Reliable, free asset hosting

## ✅ Success Indicators

When everything is working correctly:

1. **Setup**: `npm run setup` shows all URLs working
2. **Creation**: SBT created with transaction link
3. **Verification**: Transfer attempt properly rejected
4. **Explorer**: Token visible on Solana Explorer (devnet)

## 🎉 Ready to Go!

Your project is configured and ready. Follow these steps:

1. Run `npm run setup`
2. Follow `GITHUB_SETUP_GUIDE.md` if URLs aren't working
3. Run `npm run create-sbt`
4. Run `npm run verify-sbt`

Your Soul-Bound Token will be permanently tied to the generated wallet and visible on the Solana devnet explorer!
