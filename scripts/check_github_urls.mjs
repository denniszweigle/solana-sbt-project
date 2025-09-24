// GitHub Pages URL Checker
// Verifies that your GitHub Pages URLs are accessible

const GITHUB_USERNAME = 'denniszweigle';
const REPO_NAME = 'solana-sbt-assets';
const BASE_URL = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}`;

const urls = {
    'Image URL': `${BASE_URL}/images/pog-token.png`,
    'Metadata URL': `${BASE_URL}/metadata/metadata.json`
};

// Helper function to get attribute value by trait_type
function getAttribute(attributes, traitType) {
    const attr = attributes.find(a => a.trait_type === traitType);
    return attr ? attr.value : 'Not found';
}


async function checkUrl(name, url) {
    try {
        console.log(`🔍 Checking ${name}...`);
        const response = await fetch(url);
        
        if (response.ok) {
            console.log(`✅ ${name}: Working (${response.status})`);
            
            if (name === 'Metadata URL') {
                try {
                    const metadata = await response.json();
                    console.log(`   📄 Name: ${metadata.name}`);
                    console.log(`   🏷️  Symbol: ${metadata.symbol}`);
                    console.log(`   📝 Description: ${metadata.description.substring(0, 80)}...`);
                    console.log(`   🌐 External URL: ${metadata.external_url}`);
                    console.log('');
                    
                    // Check key attributes from the attributes array
                    console.log('   📋 Key Attributes:');
                    console.log(`   🏢 Company/Project: ${getAttribute(metadata.attributes, 'Company/Project Name')}`);
                    console.log(`   🥉 Verification Tier: ${getAttribute(metadata.attributes, 'Verification Tier')}`);
                    console.log(`   🔄 Transferable: ${getAttribute(metadata.attributes, 'Transferable')}`);
                    console.log(`   🔥 Burnable: ${getAttribute(metadata.attributes, 'Burnable')}`);
                    console.log(`   🌐 Network: ${getAttribute(metadata.attributes, 'Network')}`);
                    console.log(`   📊 Standard: ${getAttribute(metadata.attributes, 'Standard')}`);
                    console.log(`   📅 Issue Date: ${getAttribute(metadata.attributes, 'Issue Date')}`);
                    console.log(`   📅 Expiry Date: ${getAttribute(metadata.attributes, 'Expiry Date')}`);
                    console.log('');
                    
                    // Check governance-specific attributes
                    console.log('   🏛️  Governance Attributes:');
                    console.log(`   💰 Token Contract: ${getAttribute(metadata.attributes, 'Token Contract Address')}`);
                    console.log(`   🏦 Treasury Wallet: ${getAttribute(metadata.attributes, 'Treasury Wallet Address')}`);
                    console.log(`   💧 LP Wallet: ${getAttribute(metadata.attributes, 'Liquidity Pool (LP) Wallet Address')}`);
                    console.log(`   🌐 Website: ${getAttribute(metadata.attributes, 'Company Website URL')}`);
                    console.log(`   📱 Social Media: ${getAttribute(metadata.attributes, 'Social Media URLs')}`);
                    console.log(`   📋 Audit Hash: ${getAttribute(metadata.attributes, 'Audit Report Hash')}`);
                    console.log(`   📜 Framework Hash: ${getAttribute(metadata.attributes, 'Governance Framework Hash')}`);
                    console.log('');
                    
                    // Check custom_fields (if they exist)
                    if (metadata.custom_fields) {
                        console.log('   🔧 Custom Fields:');
                        Object.entries(metadata.custom_fields).forEach(([key, value]) => {
                            console.log(`   📌 ${key}: ${value}`);
                        });
                        console.log('');
                    }
                    
                    // Validation checks
                    console.log('   ✅ Validation Results:');
                    const validations = [
                        { check: 'Name exists', result: !!metadata.name },
                        { check: 'Symbol exists', result: !!metadata.symbol },
                        { check: 'Image URL valid', result: !!metadata.image },
                        { check: 'Has attributes array', result: Array.isArray(metadata.attributes) },
                        { check: 'Burnable = Authority Only', result: getAttribute(metadata.attributes, 'Burnable') === 'Yes - By Authority Only' },
                        { check: 'Transferable = No', result: getAttribute(metadata.attributes, 'Transferable') === 'No' },
                        { check: 'Network = Solana Devnet', result: getAttribute(metadata.attributes, 'Network') === 'Solana Devnet' },
                        { check: 'Standard = MPL Core', result: getAttribute(metadata.attributes, 'Standard') === 'MPL Core' },
                        { check: 'Has properties', result: !!metadata.properties },
                        { check: 'Total attributes count', result: `${metadata.attributes.length} attributes` }
                    ];
                    
                    validations.forEach(({ check, result }) => {
                        if (typeof result === 'boolean') {
                            console.log(`   ${result ? '✅' : '❌'} ${check}`);
                        } else {
                            console.log(`   📊 ${check}: ${result}`);
                        }
                    });
                    
                } catch (e) {
                    console.log(`   ❌ Could not parse JSON metadata: ${e.message}`);
                }
            }
            
            return true;
        } else {
            console.log(`❌ ${name}: Failed (${response.status} ${response.statusText})`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${name}: Error - ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('🌐 GitHub Pages URL Checker & Metadata Validator');
    console.log('================================================');
    console.log(`👤 GitHub Username: ${GITHUB_USERNAME}`);
    console.log(`📁 Repository: ${REPO_NAME}`);
    console.log(`🌐 Base URL: ${BASE_URL}`);
    console.log('');

    let allWorking = true;

    for (const [name, url] of Object.entries(urls)) {
        const working = await checkUrl(name, url);
        allWorking = allWorking && working;
        console.log('');
    }

    console.log('📋 Summary:');
    console.log('===========');
    
    if (allWorking) {
        console.log('🎉 All URLs are working correctly!');
        console.log('');
        console.log('✅ Your revocable SBT project is ready to run:');
        console.log('   npm run create-sbt');
        console.log('');
        console.log('🔗 URLs configured in your SBT script:');
        for (const [name, url] of Object.entries(urls)) {
            console.log(`   ${name}: ${url}`);
        }
    } else {
        console.log('❌ Some URLs are not working yet.');
        console.log('');
        console.log('💡 Troubleshooting steps:');
        console.log('1. Make sure you created the GitHub repository: solana-sbt-assets');
        console.log('2. Upload your files to the correct directories:');
        console.log('   - images/pog-token.png (your POG logo image)');
        console.log('   - metadata/metadata.json (your governance metadata)');
        console.log('3. Enable GitHub Pages in repository settings');
        console.log('   - Go to Settings > Pages');
        console.log('   - Source: Deploy from a branch > main > / (root)');
        console.log('4. Wait 2-5 minutes for deployment');
        console.log('5. Run this script again: npm run check-urls');
        console.log('');
        console.log('📖 See VSCODE_SETUP_GUIDE.md for detailed instructions');
    }
}

main().catch(console.error);