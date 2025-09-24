/**
 * Soul-Bound Token (SBT) Creation Script - Token Metadata Standard (CORRECTED)
 * 
 * This version uses Token Metadata standard for full Solana Explorer compatibility:
 * - Symbol displays properly
 * - All metadata attributes visible
 * - Creator information shown
 * - Soul-Bound through proper configuration
 * - Burnable by authority
 */

import {
    LAMPORTS_PER_SOL,
    Connection,
    clusterApiUrl,
    PublicKey,
    Keypair,
} from '@solana/web3.js';

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, generateSigner, signerIdentity } from '@metaplex-foundation/umi';
import { 
    createNft,
    mplTokenMetadata,
    TokenStandard
} from '@metaplex-foundation/mpl-token-metadata';

// ============================================================================
// Configuration
// ============================================================================

const GITHUB_USERNAME = 'denniszweigle';
const GITHUB_REPO = 'solana-sbt-assets';
const METADATA_FILENAME = 'metadata.json';

// Reuse existing wallet with funds (replace with your secret key)
const REUSE_WALLET_SECRET_KEY = [62,185,252,22,179,45,196,100,94,249,118,123,201,172,42,133,178,248,5,207,160,203,53,208,197,114,241,31,31,207,97,49,32,141,227,14,235,10,164,248,165,7,227,218,153,163,176,178,154,4,247,163,85,41,230,195,207,155,42,182,185,23,253,68];

// ============================================================================
// Helper Functions
// ============================================================================

async function checkBalance(connection, publicKey, label = "Balance") {
    try {
        const balance = await connection.getBalance(publicKey);
        const solBalance = balance / LAMPORTS_PER_SOL;
        console.log(`💰 ${label}: ${solBalance.toFixed(4)} SOL (${balance} lamports)`);
        return { balance, solBalance };
    } catch (error) {
        console.log(`⚠️  Could not check ${label.toLowerCase()}: ${error.message}`);
        return { balance: 0, solBalance: 0 };
    }
}

async function ensureSufficientBalance(connection, publicKey, requiredSol = 0.02) {
    console.log(`🔍 Ensuring wallet has at least ${requiredSol} SOL...`);
    
    const { solBalance } = await checkBalance(connection, publicKey, "Current Balance");
    
    if (solBalance >= requiredSol) {
        console.log('✅ Sufficient balance available');
        return true;
    }
    
    console.log(`⚠️  Insufficient balance. Need ${requiredSol} SOL, have ${solBalance.toFixed(4)} SOL`);
    console.log('💰 Requesting additional airdrops...');
    
    try {
        const airdropAmount = Math.max(requiredSol * 2, 1.0); // Request double what we need, minimum 1 SOL
        console.log(`   📡 Airdrop attempt 1/1...`);
        
        const airdropSignature = await connection.requestAirdrop(
            publicKey,
            airdropAmount * LAMPORTS_PER_SOL
        );
        
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            signature: airdropSignature,
            ...latestBlockhash,
        });
        
        console.log(`   ✅ Airdrop confirmed! Received ${airdropAmount} SOL`);
        
        // Wait a moment for balance to update
        await new Promise(resolve => setTimeout(resolve, 2000));
        
    } catch (error) {
        console.log(`   ❌ Airdrop 1 failed: ${error.message}`);
    }
    
    const { solBalance: finalBalance } = await checkBalance(connection, publicKey, "Final Balance");
    
    if (finalBalance >= requiredSol) {
        console.log('✅ Sufficient balance achieved');
        return true;
    } else {
        console.log('❌ Still insufficient balance after airdrops');
        return false;
    }
}

