// GitHub Pages URL Checker
// Verifies that your GitHub Pages URLs are accessible

const GITHUB_USERNAME = 'denniszweigle';
const REPO_NAME = 'solana-sbt-assets';
const BASE_URL = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}`;

const urls = {
    'Image URL': `${BASE_URL}/images/pog-token.png`,
    'Metadata URL': `${BASE_URL}/metadata/pog-metadata.json`
};

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
                    console.log(`   👤 First Name: ${metadata.custom_fields?.fName || 'Not set'}`);
                    console.log(`   👤 Last Name: ${metadata.custom_fields?.lName || 'Not set'}`);
                    console.log(`   🔗 Token URL: ${metadata.custom_fields?.TokenURL || 'Not set'}`);
                    console.log(`   🔗 POG URL: ${metadata.custom_fields?.PogURL || 'Not set'}`);
                } catch (e) {
                    console.log(`   ⚠️  Could not parse JSON metadata`);
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
    console.log('🌐 GitHub Pages URL Checker');
    console.log('============================');
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
        console.log('✅ Your SBT project is ready to run:');
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
        console.log('   - images/pog-token.png');
        console.log('   - metadata/pog-metadata.json');
        console.log('3. Enable GitHub Pages in repository settings');
        console.log('4. Wait 2-5 minutes for deployment');
        console.log('5. Run this script again: npm run check-urls');
        console.log('');
        console.log('📖 See GITHUB_SETUP_GUIDE.md for detailed instructions');
    }
}

main().catch(console.error);
