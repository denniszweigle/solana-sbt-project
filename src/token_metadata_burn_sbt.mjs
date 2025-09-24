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
 *  
 * License and Logic is proprietary and protected by 11 provisional Patents at the time of this writing 
 * 
 * @fileoverview This script facilitates the burning (revocation) of a Soul-Bound Token (SBT)
 * on the Solana blockchain. It is designed to be executed by the authorized burn authority,
 * typically the project's governance or issuing entity.
 * * The process leverages the Umi framework from Metaplex for a streamlined interaction with
 * the Token Metadata program, ensuring the burn is performed correctly and securely.
 */

// ============================================================================
// LIBRARY IMPORTS
// ============================================================================
// @solana/web3.js is used for direct blockchain interaction, such as checking
// the account balance, which Umi does not provide out-of-the-box.
import {
    Connection,
    clusterApiUrl,
    PublicKey,
} from '@solana/web3.js';

// Umi is a modern, modular framework from Metaplex that simplifies interacting
// with on-chain programs, particularly for NFTs and tokens.
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

// MPL Token Metadata provides the instructions and models for interacting with
// the Token Metadata program, which governs the state of NFTs and tokens.
import { 
    burnNft,
    mplTokenMetadata,
    TokenStandard
} from '@metaplex-foundation/mpl-token-metadata';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Replace with proper Devnet, Testnet, Mainnet
const BLOCKCHAIN_ENV = 'Devnet';


// Paste the authority secret key from the SBT creation output.
// NOTE: For a production application, this key should be stored securely in
// environment variables (e.g., a .env file) and never hardcoded.
const AUTHORITY_SECRET_KEY = []; // Paste your secret key array here

// Paste the NFT mint address of the SBT to be burned.
const NFT_MINT_ADDRESS = ''; // Paste the NFT address here

// Provide a clear reason for the burn action. This is crucial for logging
// and auditing purposes, allowing for transparent governance actions.
const BURN_REASON = 'Governance violation'; // Update as needed

// ============================================================================
// MAIN EXECUTION FUNCTION
// ============================================================================

