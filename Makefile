SHELL := /bin/bash

# List of targets the `readme` target should call before generating the readme
export README_DEPS ?= docs/github-action.md

-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

deps:
	npm install

build:
	npm run build

bundle:
	npm run bundle

tests:
	npm test
