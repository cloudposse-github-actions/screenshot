#!/bin/bash
set -ex

# Install Additional Fonts
mkdir -p ~/.fonts

# Install Twitter Emoji Font
# Solution found in https://stackoverflow.com/questions/50662388/running-headless-chrome-puppeteer-with-no-sandbox
#curl --location --silent --show-error -o ~/.fonts/emojione-android.ttf  https://github.com/emojione/emojione-assets/releases/download/3.1.2/emojione-android.ttf
wget https://github.com/13rac1/twemoji-color-font/releases/download/v14.0.2/TwitterColorEmoji-SVGinOT-Linux-14.0.2.tar.gz
tar -xzvf TwitterColorEmoji-*.tar.gz --wildcards '*.ttf'
find . -type f -wholename 'TwitterColorEmoji-*/*.ttf' -exec mv {} ~/.fonts/ \;

# Rebuild the font cache
fc-cache -f -v

# Install dependencies
npm install --no-fund option 

# Generate screenshot
node main.js
