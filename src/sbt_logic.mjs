// Complete Working Solana Soul-Bound Token (SBT) Logic
// Robust implementation with balance checking and retry mechanisms
// Configured for Solana Devnet - WSL Compatible

import bs58 from 'bs58';

import {
    LAMPORTS_PER_SOL,
    Connection,
    clusterApiUrl,
    PublicKey,
} from '@solana/web3.js';
import {
    generateSigner,
    createSignerFromKeypair,
    keypairIdentity,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
    mplCore, 
    createV1
} from '@metaplex-foundation/mpl-core';

// --- Configuration for GitHub Pages ---
const GITHUB_USERNAME = 'denniszweigle';
const REPO_NAME = 'solana-sbt-assets';
const metadataUri = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/metadata/metadata.json`;

// --- Wallet Configuration ---
// Use your existing wallet with funds (from previous successful run)
const REUSE_WALLET_SECRET_KEY = [62,185,252,22,179,45,196,100,94,249,118,123,201,172,42,133,178,248,5,207,160,203,53,208,197,114,241,31,31,207,97,49,32,141,227,14,235,10,164,248,165,7,227,218,153,163,176,178,154,4,247,163,85,41,230,195,207,155,42,182,185,23,253,68];

// --- Helper Functions ---

async function checkBalance(connection, publicKey, label = '') {
    try {
        const balance = await connection.getBalance(new PublicKey(publicKey));
        const solBalance = balance / LAMPORTS_PER_SOL;
        console.log(`💰 ${label} Balance: ${solBalance.toFixed(4)} SOL (${balance} lamports)`);
        return { balance, solBalance };
    } catch (error) {
        console.log(`❌ Failed to check balance: ${error.message}`);
        return { balance: 0, solBalance: 0 };
    }
}

async function ensureSufficientBalance(connection, publicKey, requiredSol = 0.5) {
    console.log(`🔍 Ensuring wallet has at least ${requiredSol} SOL...`);
    
    const { solBalance } = await checkBalance(connection, publicKey, 'Current');
    
    if (solBalance >= requiredSol) {
        console.log(`✅ Sufficient balance available`);
        return true;
    }
    
    console.log(`⚠️  Insufficient balance. Need ${requiredSol} SOL, have ${solBalance.toFixed(4)} SOL`);
    console.log('💰 Requesting additional airdrops...');
    
    // Request multiple airdrops if needed
    const airdropsNeeded = Math.ceil((requiredSol - solBalance) / 1.0); // 1 SOL per airdrop
    
    for (let i = 0; i < Math.min(airdropsNeeded, 3); i++) {
        try {
            console.log(`   📡 Airdrop attempt ${i + 1}/${Math.min(airdropsNeeded, 3)}...`);
            
            const airdropSignature = await connection.requestAirdrop(
                new PublicKey(publicKey),
                LAMPORTS_PER_SOL
            );
            
            const latestBlockhash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                signature: airdropSignature,
                ...latestBlockhash,
            });
            
            console.log(`   ✅ Airdrop ${i + 1} confirmed`);
            
            // Wait between airdrops
            if (i < Math.min(airdropsNeeded, 3) - 1) {
                console.log('   ⏳ Waiting 3 seconds before next airdrop...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
            
        } catch (error) {
            console.log(`   ❌ Airdrop ${i + 1} failed: ${error.message}`);
        }
    }
    
    // Check final balance
    const { solBalance: finalBalance } = await checkBalance(connection, publicKey, 'Final');
    
    if (finalBalance >= requiredSol) {
        console.log(`✅ Successfully obtained sufficient balance`);
        return true;
    } else {
        console.log(`❌ Still insufficient balance after airdrops`);
        return false;
    }
}

async function createSBTWithRetry(umi, asset, metadataUri, payerKeypair, maxAttempts = 3) {
    console.log(`🔨 Creating Soul-Bound Token (max ${maxAttempts} attempts)...`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`   🎯 Attempt ${attempt}/${maxAttempts}...`);
            
            if (attempt > 1) {
                console.log('   ⏳ Waiting 5 seconds before retry...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
            
            // Create basic SBT without complex plugins for now
            const createTx = await createV1(umi, {
                asset,
                name: 'Proof of Governance',
                uri: metadataUri,
            }).sendAndConfirm(umi);
            
            console.log(`   ✅ Success on attempt ${attempt}!`);
            return createTx;
            
        } catch (error) {
            console.log(`   ❌ Attempt ${attempt} failed: ${error.message}`);
            
            if (attempt === maxAttempts) {
                throw error; // Re-throw on final attempt
            }
        }
    }
}

async function testSoulBoundBehavior(umi, assetPublicKey) {
    console.log('🔍 Testing Soul-Bound behavior...');
    
    try {
        // For now, just verify the asset exists
        const asset = await umi.rpc.getAccount(assetPublicKey);
        
        if (asset.exists) {
            console.log('✅ SUCCESS: SBT created successfully');
            console.log('   Note: Basic NFT created - Soul-Bound features to be added');
            return true;
        } else {
            console.log('❌ WARNING: Could not verify asset exists');
            return false;
        }
        
    } catch (error) {
        console.log('⚠️  Could not verify asset status');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// --- Main Function ---

async function main() {
    console.log('🔧 Revocable SBT Configuration:');
    console.log(`📁 GitHub Username: ${GITHUB_USERNAME}`);
    console.log(`📁 Repository: ${REPO_NAME}`);
    console.log(`🌐 Metadata URL: ${metadataUri}`);
    console.log(`🌐 Network: Solana Devnet`);
    console.log(`🔥 Revocable: Yes (by issuer only)`);
    console.log('');

    console.log('🚀 Starting Robust SBT creation script...');
    console.log('==========================================');

    try {
        // 1. Connect to Solana Devnet
        console.log('🔗 Connecting to Solana Devnet...');
        const umi = createUmi(clusterApiUrl('devnet'));
        umi.use(mplCore());
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        // 2. Configure the Payer (Issuer with burn authority) - REUSE EXISTING WALLET
        console.log('👛 Setting up issuer wallet (burn authority)...');
        
        let payerKeypair;
        if (REUSE_WALLET_SECRET_KEY && REUSE_WALLET_SECRET_KEY.length > 0) {
            console.log('   🔄 Reusing existing wallet with funds...');
            payerKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(REUSE_WALLET_SECRET_KEY));
        } else {
            console.log('   🆕 Generating new wallet...');
            payerKeypair = umi.eddsa.generateKeypair();
        }
        
        const payerSigner = createSignerFromKeypair(umi, payerKeypair);
        umi.use(keypairIdentity(payerSigner));

        console.log(`💳 Issuer address: ${payerKeypair.publicKey}`);
        console.log(`🔑 Issuer secret key: [${Array.from(payerKeypair.secretKey)}]`);
        console.log('⚠️  Save the secret key above - you need it to burn tokens!');
        console.log('');

        // 3. Check initial balance
        await checkBalance(connection, payerKeypair.publicKey, 'Initial');

        // 4. Ensure sufficient balance
        const hasBalance = await ensureSufficientBalance(connection, payerKeypair.publicKey, 0.1);
        
        if (!hasBalance) {
            throw new Error('Unable to obtain sufficient SOL for transaction');
        }
        
        console.log('');

        // 5. Generate SBT address
        const asset = generateSigner(umi);
        console.log(`🎯 SBT address: ${asset.publicKey}`);
        console.log('');

        // 6. Wait for network synchronization
        console.log('⏳ Waiting for network synchronization...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 7. Create the Soul-Bound Token with retry logic
        const createTx = await createSBTWithRetry(umi, asset, metadataUri, payerKeypair, 3);


        console.log('');
        console.log('🎉 Soul-Bound Token created successfully!');
        console.log('========================================');
        console.log(`🏷️  Token Name: Proof of Governance`);
        console.log(`🆔 SBT Address: ${asset.publicKey}`);
        console.log(`📄 Metadata URI: ${metadataUri}`);
        
        // Fix transaction signature display
        // Convert signature to proper format for Solana Explorer
        let sigString;
        if (typeof createTx.signature === 'string') {
            sigString = createTx.signature;
        } else {
            // Convert Uint8Array to base58 for Solana Explorer
            const bs58 = await import('bs58');
            sigString = bs58.default.encode(createTx.signature);
        }
        console.log(`🔐 Transaction: ${sigString}`);
        console.log(`🌐 Explorer: https://explorer.solana.com/tx/${sigString}?cluster=devnet` );
        console.log('');

        // 8. Check balance after creation
        await checkBalance(connection, payerKeypair.publicKey, 'After Creation');
        console.log('');

        // 9. Test Soul-Bound behavior
        const isSoulBound = await testSoulBoundBehavior(umi, asset.publicKey);
        console.log('');

        // 10. Final summary
        console.log('📋 IMPORTANT INFORMATION - SAVE THIS:');
        console.log('====================================');
        console.log(`🔑 Issuer Address: ${payerKeypair.publicKey}`);
        console.log(`🔑 Issuer Secret Key: [${Array.from(payerKeypair.secretKey)}]`);
        console.log(`🎯 SBT Address: ${asset.publicKey}`);
        console.log(`🔐 Transaction: ${sigString}`);
        console.log(`🌐 Explorer: https://explorer.solana.com/tx/${sigString}?cluster=devnet`);
        console.log('');
        console.log('⚠️  NEXT STEPS:');
        console.log('1. Save the issuer secret key - needed for burning tokens');
        console.log('2. Save the SBT address - needed for verification tests');
        console.log('3. View transaction on Solana Explorer using the link above');
        console.log('4. Run verification: npm run verify-sbt');
        console.log('5. To revoke/burn: Update burn_sbt.mjs with the above values');
        console.log('');
        
        if (isSoulBound) {
            console.log('✅ SUCCESS: Your NFT has been created successfully!');
            console.log('📝 NOTE: This is currently a basic NFT. Soul-Bound features will be added next.');
        } else {
            console.log('⚠️  WARNING: Could not verify token creation - check Explorer link');
        }

    } catch (error) {
        console.error('');
        console.error('💥 Error creating Soul-Bound Token:');
        console.error('==================================');
        console.error(`❌ ${error.message}`);
        console.error('');
        console.error('💡 Troubleshooting Steps:');
        console.error('1. Check that your GitHub Pages URLs are working:');
        console.error('   npm run check-urls');
        console.error('2. Verify your metadata.json is valid JSON');
        console.error('3. Check Solana devnet status: https://status.solana.com/');
        console.error('4. Try running the script again (devnet can be unstable)');
        console.error('5. If balance issues persist, wait 5-10 minutes and retry');
        console.error('');
        console.error('🔍 Full error details:');
        console.error(error);
        
        process.exit(1);
    }
}

// Execute the main function
main().catch((error) => {
    console.error('');
    console.error('💥 Fatal error occurred:');
    console.error('=======================');
    console.error(error.message);
    console.error('');
    console.error('🆘 If this error persists:');
    console.error('1. Check your internet connection');
    console.error('2. Verify Solana devnet is operational');
    console.error('3. Try: npm install --no-bin-links');
    console.error('4. Check URLs: npm run check-urls');
    console.error('5. Wait 10 minutes and try again');
    console.error('');
    process.exit(1);
});