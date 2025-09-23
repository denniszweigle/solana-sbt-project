// Quick script to verify devnet configuration
import { clusterApiUrl, Connection } from '@solana/web3.js';

console.log('🔍 Checking Devnet Configuration...');
console.log('================================');

// Check devnet URL
const devnetUrl = clusterApiUrl('devnet');
console.log(`✅ Devnet URL: ${devnetUrl}`);

// Test connection
try {
    const connection = new Connection(devnetUrl, 'confirmed');
    const version = await connection.getVersion();
    console.log(`✅ Connected to Solana devnet successfully!`);
    console.log(`✅ Solana version: ${version['solana-core']}`);
    
    // Check if we can get recent blockhash (confirms network is working)
    const { blockhash } = await connection.getLatestBlockhash();
    console.log(`✅ Latest blockhash: ${blockhash.slice(0, 8)}...`);
    
    console.log('');
    console.log('🎉 Your project is ready to run on devnet!');
    console.log('');
    console.log('Next steps:');
    console.log('1. npm run create-sbt');
    console.log('2. npm run verify-sbt');
    
} catch (error) {
    console.error('❌ Error connecting to devnet:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('- Check your internet connection');
    console.log('- Try again in a few moments');
}
