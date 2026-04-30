const API_TOKEN = "wFDjRNNQAOc3kPd33ygJDReVEAqNya9BjAkSN2GquE3g33aZiV6gKCK42pOO";
const SITEMAP_ID = 1468401;
const URL = `https://api.webscraper.io/api/v1/sitemap/${SITEMAP_ID}?api_token=${API_TOKEN}`;

async function checkSitemap() {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log("Sitemap details:");
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

checkSitemap();
