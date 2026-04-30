const https = require('https');

const API_TOKEN = 'wFDjRNNQAOc3kPd33ygJDReVEAqNya9BjAkSN2GquE3g33aZiV6gKCK42pOO';
const SITEMAP_ID = 1468468;
const URL = `https://api.webscraper.io/api/v1/sitemap/${SITEMAP_ID}?api_token=${API_TOKEN}`;

https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(data);
    });
}).on('error', (err) => {
    console.error('Error: ' + err.message);
});
