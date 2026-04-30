const MERCHANT_ID = "WV2BFYZ60SBX1";
const LIMIT = 16;
const OFFSET = 288;

async function testFetch() {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://vape-more.cloveronline.com/",
        "Origin": "https://vape-more.cloveronline.com"
    };

    const url = `https://www.clover.com/online-ordering/api/v1/merchants/${MERCHANT_ID}/items?limit=${LIMIT}&offset=${OFFSET}`;
    console.log(`Fetching: ${url}`);

    try {
        const response = await fetch(url, { headers });
        console.log(`Status: ${response.status}`);
        console.log(`Type: ${response.headers.get('content-type')}`);
        
        const text = await response.text();
        if (text.startsWith('{')) {
            const data = JSON.parse(text);
            console.log(`Success! Found ${data.items ? data.items.length : 0} items.`);
        } else {
            console.log(`Received non-JSON response: ${text.substring(0, 100)}...`);
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

testFetch();
