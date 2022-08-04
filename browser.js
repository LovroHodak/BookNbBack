const puppeteer = require('puppeteer')

module.exports = () => puppeteer.launch({
    headless: true,
    defaultViewport: {width: 1300, height: 1000},
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
})