const API_TOKEN = "wFDjRNNQAOc3kPd33ygJDReVEAqNya9BjAkSN2GquE3g33aZiV6gKCK42pOO";

async function getSitemap(sitemapId) {
    const URL = `https://api.webscraper.io/api/v1/sitemaps/${sitemapId}?api_token=${API_TOKEN}`;
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(`Sitemap ${sitemapId} details:`);
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

getSitemap(1468468);
