const puppeteer = require('puppeteer');
const fs = require('fs').promises; // Import the fs module
const fsSync = require('fs');
const yaml = require('js-yaml');

const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
const INPUT_OUTPUT = process.env.INPUT_OUTPUT;

async function readYamlFile(filePath) {
  try {
    // Asynchronously read the YAML file
    const fileContents = await fs.readFile(filePath, 'utf8');

    // Parse the YAML content
    const data = yaml.load(fileContents);
    return data;
  } catch (e) {
    console.error(e); // Handle errors
  }
}


(async () => {
  const browser = await puppeteer.launch({headless: 'new', dumpio: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 2000, height: 800, deviceScaleFactor: 2});

  const { blue, cyan, green, magenta, red, yellow } = require('colorette')
  page
    .on('console', message => {
      const type = message.type().substr(0, 3).toUpperCase()
      const colors = {
        LOG: text => text,
        ERR: red,
        WAR: yellow,
        INF: cyan
      }
      const color = colors[type] || blue
      console.log(color(`${type} ${message.text()}`))
    })
    .on('pageerror', ({ message }) => console.log(red(message)))
    .on('response', response =>
      console.log(green(`${response.status()} ${response.url()}`)))
    .on('requestfailed', request =>
      console.log(magenta(`${request.failure().errorText} ${request.url()}`)))

  await page.goto('file://' + GITHUB_WORKSPACE + '/test/html/index.html', {
    waitUntil: 'networkidle2',
  });
  await page.waitForTimeout(500);

  // Check if the custom.css file exists
  if (fsSync.existsSync('custom.css')) {
    const customCss = await fs.readFile('custom.css', 'utf8');
    await page.addStyleTag({ content: customCss });
  }

  if (fsSync.existsSync('custom.yaml')) {
    // Read the element paths from the file
    const elementPaths = await readYamlFile('custom.yaml');

    // Inject jQuery if it's not already on the page
    const jQueryExists = await page.evaluate(() => window.$ !== undefined);
    if (!jQueryExists) {
      await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.6.0.min.js' });
    }

    // Inject the code to update elements based on the map
    await page.evaluate((elementPaths) => {
      $.each(elementPaths, function(selector, newValue) {
        console.log('Replacing ' + selector + ' with [' + newValue + ']');
        $(selector).html(newValue); // For other types of elements, you might need to use .text() or .html()
      });
    }, elementPaths);
  
    await page.waitForTimeout(2000);
  }

  //await page.screenshot({path: INPUT_OUTPUT, 'quality': 100, 'type': 'jpeg', fullPage: false, omitBackground: true});
  await page.screenshot({path: INPUT_OUTPUT, 'type': 'png', fullPage: false, omitBackground: true});
  await browser.close();
})();
