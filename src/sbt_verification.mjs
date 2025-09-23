// SBT Verification Script
// This script attempts to transfer the created SBT to verify its non-transferable nature.
// Configured for Solana Devnet

import {
    Connection,
    clusterApiUrl,
} from '@solana/web3.js';
import {
    createSignerFromKeypair,
    keypairIdentity,
    some,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore, transferV1 } from '@metaplex-foundation/mpl-core';

// --- Configuration ---
// IMPORTANT: Update these values after running the creation script

const sbtMintAddress = 'PASTE_SBT_ADDRESS_HERE'; // Replace with actual SBT address from creation script
const payerSecretKey = new Uint8Array([/* PASTE_SECRET_KEY_ARRAY_HERE */]); // Replace with actual secret key array

console.log('🔍 SBT Verification Configuration:');
console.log(`🌐 Network: Solana Devnet`);
console.log(`🎯 SBT Address: ${sbtMintAddress}`);
console.log('');

// --- Main Logic ---

async function main() {
    console.log('🔍 Starting SBT verification script...');
    console.log('=====================================');

    // Validate configuration
    if (sbtMintAddress === 'PASTE_SBT_ADDRESS_HERE') {
        console.error('❌ Error: Please update sbtMintAddress with the actual SBT address');
        console.log('');
        console.log('📋 Steps to fix:');
        console.log('1. Run the creation script first: npm run create-sbt');
        console.log('2. Copy the SBT address from the output');
        console.log('3. Replace PASTE_SBT_ADDRESS_HERE in this file');
        console.log('4. Also copy the secret key array');
        process.exit(1);
    }

    if (payerSecretKey.length === 0) {
        console.error('❌ Error: Please update payerSecretKey with the actual secret key array');
        console.log('');
        console.log('📋 Steps to fix:');
        console.log('1. Copy the secret key array from the creation script output');
        console.log('2. Replace the empty array in this file');
        process.exit(1);
    }

    // 1. Connect to Solana Devnet and initialize Umi
    console.log('🔗 Connecting to Solana Devnet...');
    const umi = createUmi(clusterApiUrl('devnet'));
    umi.use(mplCore());

    // 2. Configure the Payer
    console.log('👛 Setting up payer wallet...');
    const payerKeypair = umi.eddsa.createKeypairFromSecretKey(payerSecretKey);
    const payerSigner = createSignerFromKeypair(umi, payerKeypair);
    umi.use(keypairIdentity(payerSigner));

    console.log(`💳 Payer address: ${payerKeypair.publicKey}`);

    // 3. Generate a new wallet to attempt to transfer the SBT to
    const recipient = umi.eddsa.createKeypair();
    console.log(`🎯 Recipient address: ${recipient.publicKey}`);
    console.log('');

    // 4. Attempt to transfer the SBT
    console.log('🔄 Attempting to transfer the SBT...');
    console.log('(This should fail if the SBT is properly configured as non-transferable)');
    console.log('');

    try {
        await transferV1(umi, {
            asset: sbtMintAddress,
            newOwner: recipient.publicKey,
        }).sendAndConfirm(umi);

        console.error('❌ CRITICAL ERROR: Transfer was successful!');
        console.log('');
        console.log('🚨 This means the SBT is NOT properly configured as non-transferable.');
        console.log('   The token should have failed to transfer.');
        console.log('   Please check the creation script configuration.');
        process.exit(1);

    } catch (error) {
        console.log('🔍 Transfer attempt result:');
        console.log(`   Error: ${error.message}`);
        console.log('');

        if (error.message.includes('frozen') || 
            error.message.includes('Transfer is not approved') ||
            error.message.includes('PermanentFreezeDelegate')) {
            
            console.log('✅ SUCCESS: The SBT is properly non-transferable!');
            console.log('');
            console.log('🎉 Verification Results:');
            console.log('========================');
            console.log('✅ SBT exists and is accessible');
            console.log('✅ Transfer attempt was properly rejected');
            console.log('✅ Token is permanently frozen (Soul-Bound)');
            console.log('✅ Implementation is working correctly');
            console.log('');
            console.log('🔒 This confirms your Soul-Bound Token is functioning as expected!');
            
        } else {
            console.log('⚠️  Unexpected error during transfer attempt:');
            console.log(`   ${error.message}`);
            console.log('');
            console.log('💡 This might indicate a different issue. Common causes:');
            console.log('   - Network connectivity problems');
            console.log('   - Incorrect SBT address');
            console.log('   - Insufficient SOL for transaction fees');
            console.log('');
            console.log('🔍 Please verify the SBT address and try again.');
        }
    }
}

main().catch((err) => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
});
