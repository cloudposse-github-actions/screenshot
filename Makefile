SHELL := /bin/bash

# List of targets the `readme` target should call before generating the readme
export README_DEPS ?= docs/github-action.md

export GITHUB_WORKSPACE ?= $(PWD)

-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

deps:
	npm install

run:
	node main.js

# This will not work on a Mac
docker/run:
	docker run -i --init --cap-add=SYS_ADMIN -v $(PWD):$(PWD) --workdir=$(PWD) ghcr.io/puppeteer/puppeteer:21.3.8 bash -c 'npm install --no-fund option && node main.js'
