<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| consoleOutputEnabled | consoleOutputEnabled | true | false |
| css | Custom CSS overrides | N/A | false |
| customizations | String representation of a YAML or JSON map of CSS paths (key) and replacement (value) | N/A | false |
| deviceScaleFactor | Specifies the device scale factor (pixel ratio) for the web page rendering. It determines how many physical pixels are used to represent a single logical pixel. For example, a device scale factor of 2 means one logical pixel is represented by two physical pixels, commonly used for high-DPI (Retina) displays. A value of 1 uses standard pixel density. This factor affects the resolution and quality of the rendered page or screenshot. | 2 | false |
| fullPage | Screen capture the entire page by scrolling down | false | false |
| imageQuality | Quality of the output image (1-100, applicable for JPEG) | N/A | false |
| omitBackground | Omit the browser default background. Enable to support transparency. | true | false |
| output | Output image file path | screenshot.png | false |
| outputType | Output image type | png | false |
| url | URL of the HTML content to convert to an image. Use file:// for local files | N/A | true |
| viewportHeight | Viewport height in pixels | N/A | true |
| viewportWidth | Viewport width in pixels | N/A | true |
| waitForTimeout | Number of miliseconds to delay before taking screenshot | 500 | false |


## Outputs

| Name | Description |
|------|-------------|
| file | File containing the generated screenshot |
<!-- markdownlint-restore -->
