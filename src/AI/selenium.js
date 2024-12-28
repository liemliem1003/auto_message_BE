const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const CohereAI = require('./CohereAI');


const options = new chrome.Options();

// options.addArguments('--headless');
// options.addArguments('--disable-gpu');
// options.addArguments('--blink-settings=imagesEnabled=false');
// options.addArguments('--disable-webrtc');
// // options.addArguments('--disable-javascript');
// options.addArguments('--disable-blink-features=AutomationControlled');
// options.addArguments('--no-sandbox');
// options.addArguments('--window-size=1920,1080');

options.addArguments('--headless=new'); // Sử dụng headless cải tiến
options.addArguments('--disable-blink-features=AutomationControlled');
options.addArguments('--no-sandbox');
options.addArguments('--disable-gpu');
options.addArguments('--window-size=1920,1080');
options.addArguments('--disable-web-security');
options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');


const Path = "C:\\Users\\TGC\\Downloads\\chromedriver.exe";

var linkToPostBybit = ""
var bybitLink = 'https://announcements.bybitglobal.com/en/?category='
async function SeleniumForBybit() {
    await GetListOfLinkBybit(bybitLink)
    var result = await GetContentsOfBybit(linkToPostBybit)
    return result

}

async function GetListOfLinkBybit(link) {
    options.addArguments('--headless');
    // Chỉ định đường dẫn tới chromedriver (nếu không nằm trong PATH)
    const chromeDriverPath = Path;
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService()
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(link);
        const listLinks = await driver.findElement(By.className('article-list'));
        const links = await listLinks.findElements(By.tagName('a'));
        // for (let link of links) {
        //     const href = await link.getAttribute('href');
        //     href != null ? hrefs.push(href) : true
        // }

        linkToPostBybit = await links[0].getAttribute('href');

    } finally {
        await driver.quit(); // Đóng trình duyệt khi hoàn thành
    }
};


async function GetContentsOfBybit(href) {
    const chromeDriverPath = Path;
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService()
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(href);
        const text = await driver.findElement(By.className('article-detail')).getText();

        const imgtag = await driver.findElement(By.css('img[alt="bannerCover"]'));
        var src = await imgtag.getAttribute('src');
        console.log(src);

        var result = `<a href="${src}"> </a>` + await CohereAI(text);
        return result
    } finally {
        await driver.quit();
    }
}


var pionexLink = 'https://support.pionex.com/hc/en-us/sections/4409946599321-Latest-News?page=1#articles'
async function SeleniumForPionex() {
    await GetListOfLinkPionex(pionexLink)
    var result = await GetContentsOfPionex(linkToPostPionex)
    return result
}

async function GetListOfLinkPionex(link) {
    // Chỉ định đường dẫn tới chromedriver (nếu không nằm trong PATH)
    const chromeDriverPath = Path;
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService()
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(link);
        const articleList = await driver.findElement(By.className('article-list'));
        const listLinks = await articleList.findElement(By.className('article-list-item'));
        const links = await listLinks.findElements(By.tagName('a'));
        linkToPostBybit = await links[0].getAttribute('href');

    } finally {
        await driver.quit(); // Đóng trình duyệt khi hoàn thành
    }
};

async function GetContentsOfPionex(href) {
    const chromeDriverPath = Path;
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService()
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(href);
        const text = await driver.findElement(By.className('article-body')).getText();
        var result = await CohereAI(text);
        return result
    } finally {
        await driver.quit();
    }
}

//
var linkToCoinTeleGraph = []
var coinTeleGraphLink = 'https://cointelegraph.com/markets'

async function SeleniumForCoinTeleGraph(lastLink) {
    await GetListOfLinkCoinTeleGraph(coinTeleGraphLink)
    var link = linkToCoinTeleGraph[0]
    for (let i = 0; i < linkToCoinTeleGraph.length; i++) {
        if (linkToCoinTeleGraph[i] === lastLink) {
            link = linkToCoinTeleGraph[i + 1] || ""; 
            break;
        }
    }
    link == "" ? link = linkToCoinTeleGraph[0] : true
    var result = await GetContentsOfCointelegraph(link)
    return {
        result:result,
        lastLink: link
    }
}

async function GetListOfLinkCoinTeleGraph(link) {
    // Chỉ định đường dẫn tới chromedriver (nếu không nằm trong PATH)
   
    
    const chromeDriverPath = Path;
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService()
        .setChromeOptions(options)
        .build();
        
    try {
        
        await driver.get(link);
        const articleContainer = await driver.findElement(By.className('market-news__list'));
        const articleList = await articleContainer.findElements(By.tagName('a'));
        var hrefs = []

        for (let i = 0; i < articleList.length; i++) {
            var href = await articleList[i].getAttribute("href")
            hrefs.push(href)
        }

        hrefs = [... new Set(hrefs)]
        var links = []
        for (let i = 0; i < hrefs.length; i++) {
            if (hrefs[i].includes("/news/")) {
                links.push(hrefs[i])
            }
            
        }
        console.log(links);
        
        linkToCoinTeleGraph = links
    } finally {
        await driver.quit(); 
    }
};

async function GetContentsOfCointelegraph(href) {
    const chromeDriverPath = Path;
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService()
        .setChromeOptions(options)
        .build();

    try {
        console.log("test: " + href);
        await driver.get(href);
        const article = await driver.findElement(By.className('post__article'));
        const text = await article.getText();
        const img = await driver.findElement(By.className('lazy-image__img type:primaryImage'));

        var src = await img.getAttribute('src');
        result = `<a href="${src}"> </a>` + await CohereAI(text);
        console.log(result);
        
        return result
    } finally {
        await driver.quit();
    }
}

// async function main() {
//     const lastLink = "https://cointelegraph.com/news/price-analysis-12-27-btc-eth-xrp-bnb-sol-doge-ada-avax-link-ton";
//     const result = await SeleniumForCoinTeleGraph(lastLink);
//     console.log("result:"+result.result);
// }

// main();

module.exports = {
    SeleniumForBybit,
    SeleniumForCoinTeleGraph
};