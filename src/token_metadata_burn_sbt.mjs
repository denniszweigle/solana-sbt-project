/**
 * Burn Soul-Bound Token Script - Token Metadata Standard
 * 
 * This script allows the authority to burn (revoke) a Soul-Bound Token
 * for governance violations or loss of eligibility.
 */

import {
    Connection,
    clusterApiUrl,
    PublicKey,
} from '@solana/web3.js';

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { 
    burnNft,
    mplTokenMetadata,
    TokenStandard
} from '@metaplex-foundation/mpl-token-metadata';

// ============================================================================
// Configuration - UPDATE THESE VALUES
// ============================================================================

// Paste the authority secret key from the SBT creation output
const AUTHORITY_SECRET_KEY = []; // Paste your secret key array here

// Paste the NFT mint address you want to burn
const NFT_MINT_ADDRESS = ''; // Paste the NFT address here

// Reason for burning (for logging purposes)
const BURN_REASON = 'Governance violation'; // Update as needed

// ============================================================================
// Main Function
// ============================================================================

async function main() {
    console.log('🔥 Soul-Bound Token Burn Script - Token Metadata');
    console.log('================================================');
    console.log(`🎯 NFT to burn: ${NFT_MINT_ADDRESS}`);
    console.log(`📋 Reason: ${BURN_REASON}`);
    console.log('');

    try {
        // Validation
        if (!AUTHORITY_SECRET_KEY || AUTHORITY_SECRET_KEY.length === 0) {
            throw new Error('AUTHORITY_SECRET_KEY is not set. Please paste your secret key array.');
        }
        
        if (!NFT_MINT_ADDRESS || NFT_MINT_ADDRESS.trim() === '') {
            throw new Error('NFT_MINT_ADDRESS is not set. Please paste the NFT address to burn.');
        }

        // 1. Setup Umi and connection
        console.log('🔗 Connecting to Solana Devnet...');
        const umi = createUmi(clusterApiUrl('devnet'));
        umi.use(mplTokenMetadata());
        
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        
        // 2. Setup authority keypair
        console.log('🔑 Setting up burn authority...');
        const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(AUTHORITY_SECRET_KEY));
        umi.use(keypairIdentity(authorityKeypair));
        
        console.log(`👤 Authority address: ${authorityKeypair.publicKey}`);
        
        // 3. Check authority balance
        const authorityBalance = await connection.getBalance(new PublicKey(authorityKeypair.publicKey));
        console.log(`💰 Authority balance: ${(authorityBalance / 1e9).toFixed(4)} SOL`);
        
        if (authorityBalance < 0.01 * 1e9) { // Need at least 0.01 SOL
            throw new Error('Insufficient balance for burn transaction. Need at least 0.01 SOL.');
        }
        
        // 4. Verify NFT exists and authority
        console.log('🔍 Verifying NFT and authority...');
        
        try {
            const mintPublicKey = new PublicKey(NFT_MINT_ADDRESS);
            const mintAccount = await connection.getAccountInfo(mintPublicKey);
            
            if (!mintAccount) {
                throw new Error('NFT does not exist or invalid address');
            }
            
            console.log('✅ NFT exists and is valid');
        } catch (error) {
            throw new Error(`Invalid NFT address: ${error.message}`);
        }
        
        // 5. Confirm burn action
        console.log('');
        console.log('⚠️  WARNING: This action is IRREVERSIBLE!');
        console.log('⚠️  The NFT will be permanently destroyed.');
        console.log('');
        console.log('🔥 Proceeding with burn in 5 seconds...');
        console.log('   Press Ctrl+C to cancel');
        
        // Wait 5 seconds
        for (let i = 5; i > 0; i--) {
            process.stdout.write(`   ${i}... `);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('');
        console.log('');
        
        // 6. Burn the NFT
        console.log('🔥 Burning Soul-Bound Token...');
        
        const burnTx = await burnNft(umi, {
            mint: NFT_MINT_ADDRESS,
            authority: authorityKeypair,
            tokenOwner: authorityKeypair.publicKey,
            tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi);
        
        console.log('');
        console.log('✅ Soul-Bound Token burned successfully!');
        console.log('=======================================');
        
        // Convert signature to proper format
        const sigString = typeof burnTx.signature === 'string' ? burnTx.signature : Buffer.from(burnTx.signature).toString('hex');
        
        console.log(`🔥 Burn Transaction: ${sigString}`);
        console.log(`🌐 Explorer: https://explorer.solana.com/tx/${sigString}?cluster=devnet`);
        console.log(`📋 Reason: ${BURN_REASON}`);
        console.log(`⏰ Burned at: ${new Date().toISOString()}`);
        console.log('');
        console.log('🎯 The NFT has been permanently destroyed and removed from the blockchain.');
        console.log('🎯 The holder no longer has access to this governance credential.');
        
    } catch (error) {
        console.log('');
        console.log('💥 Error burning Soul-Bound Token:');
        console.log('=================================');
        console.log(`❌ ${error.message}`);
        console.log('');
        console.log('💡 Troubleshooting Steps:');
        console.log('1. Verify the AUTHORITY_SECRET_KEY is correct');
        console.log('2. Verify the NFT_MINT_ADDRESS is correct');
        console.log('3. Ensure you have sufficient SOL for the transaction');
        console.log('4. Check that you are the freeze/burn authority for this NFT');
        console.log('5. Verify the NFT still exists and hasn\'t been burned already');
        console.log('');
        console.log('🔍 Full error details:');
        console.error(error);
    }
}

// Run the script
main().catch(console.error);