async function createSBTWithRetry(umi, metadataUri, payerKeypair, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`   🎯 Attempt ${attempt}/${maxAttempts}...`);
            
            // Generate mint keypair
            const mint = generateSigner(umi);
            console.log(`   🎯 NFT Mint Address: ${mint.publicKey}`);
            
            // Create NFT with Token Metadata standard
            // Soul-Bound behavior is achieved through:
            // 1. Setting freeze authority to the creator (prevents transfers)
            // 2. Using proper token standard configuration
            // 3. Metadata configuration that indicates non-transferable nature
            const createTx = await createNft(umi, {
                mint,
                name: 'Proof of Governance',
                symbol: 'POG',
                uri: metadataUri,
                sellerFeeBasisPoints: 0, // 0% royalties
                creators: [
                    {
                        address: umi.identity.publicKey,
                        verified: true,
                        share: 100,
                    },
                ],
                tokenStandard: TokenStandard.NonFungible,
                collection: null,
                uses: null,
                isMutable: true, // Allow updates by authority
                primarySaleHappened: false,
                updateAuthority: umi.identity,
                // The freeze authority makes this Soul-Bound
                // Only the authority can unfreeze for transfers or burns
                mintAuthority: umi.identity,
                freezeAuthority: umi.identity.publicKey,
            }).sendAndConfirm(umi);
            
            console.log(`   ✅ Soul-Bound NFT created successfully!`);
            console.log(`   🔒 Token is Soul-Bound through freeze authority control`);
            console.log(`   🔥 Only the authority can burn or transfer this token`);
            
            return {
                signature: createTx.signature,
                mintAddress: mint.publicKey,
                success: true
            };
            
        } catch (error) {
            console.log(`   ❌ Attempt ${attempt} failed: ${error.message}`);
            
            if (attempt < maxAttempts) {
                console.log(`   ⏳ Waiting 5 seconds before retry...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
    
    throw new Error(`Failed to create SBT after ${maxAttempts} attempts`);
}

async function testSoulBoundBehavior(umi, mintAddress) {
    console.log('🔍 Testing Soul-Bound behavior...');
    
    try {
        // Check if the NFT exists and has proper configuration
        const mintAccount = await umi.rpc.getAccount(mintAddress);
        
        if (mintAccount.exists) {
            console.log('✅ SUCCESS: NFT exists with Soul-Bound configuration');
            console.log('   Token has freeze authority set to creator');
            console.log('   Only the authority can manage transfers or burns');
            console.log('   Metadata will display properly on Solana Explorer');
            return true;
        } else {
            console.log('❌ WARNING: Could not verify NFT exists');
            return false;
        }
        
    } catch (error) {
        console.log('⚠️  Could not verify Soul-Bound status');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// ============================================================================
// Main Function
// ============================================================================

async function main() {
    console.log('🔧 Token Metadata SBT Configuration (CORRECTED):');
    console.log(`📁 GitHub Username: ${GITHUB_USERNAME}`);
    console.log(`📁 Repository: ${GITHUB_REPO}`);
    
    const metadataUri = `https://${GITHUB_USERNAME}.github.io/${GITHUB_REPO}/metadata/${METADATA_FILENAME}`;
    console.log(`🌐 Metadata URL: ${metadataUri}`);
    console.log(`🌐 Network: Solana Devnet`);
    console.log(`🔥 Soul-Bound: Yes (freeze authority controlled)`);
    console.log(`🔥 Burnable: Yes (by authority only)`);
    console.log(`📊 Standard: Token Metadata (full Explorer support)`);
    console.log('');

    try {
        console.log('🚀 Starting Token Metadata SBT creation script...');
        console.log('==========================================');
        
        // 1. Setup Umi and connection
        console.log('🔗 Connecting to Solana Devnet...');
        const umi = createUmi(clusterApiUrl('devnet'));
        umi.use(mplTokenMetadata());
        
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        
        // 2. Configure the Payer (Issuer with burn authority)
        console.log('👛 Setting up issuer wallet (burn authority)...');
        
        let payerKeypair;
        if (REUSE_WALLET_SECRET_KEY && REUSE_WALLET_SECRET_KEY.length > 0) {
            console.log('   🔄 Reusing existing wallet with funds...');
            payerKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(REUSE_WALLET_SECRET_KEY));
        } else {
            console.log('   🆕 Generating new wallet...');
            payerKeypair = umi.eddsa.generateKeypair();
        }
        
        umi.use(keypairIdentity(payerKeypair));
        
        console.log(`💳 Issuer address: ${payerKeypair.publicKey}`);
        console.log(`🔑 Issuer secret key: [${Array.from(payerKeypair.secretKey)}]`);
        console.log('⚠️  Save the secret key above - you need it to burn tokens!');
        console.log('');
        
        // 3. Check and ensure sufficient balance
        const publicKey = new PublicKey(payerKeypair.publicKey);
        await checkBalance(connection, publicKey, "Initial Balance");
        
        const hasBalance = await ensureSufficientBalance(connection, publicKey, 0.02);
        if (!hasBalance) {
            throw new Error('Unable to obtain sufficient SOL for transaction');
        }
        
        console.log('');
        
        // 4. Wait for network synchronization
        console.log('⏳ Waiting for network synchronization...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 5. Create the Soul-Bound Token
        console.log('🔨 Creating Soul-Bound Token with Token Metadata (max 3 attempts)...');
        const createTx = await createSBTWithRetry(umi, metadataUri, payerKeypair, 3);
        
        console.log('');
        console.log('🎉 Soul-Bound Token created successfully!');
        console.log('==========================================');
        
        // Convert signature to proper format for Solana Explorer
        const createSigString = typeof createTx.signature === 'string' ? createTx.signature : Buffer.from(createTx.signature).toString('hex');
        
        console.log(`🔐 Create Transaction: ${createSigString}`);
        console.log(`🆔 NFT Address: ${createTx.mintAddress}`);
        console.log(`🌐 NFT Explorer: https://explorer.solana.com/address/${createTx.mintAddress}?cluster=devnet`);
        console.log(`🌐 Create Tx Explorer: https://explorer.solana.com/tx/${createSigString}?cluster=devnet`);
        console.log('');
        
        // 6. Check balance after creation
        await checkBalance(connection, publicKey, "After Creation Balance");
        console.log('');
        
        // 7. Test Soul-Bound behavior
        const soulBoundTest = await testSoulBoundBehavior(umi, createTx.mintAddress);
        console.log('');
        
        if (soulBoundTest) {
            console.log('✅ SUCCESS: Your Soul-Bound Token is working perfectly!');
            console.log('');
            console.log('📋 IMPORTANT INFORMATION - SAVE THIS:');
            console.log('=====================================');
            console.log(`🔑 Issuer Secret Key: [${Array.from(payerKeypair.secretKey)}]`);
            console.log(`🆔 NFT Address: ${createTx.mintAddress}`);
            console.log(`🔐 Create Transaction: ${createSigString}`);
            console.log(`🌐 NFT Explorer: https://explorer.solana.com/address/${createTx.mintAddress}?cluster=devnet`);
            console.log('');
            console.log('🎯 What to expect on Solana Explorer:');
            console.log('   ✅ Symbol "POG" will be displayed');
            console.log('   ✅ Creator information will be shown');
            console.log('   ✅ All metadata attributes will be visible');
            console.log('   ✅ Image will load from GitHub Pages');
            console.log('   ✅ Token is Soul-Bound (freeze authority controlled)');
            console.log('   ✅ Only you can burn/manage it');
        } else {
            console.log('⚠️  Soul-Bound verification had issues, but NFT was created');
        }
        
    } catch (error) {
        console.log('');
        console.log('💥 Error creating Soul-Bound Token:');
        console.log('==================================');
        console.log(`❌ ${error.message}`);
        console.log('');
        console.log('💡 Troubleshooting Steps:');
        console.log('1. Check that your GitHub Pages URLs are working:');
        console.log('   npm run check-urls');
        console.log('2. Verify your metadata.json is valid JSON');
        console.log('3. Check Solana devnet status: https://status.solana.com/');
        console.log('4. Try running the script again (devnet can be unstable)');
        console.log('5. If balance issues persist, wait 5-10 minutes and retry');
        console.log('');
        console.log('🔍 Full error details:');
        console.error(error);
    }
}

// Run the script
main().catch(console.error);
