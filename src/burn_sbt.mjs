// Burn/Revoke Soul-Bound Token Script
// For governance enforcement and agreement violations
// Configured for Solana Devnet

import {
    Connection,
    clusterApiUrl,
} from '@solana/web3.js';
import {
    createSignerFromKeypair,
    keypairIdentity,
    publicKey,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
    mplCore, 
    burnV1
} from '@metaplex-foundation/mpl-core';

console.log('🔥 SBT Burn/Revocation Script');
console.log('============================');
console.log('⚠️  This script permanently destroys an SBT');
console.log('   Use only for governance violations or agreement breaches');
console.log('');

async function main() {
    // Configuration - UPDATE THESE VALUES
    const SBT_ADDRESS = 'PASTE_SBT_ADDRESS_HERE'; // From creation script output
    const AUTHORITY_SECRET_KEY = []; // Paste the secret key array from creation script
    
    // Validation
    if (SBT_ADDRESS === 'PASTE_SBT_ADDRESS_HERE' || AUTHORITY_SECRET_KEY.length === 0) {
        console.error('❌ Configuration Error:');
        console.log('');
        console.log('Please update this script with:');
        console.log('1. SBT_ADDRESS: The address of the SBT to burn');
        console.log('2. AUTHORITY_SECRET_KEY: Your issuer secret key array');
        console.log('');
        console.log('Both values are provided when you create an SBT.');
        console.log('Example:');
        console.log('  const SBT_ADDRESS = "ABC123...";');
        console.log('  const AUTHORITY_SECRET_KEY = [123, 45, 67, ...];');
        process.exit(1);
    }

    console.log('🔗 Connecting to Solana Devnet...');
    const umi = createUmi(clusterApiUrl('devnet'));
    umi.use(mplCore());

    // Restore authority keypair from secret key
    console.log('🔑 Restoring authority keypair...');
    const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(AUTHORITY_SECRET_KEY));
    const authoritySigner = createSignerFromKeypair(umi, authorityKeypair);
    umi.use(keypairIdentity(authoritySigner));

    console.log(`👤 Authority address: ${authorityKeypair.publicKey}`);
    console.log(`🎯 SBT to burn: ${SBT_ADDRESS}`);
    console.log('');

    // Confirmation prompt
    console.log('⚠️  FINAL CONFIRMATION REQUIRED');
    console.log('================================');
    console.log('This action will PERMANENTLY DESTROY the SBT.');
    console.log('The token cannot be recovered after burning.');
    console.log('');
    console.log('Reasons for burning an SBT:');
    console.log('• Violation of governance agreement');
    console.log('• Misconduct in governance activities');
    console.log('• Loss of eligibility requirements');
    console.log('• Fraudulent application or behavior');
    console.log('');
    
    // In a real implementation, you might want to add interactive confirmation
    // For now, we'll proceed with the burn
    
    try {
        console.log('🔥 Burning the SBT...');
        
        const burnTx = await burnV1(umi, {
            asset: publicKey(SBT_ADDRESS),
            authority: authoritySigner,
        }).sendAndConfirm(umi);

        console.log('');
        console.log('✅ SBT burned successfully!');
        console.log('===========================');
        console.log(`🔥 Burned SBT: ${SBT_ADDRESS}`);
        console.log(`🔐 Transaction: ${burnTx.signature}`);
        console.log(`🌐 Explorer: https://explorer.solana.com/tx/${burnTx.signature}?cluster=devnet`);
        console.log('');
        console.log('📋 Action completed:');
        console.log('   ✅ SBT permanently destroyed');
        console.log('   ✅ Governance rights revoked');
        console.log('   ✅ Token removed from holder\'s wallet');
        console.log('');
        console.log('🔒 The governance violation has been enforced.');

    } catch (error) {
        console.error('❌ Error burning SBT:', error.message);
        
        if (error.message.includes('Account not found')) {
            console.log('');
            console.log('💡 Possible causes:');
            console.log('   • SBT address is incorrect');
            console.log('   • SBT has already been burned');
            console.log('   • SBT doesn\'t exist on devnet');
        } else if (error.message.includes('authority')) {
            console.log('');
            console.log('💡 Authority error:');
            console.log('   • You are not the burn authority for this SBT');
            console.log('   • Secret key is incorrect');
            console.log('   • Only the original issuer can burn the token');
        }
        
        process.exit(1);
    }
}

// Instructions for usage
console.log('📖 How to use this script:');
console.log('1. Update SBT_ADDRESS with the token address to burn');
console.log('2. Update AUTHORITY_SECRET_KEY with your issuer secret key');
console.log('3. Run: npm run burn-sbt');
console.log('');

main().catch((err) => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
});
