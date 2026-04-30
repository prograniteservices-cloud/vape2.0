const API_TOKEN = "wFDjRNNQAOc3kPd33ygJDReVEAqNya9BjAkSN2GquE3g33aZiV6gKCK42pOO";

async function checkSitemapJobs(sitemapId) {
    const URL = `https://api.webscraper.io/api/v1/scraping-jobs?api_token=${API_TOKEN}&sitemap_id=${sitemapId}`;
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(`Scraping jobs for sitemap ${sitemapId}:`);
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

async function run() {
    await checkSitemapJobs(1468467);
    await checkSitemapJobs(1468468);
}

run();
