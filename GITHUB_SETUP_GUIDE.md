# GitHub Repository Setup Guide for VS Code Terminal

## 🎯 Complete Setup Instructions for denniszweigle

This guide will walk you through setting up a GitHub repository for hosting your SBT images and metadata using VS Code terminal commands.

## 📋 Prerequisites

- Visual Studio Code installed
- Git installed on your system
- GitHub account (denniszweigle)

## 🚀 Step-by-Step Terminal Commands

### Step 1: Open VS Code Terminal

1. Open Visual Studio Code
2. Press `Ctrl+`` (backtick) or go to **Terminal > New Terminal**
3. Make sure you're in your desired working directory

### Step 2: Create Local Repository

```bash
# Create and navigate to your assets repository
mkdir solana-sbt-assets
cd solana-sbt-assets

# Initialize git repository
git init

# Create directory structure
mkdir -p images metadata

# Create README file
echo "# Solana SBT Assets Repository

This repository hosts images and metadata for Solana Soul-Bound Tokens (SBTs).

## Structure
- \`images/\` - Token images and artwork
- \`metadata/\` - JSON metadata files

## Usage
This repository is configured with GitHub Pages to provide direct URLs for NFT metadata and images.

## URLs
- Images: \`https://denniszweigle.github.io/solana-sbt-assets/images/filename.png\`
- Metadata: \`https://denniszweigle.github.io/solana-sbt-assets/metadata/filename.json\`
" > README.md
```

### Step 3: Configure Git (if not already done)

```bash
# Set your Git username and email (replace with your actual info)
git config --global user.name "denniszweigle"
git config --global user.email "your-email@example.com"

# Verify configuration
git config --list
```

### Step 4: Create GitHub Repository

```bash
# Install GitHub CLI if not already installed (optional but recommended)
# For Windows: winget install GitHub.cli
# For Mac: brew install gh
# For Linux: Follow instructions at https://cli.github.com/

# Login to GitHub CLI (optional method)
gh auth login

# Create repository on GitHub (using GitHub CLI)
gh repo create solana-sbt-assets --public --description "Solana Soul-Bound Token assets and metadata hosting"

# Alternative: Create repository manually on GitHub.com
# Go to https://github.com/new
# Repository name: solana-sbt-assets
# Description: Solana Soul-Bound Token assets and metadata hosting
# Public repository
# Don't initialize with README (we already have one)
```

### Step 5: Connect Local Repository to GitHub

```bash
# Add remote origin (replace denniszweigle with your username if different)
git remote add origin https://github.com/denniszweigle/solana-sbt-assets.git

# Verify remote
git remote -v
```

### Step 6: Add Your Images and Metadata

```bash
# Copy your POG token image to the images directory
# Replace 'path/to/your/image.png' with actual path to your image
cp "path/to/your/image.png" images/pog-token.png

# Create your metadata file
cat > metadata/pog-metadata.json << 'EOF'
{
  "name": "Proof of Governance",
  "symbol": "POG",
  "description": "A Soul-Bound Token representing proof of governance participation. This token is non-transferable and permanently bound to the holder's wallet.",
  "image": "https://denniszweigle.github.io/solana-sbt-assets/images/pog-token.png",
  "external_url": "https://www.proofofgovernance.com",
  "attributes": [
    {
      "trait_type": "First Name",
      "value": "Dennis"
    },
    {
      "trait_type": "Last Name", 
      "value": "Zweigle"
    },
    {
      "trait_type": "Token Type",
      "value": "Soul-Bound Token"
    },
    {
      "trait_type": "Category",
      "value": "Governance"
    },
    {
      "trait_type": "Transferable",
      "value": "No"
    },
    {
      "trait_type": "Network",
      "value": "Solana Devnet"
    },
    {
      "trait_type": "Token URL",
      "value": "https://www.tradebot.cash"
    },
    {
      "trait_type": "POG URL",
      "value": "https://www.proofofgovernance.com"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://denniszweigle.github.io/solana-sbt-assets/images/pog-token.png",
        "type": "image/png"
      }
    ],
    "category": "image"
  },
  "custom_fields": {
    "fName": "Dennis",
    "lName": "Zweigle",
    "TokenURL": "https://www.tradebot.cash",
    "PogURL": "https://www.proofofgovernance.com"
  }
}
EOF
```

