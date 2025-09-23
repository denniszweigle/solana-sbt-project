#!/bin/bash

# Solana SBT Project Setup Script with GitHub Pages Integration
# This script installs dependencies and guides you through GitHub setup

echo "🚀 Setting up Solana SBT Project with GitHub Pages..."
echo "===================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🔧 Configuration Summary:"
echo "========================"
echo "👤 GitHub Username: denniszweigle"
echo "📁 Assets Repository: solana-sbt-assets"
echo "🌐 Network: Solana Devnet"
echo "🔗 Expected Image URL: https://denniszweigle.github.io/solana-sbt-assets/images/pog-token.png"
echo "🔗 Expected Metadata URL: https://denniszweigle.github.io/solana-sbt-assets/metadata/pog-metadata.json"
echo ""

# Check if GitHub repository is set up
echo "🔍 Checking GitHub Pages setup..."
npm run check-urls

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "If GitHub URLs are working:"
echo "  ✅ npm run create-sbt    # Create your SBT"
echo "  ✅ npm run verify-sbt    # Verify it's non-transferable"
echo ""
echo "If GitHub URLs are NOT working:"
echo "  📖 Follow GITHUB_SETUP_GUIDE.md for detailed setup instructions"
echo "  🔧 Set up GitHub repository with your images and metadata"
echo "  🌐 Enable GitHub Pages"
echo "  🔄 Run 'npm run check-urls' to verify"
echo ""
echo "📚 Documentation:"
echo "  📖 README.md - Main documentation"
echo "  📖 GITHUB_SETUP_GUIDE.md - GitHub setup instructions"
echo "  📖 docs/TECHNICAL_GUIDE.md - Technical details"
echo ""
echo "🎉 Setup complete! Follow the next steps above to continue."
