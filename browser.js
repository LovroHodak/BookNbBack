const puppeteer = require('puppeteer')

module.exports = () => puppeteer.launch({
    headless: false,
    defaultViewport: {width: 1300, height: 1000}
})