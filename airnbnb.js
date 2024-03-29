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
  // pejt na url
  await page.goto(page_url, { waitUntil: "networkidle2" });
console.log('loaded airbnb 1')
 /*  await page.click(
    "button._oda838"
  );
 */
  await page.click(
    "div[data-testid=little-search-icon]"
  );
  console.log('first click search airbnb 2')

  // napisi split v input
  await page.type(
    "input[data-testid=structured-search-input-field-query]",
    cityName
  );
  console.log('type city')
  // stisni na datum box da se odpre calendar
  await page.click(
    "div[data-testid=structured-search-input-field-split-dates-0]"
  );
  console.log('click calendar')
  // stisni od datuma
  await page.evaluate(
    async (fromMonth, fromDay) => {
      document
        .querySelector(
          `div[data-testid='calendar-day-${fromDay}/${fromMonth}/2022']`
        )
        .click();
    },
    fromMonth,
    fromDay
  );
  console.log('click from date')
  // stisni do datuma
  await page.evaluate(
    async (toMonth, toDay) => {
      //console.log(`div[data-testid='datepicker-day-2022-${toMonth}-${toDay}']`);
      document
        .querySelector(
          `div[data-testid='calendar-day-${toDay}/${toMonth}/2022']`
        )
        .click();
    },
    toMonth,
    toDay
  );
  console.log('click to date')
  // submit button
  /* await page.click("span._m9v25n"); */
  await page.click("span._jxxpcd");
  console.log('submit')

  // NOV PAGE
  // pocakaj da se naloada element preden gres v akcijo
  /* await page.waitForSelector("span[id^='title']"); */
  await page.waitForSelector("img._6tbg2q")
  // stisni room type
  //await page.click("button.v1tureqs.dir.dir-ltr");
  await page.click('button.v4b1g6f.dir.dir-ltr')
  console.log('click room type')


  await page.waitForSelector("a._1ku51f04")

  await page.click(
    "input._1yf4i4f"
  );
  console.log('click room type 2')
  await page.click(
    "a._1ku51f04"
  );
  console.log('click room type 3')
  await page.waitForSelector("img._6tbg2q")
  // izberi entire place
  /* await page.click(
    "div[data-testid=filterItem--1672203014678817110-checkbox-room_types-Entire_home_apt]"
  );
  // save changes
  await page.click("button[data-testid=filter-panel-save-button]"); */
  // poberi vse ki ustrezajo querySelectorjAll in jih vrni kot list urejenih objectov
  const ponudbe = await page.evaluate(async () => {
    let list = document.querySelectorAll("[itemprop=itemListElement]");
    return [...list].map((el) => ({
      title: el.querySelector("div.t1jojoys.dir.dir-ltr")?.textContent,
      
      link: `https://${
        el.querySelector(
          'div[itemprop="itemListElement"] > meta[itemprop="url"]'
        ).content
      }`,
      
      score:
        Number(
          el.querySelector(
            'span.ru0q88m.dir.dir-ltr'
          )?.textContent.match(/[^\s]+/)
        ) * 2,
        
      price: Number(
        el
          .querySelector("span._tyxjp1")
          ?.textContent.match(/\d/g)
          .join("")
      ),
      
      image: el.querySelector('img._6tbg2q').src,
     
      provider: 'airbnb'
    }));
  });
  console.log('stevilo ponudb', ponudbe.length)
  //console.log("Ponudbe so:", ponudbe);
  // zapri browser
  await browser.close();
  return ponudbe;
}

module.exports = getAirbnb;
