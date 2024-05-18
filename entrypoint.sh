#!/bin/bash
set -ex

source docker.env

cd ${ACTION_PATH}

# Install dependencies
npm install --no-fund option 

# Generate screenshot
node main.js