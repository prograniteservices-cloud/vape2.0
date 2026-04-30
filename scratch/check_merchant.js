const fs = require('fs');

async function check() {
    try {
        const response = await fetch('https://vape-more.cloveronline.com/');
        const text = await response.text();
        const m = text.match(/merchantId["': ]+([A-Z0-9]{13})/i);
        console.log(m ? 'Merchant ID Found: ' + m[1] : 'Merchant ID Not Found');
        fs.writeFileSync('homepage_snippet.html', text.substring(0, 10000));
    } catch (e) {
        console.error(e);
    }
}

check();
