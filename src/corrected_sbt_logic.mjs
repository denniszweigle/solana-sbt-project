// Corrected Solana Soul-Bound Token (SBT) Logic
// Using Metaplex Umi and MPL Core with GitHub Pages hosting
// Configured for Solana Devnet - Windows WSL Compatible

import {
    LAMPORTS_PER_SOL,
    Connection,
    clusterApiUrl,
} from '@solana/web3.js';
import {
    generateSigner,
    createSignerFromKeypair,
    keypairIdentity,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore, createV1 } from '@metaplex-foundation/mpl-core';

// --- Configuration for GitHub Pages ---
// Update this URL after setting up your GitHub Pages repository
const GITHUB_USERNAME = 'denniszweigle';
const REPO_NAME = 'solana-sbt-assets'; // You'll create this repo
const metadataUri = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/metadata/pog-metadata.json`;

console.log('🔧 Configuration:');
console.log(`📁 GitHub Username: ${GITHUB_USERNAME}`);
console.log(`📁 Repository: ${REPO_NAME}`);
console.log(`🌐 Metadata URL: ${metadataUri}`);
console.log(`🌐 Network: Solana Devnet`);
console.log('');

// --- Main Logic ---

async function main() {
    console.log('🚀 Starting SBT creation script...');
    console.log('===================================');

    // 1. Connect to Solana Devnet and initialize Umi
    console.log('🔗 Connecting to Solana Devnet...');
    const umi = createUmi(clusterApiUrl('devnet'));
    umi.use(mplCore());

    // 2. Configure the Payer
    console.log('👛 Setting up payer wallet...');
    const payerKeypair = umi.eddsa.createKeypair();
    const payerSigner = createSignerFromKeypair(umi, payerKeypair);
    umi.use(keypairIdentity(payerSigner));

    console.log(`💳 Payer address: ${payerKeypair.publicKey}`);
    console.log(`🔑 Payer secret key: [${Array.from(payerKeypair.secretKey).join(', ')}]`);
    console.log('⚠️  Save the secret key above for verification script!');
    console.log('');

    // 3. Airdrop SOL to the payer for transaction fees (Devnet only)
    console.log('💰 Requesting SOL airdrop from Devnet...');
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    try {
        const airdropSignature = await connection.requestAirdrop(
            payerKeypair.publicKey,
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropSignature, 'confirmed');
        console.log('✅ Airdrop confirmed! Received 2 SOL for testing');
    } catch (error) {
        console.log('⚠️  Airdrop failed, but continuing (you may have enough SOL already)');
        console.log(`   Error: ${error.message}`);
    }
    console.log('');

    // 4. Generate a signer for the new SBT
    const asset = generateSigner(umi);
    console.log(`🎯 SBT address: ${asset.publicKey}`);

    // 5. Create the Soul-Bound Token (SBT)
    console.log('🔨 Creating the Soul-Bound Token...');

    try {
        const createTx = await createV1(umi, {
            asset,
            name: 'Proof of Governance',
            uri: metadataUri,
            plugins: [
                {
                    type: 'PermanentFreezeDelegate',
                    frozen: true,
                },
            ],
        }).sendAndConfirm(umi);

        console.log('');
        console.log('🎉 SBT created successfully!');
        console.log('============================');
        console.log(`🏷️  Token Name: Proof of Governance`);
        console.log(`🆔 SBT Address: ${asset.publicKey}`);
        console.log(`📄 Metadata URI: ${metadataUri}`);
        console.log(`🔐 Transaction: ${createTx.signature}`);
        console.log(`🌐 Explorer: https://explorer.solana.com/tx/${createTx.signature}?cluster=devnet`);
        console.log('');
        console.log('📋 For verification script, use:');
        console.log(`   SBT Address: ${asset.publicKey}`);
        console.log(`   Payer Secret: [${Array.from(payerKeypair.secretKey).join(', ')}]`);
        console.log('');
        console.log('🔒 This token is now permanently non-transferable (Soul-Bound)!');

    } catch (error) {
        console.error('❌ Error creating SBT:', error.message);
        
        if (error.message.includes('fetch') || error.message.includes('404')) {
            console.log('');
            console.log('💡 This error likely means your metadata URL is not accessible yet.');
            console.log('   Make sure you have:');
            console.log('   1. Created the GitHub repository: solana-sbt-assets');
            console.log('   2. Uploaded the metadata file to: metadata/pog-metadata.json');
            console.log('   3. Enabled GitHub Pages in repository settings');
            console.log('   4. Waited a few minutes for deployment');
            console.log('');
            console.log(`   Expected URL: ${metadataUri}`);
            console.log('');
            console.log('   📖 Follow GITHUB_SETUP_GUIDE.md for detailed instructions');
        }
        
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
});
