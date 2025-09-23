# Windows WSL Permission Fix

## 🚨 Issue: npm install fails with EPERM error

You're encountering a Windows WSL permission issue with the Irys SDK. Here are the solutions:

## 🔧 Solution 1: Use Fixed Files (Recommended)

I've created simplified versions without the problematic Irys dependency:

### Step 1: Replace package.json
```bash
# In your project directory
cp package.json package.json.backup
# Then replace with the fixed version (provided separately)
```

### Step 2: Replace the SBT logic file
```bash
# Replace the main logic file
cp src/corrected_sbt_logic.mjs src/corrected_sbt_logic.mjs.backup
# Then replace with the fixed version (provided separately)
```

### Step 3: Clean install
```bash
# Remove node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

## 🔧 Solution 2: WSL Permission Fix

If you want to keep the original files:

### Option A: Change WSL mount options
```bash
# Edit /etc/wsl.conf
sudo nano /etc/wsl.conf

# Add these lines:
[automount]
options = "metadata,umask=22,fmask=11"

# Restart WSL
exit
# Then restart WSL from Windows
```

### Option B: Use different directory
```bash
# Move to Linux filesystem instead of Windows mount
cp -r /mnt/c/Users/dennis\ pc/downloads/solana-sbt-project ~/solana-sbt-project
cd ~/solana-sbt-project
npm install
```

### Option C: Run with different permissions
```bash
# Try installing with --no-bin-links
npm install --no-bin-links

# Or try with sudo (not recommended but may work)
sudo npm install --unsafe-perm=true --allow-root
```

## 🔧 Solution 3: Use Node.js directly on Windows

Instead of WSL, use Windows Command Prompt or PowerShell:

```cmd
# In Windows Command Prompt
cd "C:\Users\dennis pc\downloads\solana-sbt-project"
npm install
```

## ✅ Recommended Approach

**Use Solution 1** - I've removed the problematic Irys dependency since you're using GitHub Pages for hosting anyway. The Irys uploader was only needed for decentralized storage, which you don't need for testing.

## 🎯 What Changed

- **Removed**: `@metaplex-foundation/umi-uploader-irys` (causing the error)
- **Removed**: `@metaplex-foundation/mpl-token-metadata` (not needed for MPL Core)
- **Kept**: All essential dependencies for SBT creation
- **Result**: Faster install, no permission issues, same functionality

## 📋 Quick Fix Commands

```bash
# 1. Clean up
rm -rf node_modules package-lock.json

# 2. Use the fixed package.json (I'll provide this)

# 3. Install clean
npm install

# 4. Test
npm run check-urls
```

The fixed version will work perfectly for your GitHub Pages setup and Solana devnet testing!
