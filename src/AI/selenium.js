const { Builder, By} = require('selenium-webdriver');
const CohereAI = require('./CohereAI');
const chrome = require('selenium-webdriver/chrome');


const options = new chrome.Options();
options.addArguments('--headless');  // Chạy Chrome mà không mở cửa sổ
options.addArguments('--disable-gpu');  
options.addArguments('--blink-settings=imagesEnabled=false');
options.addArguments('--disable-webrtc');
options.addArguments('--disable-javascript');

var linkToPostBybit = ""
var bybitLink = 'https://announcements.bybitglobal.com/en/?category='
async function SeleniumForBybit() {
    await GetListOfLinkBybit(bybitLink)
    var result = await GetContentsOfBybit(linkToPostBybit)
    return result
    
}

async function GetListOfLinkBybit(link) {
    // Chỉ định đường dẫn tới chromedriver (nếu không nằm trong PATH)
    const chromeDriverPath = 'C:\\Users\\TGC\\Downloads\\chromedriver.exe';
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
    const chromeDriverPath = 'C:\\Users\\TGC\\Downloads\\chromedriver.exe';
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService()
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(href);
        const text = await driver.findElement(By.className('article-detail')).getText();
        var result = await CohereAI(text);
        return result
    } finally {
        await driver.quit();
    }
}


var linkToPostPionex = ""
var pionexLink = 'https://support.pionex.com/hc/en-us/sections/4409946599321-Latest-News?page=1#articles'
async function SeleniumForPionex() {
    await GetListOfLinkPionex(pionexLink)
    var result = await GetContentsOfPionex(linkToPostPionex)
    return result
}

async function GetListOfLinkPionex(link) {
    // Chỉ định đường dẫn tới chromedriver (nếu không nằm trong PATH)
    const chromeDriverPath = 'C:\\Users\\TGC\\Downloads\\chromedriver.exe';
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
    const chromeDriverPath = 'C:\\Users\\TGC\\Downloads\\chromedriver.exe';
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







module.exports = SeleniumForBybit;