async function main() {
    console.log('🔥 Soul-Bound Token Burn Script - Token Metadata');
    console.log('================================================');
    console.log(`🎯 NFT to burn: ${NFT_MINT_ADDRESS}`);
    console.log(`📋 Reason: ${BURN_REASON}`);
    console.log('');

    try {
        // --- Input Validation ---
        // Robust validation ensures the script does not proceed with empty or invalid
        // configuration, preventing runtime errors.
        if (!AUTHORITY_SECRET_KEY || AUTHORITY_SECRET_KEY.length === 0) {
            throw new Error('AUTHORITY_SECRET_KEY is not set. Please paste your secret key array.');
        }
        
        if (!NFT_MINT_ADDRESS || NFT_MINT_ADDRESS.trim() === '') {
            throw new Error('NFT_MINT_ADDRESS is not set. Please paste the NFT address to burn.');
        }

        // --- 1. Setup Umi and Web3.js Connections ---
        console.log(`🔗 Connecting to Solana ${BLOCKCHAIN_ENV}...`);
        // createUmi initializes the Umi framework client. We use `mplTokenMetadata`
        // to load the necessary program IDL for the Umi client.
        const umi = createUmi(clusterApiUrl(${BLOCKCHAIN_ENV}));
        umi.use(mplTokenMetadata());
        
        // A direct Web3.js Connection is used to fetch raw account information
        // and check balances, providing an alternative data source to Umi.
        const connection = new Connection(clusterApiUrl(${BLOCKCHAIN_ENV}), 'confirmed');
        
        // --- 2. Setup Burn Authority Keypair ---
        console.log('🔑 Setting up burn authority...');
        // The secret key array is converted into a Umi-compatible keypair.
        const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(AUTHORITY_SECRET_KEY));
        // The `keypairIdentity` plugin sets the keypair as the payer and signer
        // for all future transactions sent through this Umi instance.
        umi.use(keypairIdentity(authorityKeypair));
        
        console.log(`👤 Authority address: ${authorityKeypair.publicKey}`);
        
        // --- 3. Check Authority Balance ---
        // A pre-flight check to ensure the authority has enough SOL to cover
        // the transaction fee, preventing a failed transaction.
        const authorityBalance = await connection.getBalance(new PublicKey(authorityKeypair.publicKey));
        console.log(`💰 Authority balance: ${(authorityBalance / 1e9).toFixed(4)} SOL`);
        
        if (authorityBalance < 0.01 * 1e9) { // A buffer is added to ensure sufficient funds.
            throw new Error('Insufficient balance for burn transaction. Need at least 0.01 SOL.');
        }
        
        // --- 4. Verify NFT Existence ---
        // It's a good practice to verify the target NFT exists on-chain before attempting
        // a burn operation, which prevents unnecessary transaction attempts.
        console.log('🔍 Verifying NFT and authority...');
        
        try {
            const mintPublicKey = new PublicKey(NFT_MINT_ADDRESS);
            const mintAccount = await connection.getAccountInfo(mintPublicKey);
            
            if (!mintAccount) {
                throw new Error('NFT does not exist or invalid address');
            }
            
            console.log('✅ NFT exists and is valid');
        } catch (error) {
            // A specific error message helps distinguish between a network issue and an invalid address.
            throw new Error(`Invalid NFT address: ${error.message}`);
        }
        
        // --- 5. Confirm Burn Action ---
        // A final warning and countdown are crucial for irreversible operations.
        // This gives the user a chance to cancel the script execution.
        console.log('');
        console.log('⚠️  WARNING: This action is IRREVERSIBLE!');
        console.log('⚠️  The NFT will be permanently destroyed.');
        console.log('');
        console.log('🔥 Proceeding with burn in 5 seconds...');
        console.log('   Press Ctrl+C to cancel');
        
        for (let i = 5; i > 0; i--) {
            process.stdout.write(`   ${i}... `);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('');
        console.log('');
        
        // --- 6. Execute the Burn Instruction ---
        console.log('🔥 Burning Soul-Bound Token...');
        
        // The `burnNft` instruction is part of the MPL Token Metadata program.
        // It's called with the necessary context (Umi) and parameters (mint, authority, etc.).
        const burnTx = await burnNft(umi, {
            mint: NFT_MINT_ADDRESS,
            authority: authorityKeypair,
            tokenOwner: authorityKeypair.publicKey,
            // The `TokenStandard.NonFungible` is crucial to ensure the instruction
            // is targeting the correct type of token.
            tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi); // `sendAndConfirm` sends the transaction and waits for network confirmation.
        
        // --- Success Logging ---
        console.log('');
        console.log('✅ Soul-Bound Token burned successfully!');
        console.log('=======================================');
        
        // The transaction signature is a `Uint8Array` by default. It's converted
        // to a hexadecimal string for easy readability and use in explorer URLs.
        const sigString = typeof burnTx.signature === 'string' ? burnTx.signature : Buffer.from(burnTx.signature).toString('hex');
        
        console.log(`🔥 Burn Transaction: ${sigString}`);
        console.log(`🌐 Explorer: https://explorer.solana.com/tx/${sigString}?cluster=${BLOCKCHAIN_ENV}`);
        console.log(`📋 Reason: ${BURN_REASON}`);
        console.log(`⏰ Burned at: ${new Date().toISOString()}`);
        console.log('');
        console.log('🎯 The NFT has been permanently destroyed and removed from the blockchain.');
        console.log('🎯 The holder no longer has access to this governance credential.');
        
    } catch (error) {
        // --- Robust Error Handling ---
        // A detailed catch block provides immediate, actionable feedback to the user.
        // It logs a user-friendly error message, followed by specific troubleshooting steps.
        console.log('');
        console.log('💥 Error burning Soul-Bound Token:');
        console.log('=================================');
        console.log(`❌ ${error.message}`);
        console.log('');
        console.log('💡 Troubleshooting Steps:');
        console.log('1. Verify the AUTHORITY_SECRET_KEY is correct.');
        console.log('2. Verify the NFT_MINT_ADDRESS is correct.');
        console.log('3. Ensure you have sufficient SOL for the transaction.');
        console.log('4. Check that you are the freeze/burn authority for this NFT.');
        console.log('5. Verify the NFT still exists and hasn\'t been burned already.');
        console.log('');
        console.log('🔍 Full error details:');
        console.error(error);
    }
}

// Ensure the script is executed by wrapping the main function call in a catch block
// to handle any unhandled promises gracefully.
main().catch(console.error);
