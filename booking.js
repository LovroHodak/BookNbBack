const page_url = "https://www.booking.com";

const openBrowser = require("./browser");

async function getBookings(cityName, fromDay, fromMonth, toDay, toMonth) {
  // to je za v primeru ce ti iz 07 naredi 7
  fromMonth = fromMonth.padStart(2, "0");
  toMonth = toMonth.padStart(2, "0");
  fromDay = fromDay.padStart(2, "0");
  toDay = toDay.padStart(2, "0");

  // START
  // launchaj puppeterja v browser.js
  const browser = await openBrowser();
  // odpri browser
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
  // pejt na url
  await page.goto(page_url, { waitUntil: "networkidle2" });
  // napisi split v input
  await page.type("input[name=ss]", cityName);
  // stisni na datum box da se odpre calendar
  await page.click(".xp__dates.xp__group");
  // stisni od datuma
  await page.evaluate(
    async (fromMonth, fromDay) => {
      document
        .querySelector(`td[data-date='2022-${fromMonth}-${fromDay}']`)
        .click();
    },
    fromMonth,
    fromDay
  );
  // stisni do datuma
  await page.evaluate(
    async (toMonth, toDay) => {
      document
        .querySelector(`td[data-date='2022-${toMonth}-${toDay}']`)
        .click();
    },
    toMonth,
    toDay
  );
  // submit button
  await page.click("button[type=submit]");
  // NOV PAGE
  // pocakaj da se naloada element preden gres v akcijo
  await page.waitForSelector("[data-testid=property-card]");
  
  // poberi vse ki ustrezajo querySelectorjAll in jih vrni kot list urejenih objectov
  const ponudbe = await page.evaluate(async () => {
    let list = document.querySelectorAll("[data-testid=property-card]");

    return [...list].map((el) => ({
      title: el.querySelector("[data-testid=title]")?.innerText,
      price: Number(
        el
          .querySelector('[data-testid="price-and-discounted-price"]')
          .lastChild?.innerText.match(/\d/g) //global search for digits in string ->npr: 'Give 100%' = 1,0,0
          .join("")
      ),
      link: el.querySelector("[data-testid=title-link]").href,
      score: Number(
        el.querySelector("[data-testid=review-score]")?.innerText.split("\n")[0]
      ),
      image: el.querySelector('[data-testid="image"]').src,
      provider: "booking",
    }));
  });
  console.log("Ponudbe so:", ponudbe);
  // zapri browser
  await browser.close();
  return ponudbe;
}

module.exports = getBookings;
