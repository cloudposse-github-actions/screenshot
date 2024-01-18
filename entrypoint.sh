#!/bin/bash
set -ex

# Install Additional Fonts
TWITTER_COLOR_EMOJI_VERSION="14.0.2"
GOOGLE_NOTO_COLOR_EMOJI_VERSION="2.042"

mkdir -p ~/.fonts

# Solution found in https://stackoverflow.com/questions/50662388/running-headless-chrome-puppeteer-with-no-sandbox

# Install Noto Color Emoji
curl --location --silent --show-error -o ~/.fonts/NotoColorEmoji.ttf  https://github.com/googlefonts/noto-emoji/blob/v${GOOGLE_NOTO_COLOR_EMOJI_VERSION}/fonts/NotoColorEmoji.ttf?raw=true

# Install Twitter Emoji Font
wget https://github.com/13rac1/twemoji-color-font/releases/download/v${TWITTER_COLOR_EMOJI_VERSION}/TwitterColorEmoji-SVGinOT-Linux-${TWITTER_COLOR_EMOJI_VERSION}.tar.gz
tar -xzvf TwitterColorEmoji-*.tar.gz --wildcards '*.ttf'
find . -type f -wholename 'TwitterColorEmoji-*/*.ttf' -exec mv {} ~/.fonts/ \;

# Rebuild the font cache
fc-cache -f -v
fc-list | grep -i emoji

# Install dependencies
npm install --no-fund option 

# Generate screenshot
node main.js
