const puppeteer = require('puppeteer');
const fs = require('fs').promises; // Import the fs module
const fsSync = require('fs');
const yaml = require('js-yaml');

const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE || '.';
const INPUT_OUTPUT = process.env.INPUT_OUTPUT || 'docs/example.png';
const INPUT_OUTPUT_TYPE = process.env.INPUT_OUTPUT_TYPE || 'png';
const INPUT_IMAGE_QUALITY = parseInt(process.env.INPUT_IMAGE_QUALITY, 10) || 100;
const INPUT_DEVICE_SCALE_FACTOR = parseInt(process.env.INPUT_DEVICE_SCALE_FACTOR, 10) || 2;
const INPUT_VIEWPORT_WIDTH = parseInt(process.env.INPUT_VIEWPORT_WIDTH, 10) || 2000;
const INPUT_VIEWPORT_HEIGHT = parseInt(process.env.INPUT_VIEWPORT_HEIGHT, 10) || 800;
const INPUT_URL = process.env.INPUT_URL || 'file://' + GITHUB_WORKSPACE + '/test/html/index.html';
const INPUT_WAIT_FOR_TIMEOUT = parseInt(process.env.INPUT_WAIT_FOR_TIMEOUT, 10) || 500;
const INPUT_FULL_PAGE = process.env.INPUT_FULL_PAGE == 'true';
const INPUT_OMIT_BACKGROUND = process.env.INPUT_OMIT_BACKGROUND == 'true';
const INPUT_CONSOLE_OUTPUT_ENABLED = ( process.env.INPUT_CONSOLE_OUTPUT_ENABLED !== undefined && process.env.INPUT_CONSOLE_OUTPUT_ENABLED == 'true') || true;

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

async function convertPdfToSvg(inputFile, outputFile) {
  try {
    const { stdout, stderr } = await exec(`pdf2svg ${inputFile} ${outputFile}`);
    if(stdout)
      console.log('stdout:', stdout);
    if(stderr)
      console.error('stderr:', stderr);
  } catch (error) {
    console.error('exec error:', error);
  }
}



(async () => {
  const browser = await puppeteer.launch({headless: 'new', dumpio: false});
  const page = await browser.newPage();
  await page.setViewport({ width: INPUT_VIEWPORT_WIDTH, height: INPUT_VIEWPORT_HEIGHT, deviceScaleFactor: INPUT_DEVICE_SCALE_FACTOR });

  if (INPUT_CONSOLE_OUTPUT_ENABLED) {
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
  }

  console.log('Navigating to ' + INPUT_URL);
  await page.goto(INPUT_URL, {
    waitUntil: 'networkidle2',
  });
  await page.waitForTimeout(INPUT_WAIT_FOR_TIMEOUT);

  // Check if the custom.css file exists
  if (fsSync.existsSync('custom.css')) {
    console.log('Injecting custom CSS');
    const customCss = await fs.readFile('custom.css', 'utf8');
    await page.addStyleTag({ content: customCss });
  }

  if (fsSync.existsSync('custom.yaml')) {
    console.log('Rewritting content');
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
  if (INPUT_OUTPUT_TYPE == "svg") {
    const baseExt = path.extname(INPUT_OUTPUT);
    const baseName = path.basename(INPUT_OUTPUT, baseExt);
    const outputPdfFile = `${baseName}.pdf`;
    // First generate a PDF
    await page.screenshot({path: outputPdfFile, 'type': 'pdf', fullPage: INPUT_FULL_PAGE, omitBackground: INPUT_OMIT_BACKGROUND});

    // Then convert the PDF to SVG
    convertPdfToSvg(outputPdfFile, INPUT_OUTPUT);

  } else if (INPUT_OUTPUT_TYPE == "jpeg") {
    // Quality parameter is only valid for JPEG images
    await page.screenshot({path: INPUT_OUTPUT, 'quality': INPUT_IMAGE_QUALITY, 'type': INPUT_OUTPUT_TYPE, fullPage: INPUT_FULL_PAGE, omitBackground: INPUT_OMIT_BACKGROUND});
  } else {
    await page.screenshot({path: INPUT_OUTPUT, 'type': INPUT_OUTPUT_TYPE, fullPage: INPUT_FULL_PAGE, omitBackground: INPUT_OMIT_BACKGROUND});
  }
  await browser.close();
})();
