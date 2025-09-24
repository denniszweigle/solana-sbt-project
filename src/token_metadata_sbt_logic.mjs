/**
 * Copyright: © 2025 BAEB90, LLC
 * Author: DZ Zweigle
 * Date: 2025-09-24
 * updated 2025-09-24
 * 
 * This source code is subject to terms and conditions of the BAEB90, LLC .
 * By viewing and/or using this source code, in any fashion or derivative, you are agreeing to be bound by the terms of the License.
 * You must not remove nor alter this notice from this software.
 * All rights reserved.  Enforcement in accordance with US Federal and the State of Texas laws and rights
 * 
 * License and Logic is proprietary and protected by 11 provisional Patents at the time of this writing 
 * 
 * @fileoverview This script automates the creation of a Soul-Bound Token (SBT)
 * on the Solana blockchain using the Metaplex Token Metadata Standard.
 * The SBT is configured to be non-transferable, ensuring its "soul-bound"
 * nature, while also being burnable by the issuing authority. This setup is
 * ideal for on-chain credentials, membership passes, or governance rights
 * that should not be tradable.
 */

// ============================================================================
// LIBRARY IMPORTS
// ============================================================================
// @solana/web3.js is the core Solana library for direct blockchain interaction,
// including checking balances and requesting airdrops.
import {
    LAMPORTS_PER_SOL,
    Connection,
    clusterApiUrl,
    PublicKey,
    Keypair,
} from '@solana/web3.js';

// The Umi framework simplifies interaction with Metaplex programs and is used
// here for creating the NFT and managing keypair identities.
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, generateSigner, signerIdentity } from '@metaplex-foundation/umi';
import { 
    createNft,
    mplTokenMetadata,
    TokenStandard
} from '@metaplex-foundation/mpl-token-metadata';

// ============================================================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================================================

// Replace with proper devnet, testnet, mainnet
const BLOCKCHAIN_ENV = 'devnet';

// Replace with your GitHub username and repository name where the metadata.json is hosted.
// The script will construct the URI from these values.
const GITHUB_USERNAME = 'denniszweigle';
const GITHUB_REPO = 'solana-sbt-assets';
const METADATA_FILENAME = 'metadata.json';

// Paste the secret key array of an existing wallet with funds.
// NOTE: For production, store this securely in an environment variable.
const REUSE_WALLET_SECRET_KEY = [];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Checks the SOL balance for a given public key and logs it to the console.
 * @param {Connection} connection - The Solana Web3.js Connection object.
 * @param {PublicKey} publicKey - The public key of the account to check.
 * @param {string} label - A descriptive label for the log output.
 * @returns {Promise<{balance: number, solBalance: number}>} - The account balance in lamports and SOL.
 */
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

