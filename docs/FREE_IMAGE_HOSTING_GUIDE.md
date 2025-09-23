# Free Image Hosting Services for NFT Testing

## Quick Options (Ready to Use)

Here are the best free services for testing your Solana SBT with images:

### 1. 🔥 **ImgBB** (Recommended for Testing)
- **URL**: https://imgbb.com/
- **Pros**: Direct links, 32MB limit, no registration required
- **Cons**: Not permanent (may delete after inactivity)
- **Best for**: Quick testing and development

**How to use:**
1. Go to imgbb.com
2. Drag & drop your image
3. Copy the "Direct link" URL
4. Use in your metadata

### 2. 📁 **GitHub Pages** (Best for Permanent Testing)
- **URL**: github.com
- **Pros**: Free, permanent, version controlled
- **Cons**: Requires GitHub account
- **Best for**: Serious testing and small projects

### 3. 🌐 **IPFS Free Services**
- **Pinata**: 1GB free tier
- **NFT.Storage**: Free for NFTs (by Protocol Labs)
- **Web3.Storage**: Free tier available

### 4. 📸 **PostImages**
- **URL**: https://postimages.org/
- **Pros**: No registration, direct links
- **Cons**: May have ads, not guaranteed permanent

## Detailed Setup Instructions

### Option 1: ImgBB (Fastest Setup)

```bash
# 1. Go to https://imgbb.com/
# 2. Upload your image
# 3. Copy the direct link
# 4. Update your metadata
```

Example direct link format:
```
https://i.ibb.co/abc123/your-image.png
```

### Option 2: GitHub Pages (Most Reliable)

1. **Create a new GitHub repository**
2. **Upload your images to an `images/` folder**
3. **Enable GitHub Pages in repository settings**
4. **Access via**: `https://yourusername.github.io/repo-name/images/image.png`

### Option 3: NFT.Storage (Decentralized)

```javascript
// Install the client
npm install nft.storage

// Upload script
import { NFTStorage } from 'nft.storage'
const client = new NFTStorage({ token: 'your-api-key' })
const cid = await client.storeBlob(imageFile)
const url = `https://nftstorage.link/ipfs/${cid}`
```

## Updated Example Files

### Sample Metadata with ImgBB
```json
{
  "name": "Proof of Governance",
  "symbol": "POG",
  "description": "A Soul-Bound Token for testing",
  "image": "https://i.ibb.co/abc123/pog-token.png",
  "attributes": [
    {
      "trait_type": "Token Type",
      "value": "Soul-Bound Token"
    }
  ]
}
```

### Quick Test Script
```javascript
// Test your image URL
const testImageUrl = "https://i.ibb.co/abc123/your-image.png";

fetch(testImageUrl)
  .then(response => {
    if (response.ok) {
      console.log("✅ Image URL is working!");
    } else {
      console.log("❌ Image URL failed");
    }
  })
  .catch(err => console.log("❌ Error:", err));
```

## Comparison Table

| Service | Free Tier | Permanence | Setup Time | Best For |
|---------|-----------|------------|------------|----------|
| **ImgBB** | 32MB | Temporary | 30 seconds | Quick testing |
| **GitHub Pages** | 1GB | Permanent | 5 minutes | Serious testing |
| **NFT.Storage** | Free | Permanent | 10 minutes | Production-like |
| **PostImages** | Unlimited | Temporary | 30 seconds | Quick testing |

## Recommended Workflow for Testing

### Phase 1: Quick Testing (ImgBB)
```bash
# 1. Upload test image to ImgBB
# 2. Get direct link
# 3. Update metadata URI in your code
# 4. Test SBT creation
```

### Phase 2: Stable Testing (GitHub Pages)
```bash
# 1. Create GitHub repo
# 2. Upload images and metadata
# 3. Enable Pages
# 4. Use permanent URLs
```

### Phase 3: Production (Arweave/IPFS)
```bash
# 1. Use proper decentralized storage
# 2. Pay for permanent hosting
# 3. Update all URLs
```

## Code Updates for Your Project

### Update metadata in your SBT script:
```javascript
// Replace this line in src/corrected_sbt_logic.mjs
const metadataUri = 'https://your-github-pages-url/metadata.json';
// or
const metadataUri = 'https://i.ibb.co/abc123/metadata.json';
```

### Create a test metadata file:
```json
{
  "name": "Test SBT",
  "symbol": "TSBT",
  "description": "Testing Soul-Bound Token",
  "image": "https://i.ibb.co/abc123/test-image.png"
}
```

## Important Notes

⚠️ **For Testing Only**: These free services are perfect for development and testing, but for production NFTs, use permanent storage like Arweave or paid IPFS pinning.

✅ **Quick Start**: ImgBB is the fastest way to get started - just upload and copy the direct link.

🔒 **For Production**: Always use decentralized, permanent storage for real NFTs.

## Ready-to-Use Test Images

You can use these public test images for immediate testing:

```
https://via.placeholder.com/512x512/FF6B6B/FFFFFF?text=SBT+Test
https://via.placeholder.com/512x512/4ECDC4/FFFFFF?text=POG+Token
https://via.placeholder.com/512x512/45B7D1/FFFFFF?text=Soul+Bound
```

Just copy any of these URLs and use them in your metadata for instant testing!
