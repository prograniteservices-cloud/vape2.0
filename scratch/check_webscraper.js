const API_TOKEN = "wFDjRNNQAOc3kPd33ygJDReVEAqNya9BjAkSN2GquE3g33aZiV6gKCK42pOO";
const URL = `https://api.webscraper.io/api/v1/sitemaps?api_token=${API_TOKEN}`;

async function checkSitemaps() {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log("Sitemaps found:");
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

checkSitemaps();