### Step 7: Commit and Push to GitHub

```bash
# Add all files to staging
git add .

# Check what will be committed
git status

# Commit with descriptive message
git commit -m "Initial commit: Add POG token assets and metadata

- Add pog-token.png image
- Add pog-metadata.json with custom fields
- Configure for GitHub Pages hosting
- Set up for Solana devnet SBT implementation"

# Push to GitHub (first time)
git branch -M main
git push -u origin main
```

### Step 8: Enable GitHub Pages

```bash
# Using GitHub CLI (if available)
gh api repos/denniszweigle/solana-sbt-assets/pages -X POST -f source.branch=main -f source.path=/

# Alternative: Manual setup via web interface
echo "🌐 Manual GitHub Pages Setup:"
echo "1. Go to https://github.com/denniszweigle/solana-sbt-assets"
echo "2. Click 'Settings' tab"
echo "3. Scroll down to 'Pages' section"
echo "4. Under 'Source', select 'Deploy from a branch'"
echo "5. Select 'main' branch and '/ (root)' folder"
echo "6. Click 'Save'"
echo "7. Wait 2-5 minutes for deployment"
```

### Step 9: Verify Your URLs

```bash
# Wait 2-5 minutes after enabling Pages, then test URLs
echo "🔍 Testing your URLs..."

# Test image URL
curl -I "https://denniszweigle.github.io/solana-sbt-assets/images/pog-token.png"

# Test metadata URL  
curl -I "https://denniszweigle.github.io/solana-sbt-assets/metadata/pog-metadata.json"

echo "✅ If you see '200 OK' responses, your URLs are working!"
echo ""
echo "📋 Your URLs:"
echo "Image: https://denniszweigle.github.io/solana-sbt-assets/images/pog-token.png"
echo "Metadata: https://denniszweigle.github.io/solana-sbt-assets/metadata/pog-metadata.json"
```

### Step 10: Update Your SBT Project

```bash
# Navigate back to your SBT project
cd ../solana-sbt-project

# The metadata URL is already configured in the code as:
# https://denniszweigle.github.io/solana-sbt-assets/metadata/pog-metadata.json

echo "🎉 Setup complete! Your SBT project is ready to use GitHub Pages URLs."
```

## 🔄 Future Updates

When you need to update images or metadata:

```bash
# Navigate to your assets repository
cd solana-sbt-assets

# Make your changes (add/edit files)
# ...

# Commit and push changes
git add .
git commit -m "Update: Describe your changes here"
git push

# Changes will be live on GitHub Pages within 1-2 minutes
```

## 🆘 Troubleshooting

### If GitHub Pages isn't working:
```bash
# Check repository settings
gh repo view denniszweigle/solana-sbt-assets --web

# Check Pages deployment status
gh api repos/denniszweigle/solana-sbt-assets/pages
```

### If URLs return 404:
```bash
# Verify files exist
ls -la images/
ls -la metadata/

# Check if Pages is enabled
echo "Visit: https://github.com/denniszweigle/solana-sbt-assets/settings/pages"
```

### If images won't upload:
```bash
# Check file size (GitHub has limits)
ls -lh images/

# Ensure proper file extensions
file images/*
```

## ✅ Verification Checklist

- [ ] Repository created: `solana-sbt-assets`
- [ ] GitHub Pages enabled
- [ ] Image uploaded: `pog-token.png`
- [ ] Metadata created: `pog-metadata.json`
- [ ] URLs accessible (wait 2-5 minutes)
- [ ] Custom fields included (fName, lName, TokenURL, PogURL)
- [ ] Configured for Solana devnet

## 🎯 Final URLs

After setup, your URLs will be:
- **Image**: `https://denniszweigle.github.io/solana-sbt-assets/images/pog-token.png`
- **Metadata**: `https://denniszweigle.github.io/solana-sbt-assets/metadata/pog-metadata.json`

These URLs are already configured in your SBT creation script!
