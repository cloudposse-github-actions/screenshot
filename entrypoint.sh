#!/bin/bash
set -ex

# Install Additional Fonts
mkdir -p ~/.fonts

# Solution found in https://stackoverflow.com/questions/50662388/running-headless-chrome-puppeteer-with-no-sandbox

# Install Noto Color Emoji
curl --location --silent --show-error -o ~/.fonts/NotoColorEmoji.ttf https://github.com/googlefonts/noto-emoji/blob/main/fonts/NotoColorEmoji.ttf?raw=true

# Install Twitter Emoji Font
wget https://github.com/13rac1/twemoji-color-font/releases/download/v14.0.2/TwitterColorEmoji-SVGinOT-Linux-14.0.2.tar.gz
tar -xzvf TwitterColorEmoji-*.tar.gz --wildcards '*.ttf'
find . -type f -wholename 'TwitterColorEmoji-*/*.ttf' -exec mv {} ~/.fonts/ \;

# Rebuild the font cache
fc-cache -f -v
fc-list | grep -i emoji

# Install dependencies
npm install --no-fund option 

# Generate screenshot
node main.js