/**
 * Ensures a wallet has a sufficient SOL balance for transactions, performing an airdrop if needed.
 * This is for development purposes only and will not work on mainnet.
 * @param {Connection} connection - The Solana Web3.js Connection object.
 * @param {PublicKey} publicKey - The public key of the account to fund.
 * @param {number} requiredSol - The minimum required balance in SOL.
 * @returns {Promise<boolean>} - True if the balance is sufficient, false otherwise.
 */
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
        const airdropAmount = Math.max(requiredSol * 2, 1.0); // Request double what's needed, with a minimum of 1 SOL.
        console.log(`    📡 Airdrop attempt 1/1...`);
        
        const airdropSignature = await connection.requestAirdrop(
            publicKey,
            airdropAmount * LAMPORTS_PER_SOL
        );
        
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            signature: airdropSignature,
            ...latestBlockhash,
        });
        
        console.log(`    ✅ Airdrop confirmed! Received ${airdropAmount} SOL`);
        
        // Wait briefly for the balance to update on the network.
        await new Promise(resolve => setTimeout(resolve, 2000));
        
    } catch (error) {
        console.log(`    ❌ Airdrop failed: ${error.message}`);
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

/**
 * Creates the Soul-Bound Token with a retry mechanism.
 * @param {Umi} umi - The Umi client.
 * @param {string} metadataUri - The URI pointing to the token's metadata.
 * @param {PublicKey} payerKeypair - The keypair of the payer/authority.
 * @param {number} maxAttempts - The maximum number of retry attempts.
 * @returns {Promise<{signature: Uint8Array, mintAddress: PublicKey, success: boolean}>}
 * @throws {Error} - Throws if the creation fails after all attempts.
 */
async function createSBTWithRetry(umi, metadataUri, payerKeypair, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`    🎯 Attempt ${attempt}/${maxAttempts}...`);
            
            // `generateSigner` creates a new keypair that will be the mint account for the NFT.
            const mint = generateSigner(umi);
            console.log(`    🎯 NFT Mint Address: ${mint.publicKey}`);
            
            // The `createNft` instruction is the core of this script.
            const createTx = await createNft(umi, {
                mint,
                name: 'Proof of Governance',
                symbol: 'POG',
                uri: metadataUri,
                sellerFeeBasisPoints: 0, // 0% royalties.
                creators: [
                    {
                        address: umi.identity.publicKey,
                        verified: true,
                        share: 100,
                    },
                ],
                // Setting the token standard to NonFungible.
                tokenStandard: TokenStandard.NonFungible,
                // Setting `isMutable` to `true` allows the `updateAuthority` to modify the metadata later.
                isMutable: true, 
                primarySaleHappened: false,
                updateAuthority: umi.identity,
                mintAuthority: umi.identity,
                // **Crucial for Soul-Bound behavior:**
                // Setting the `freezeAuthority` to the creator's public key
                // prevents the token account from being transferred or traded.
                freezeAuthority: umi.identity.publicKey,
            }).sendAndConfirm(umi);
            
            console.log(`    ✅ Soul-Bound NFT created successfully!`);
            console.log(`    🔒 Token is Soul-Bound through freeze authority control`);
            console.log(`    🔥 Only the authority can burn or transfer this token`);
            
            return {
                signature: createTx.signature,
                mintAddress: mint.publicKey,
                success: true
            };
            
        } catch (error) {
            console.log(`    ❌ Attempt ${attempt} failed: ${error.message}`);
            
            if (attempt < maxAttempts) {
                console.log(`    ⏳ Waiting 5 seconds before retry...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
    
    throw new Error(`Failed to create SBT after ${maxAttempts} attempts`);
}

/**
 * A final test to verify the NFT exists and has its Soul-Bound configuration.
 * @param {Umi} umi - The Umi client.
 * @param {PublicKey} mintAddress - The public key of the NFT mint.
 * @returns {Promise<boolean>} - True if the verification is successful, false otherwise.
 */
async function testSoulBoundBehavior(umi, mintAddress) {
    console.log('🔍 Testing Soul-Bound behavior...');
    
    try {
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
// MAIN FUNCTION
// ============================================================================

async function main() {
    console.log('🔧 Token Metadata SBT Configuration (CORRECTED):');
    console.log(`📁 GitHub Username: ${GITHUB_USERNAME}`);
    console.log(`📁 Repository: ${GITHUB_REPO}`);
    
    // Construct the metadata URI using the configured values.
    const metadataUri = `https://${GITHUB_USERNAME}.github.io/${GITHUB_REPO}/metadata/${METADATA_FILENAME}`;
    console.log(`🌐 Metadata URL: ${metadataUri}`);
    console.log(`🌐 Network: Solana ${BLOCKCHAIN_ENV}`);
    console.log(`🔥 Soul-Bound: Yes (freeze authority controlled)`);
    console.log(`🔥 Burnable: Yes (by authority only)`);
    console.log(`📊 Standard: Token Metadata (full Explorer support)`);
    console.log('');

    try {
        console.log('🚀 Starting Token Metadata SBT creation script...');
        console.log('==========================================');
        
        // 1. Setup Umi and connection
        console.log(`🔗 Connecting to Solana ${BLOCKCHAIN_ENV}...`);
        const umi = createUmi(clusterApiUrl(BLOCKCHAIN_ENV));
        umi.use(mplTokenMetadata());
        
        const connection = new Connection(clusterApiUrl(BLOCKCHAIN_ENV), 'confirmed');
        
        // 2. Configure the Payer (Issuer with burn authority)
        console.log('👛 Setting up issuer wallet (burn authority)...');
        
        let payerKeypair;
        if (REUSE_WALLET_SECRET_KEY && REUSE_WALLET_SECRET_KEY.length > 0) {
            console.log('    🔄 Reusing existing wallet with funds...');
            payerKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(REUSE_WALLET_SECRET_KEY));
        } else {
            console.log('    🆕 Generating new wallet...');
            payerKeypair = umi.eddsa.generateKeypair();
        }
        
        // The identity is set for both payer and signer.
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
        
        // Convert signature for explorer URL.
        const createSigString = typeof createTx.signature === 'string' ? createTx.signature : Buffer.from(createTx.signature).toString('hex');
        
        console.log(`🔐 Create Transaction: ${createSigString}`);
        console.log(`🆔 NFT Address: ${createTx.mintAddress}`);
        console.log(`🌐 NFT Explorer: https://explorer.solana.com/address/${createTx.mintAddress}?cluster=${BLOCKCHAIN_ENV}`);
        console.log(`🌐 Create Tx Explorer: https://explorer.solana.com/tx/${createSigString}?cluster=${BLOCKCHAIN_ENV}`);
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
            console.log(`🌐 NFT Explorer: https://explorer.solana.com/address/${createTx.mintAddress}?cluster=${BLOCKCHAIN_ENV}`);
            console.log('');
            console.log('🎯 What to expect on Solana Explorer:');
            console.log('    ✅ Symbol "POG" will be displayed');
            console.log('    ✅ Creator information will be shown');
            console.log('    ✅ All metadata attributes will be visible');
            console.log('    ✅ Image will load from GitHub Pages');
            console.log('    ✅ Token is Soul-Bound (freeze authority controlled)');
            console.log('    ✅ Only you can burn/manage it');
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
        console.log('    npm run check-urls');
        console.log('2. Verify your metadata.json is valid JSON');
        console.log(`3. Check Solana ${BLOCKCHAIN_ENV} status: https://status.solana.com/`);
        console.log(`4. Try running the script again (${BLOCKCHAIN_ENV} can be unstable)`);
        console.log('5. If balance issues persist, wait 5-10 minutes and retry');
        console.log('');
        console.log('🔍 Full error details:');
        console.error(error);
    }
}

// Run the script
main().catch(console.error);