#!/bin/bash
set -ex
curl --location --silent --show-error -o ~/.fonts/emojione-android.ttf  https://github.com/emojione/emojione-assets/releases/download/3.1.2/emojione-android.ttf
fc-cache -f -v
npm install --no-fund option 
node main.js
