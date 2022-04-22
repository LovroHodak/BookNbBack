const page_url = "https://www.airbnb.com/";

const openBrowser = require("./browser");

async function getAirbnb(cityName, fromDay, fromMonth, toDay, toMonth) {
  fromMonth = fromMonth.padStart(2, "0");
  toMonth = toMonth.padStart(2, "0");
  fromDay = fromDay.padStart(2, "0");
  toDay = toDay.padStart(2, "0");
  //START
  // launchaj puppeterja v browser.js
  const browser = await openBrowser();
  // odpri browser
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
  console.log(await page.evaluate(() => navigator.userAgent));
  // pejt na url
  await page.goto(page_url, { waitUntil: "networkidle2" });

  // napisi split v input
  await page.type(
    "input[data-testid=structured-search-input-field-query]",
    cityName
  );
  // stisni na datum box da se odpre calendar
  await page.click(
    "div[data-testid=structured-search-input-field-split-dates-0]"
  );
  // stisni od datuma
  await page.evaluate(
    async (fromMonth, fromDay) => {
      document
        .querySelector(
          `div[data-testid='datepicker-day-2022-${fromMonth}-${fromDay}']`
        )
        .click();
    },
    fromMonth,
    fromDay
  );
  // stisni do datuma
  await page.evaluate(
    async (toMonth, toDay) => {
      console.log(`div[data-testid='datepicker-day-2022-${toMonth}-${toDay}']`);
      document
        .querySelector(
          `div[data-testid='datepicker-day-2022-${toMonth}-${toDay}']`
        )
        .click();
    },
    toMonth,
    toDay
  );
  // submit button
  /* await page.click("span._m9v25n"); */
  await page.click("div.s1i622mb");

  // NOV PAGE
  // pocakaj da se naloada element preden gres v akcijo
  await page.waitForSelector("span[id^='title']");
  // stisni room type
  await page.click("div[data-testid=menuItemButton-room_type]");
  // izberi entire place
  await page.click(
    "div[data-testid=filterItem-room_type-checkbox-room_types-Entire_home_apt]"
  );
  // save changes
  await page.click("button[data-testid=filter-panel-save-button]");
  // poberi vse ki ustrezajo querySelectorjAll in jih vrni kot list urejenih objectov
  const ponudbe = await page.evaluate(async () => {
    let list = document.querySelectorAll("[itemprop=itemListElement]");
    return [...list].map((el) => ({
      title: el.querySelector("span[id^='title']")?.textContent,
      link: `https://${
        el.querySelector(
          'div[itemprop="itemListElement"] > meta[itemprop="url"]'
        ).content
      }`,
      score:
        Number(
          el.querySelector(
            'div > div > span[aria-label] > span[aria-hidden="true"].rpz7y38.dir.dir-ltr'
          )?.textContent
        ) * 2,
      price: Number(
        el
          .querySelector("button > div > div._tt122m > span")
          ?.textContent.match(/\d/g)
          .join("")
      ),
      image: el.querySelector('img._6tbg2q').src,
      provider: 'airbnb'
    }));
  });

  console.log("Ponudbe so:", ponudbe);
  // zapri browser
  await browser.close();
  return ponudbe;
}

module.exports = getAirbnb;
