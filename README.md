# crossroads [![Build Status](https://travis-ci.org/agauniyal/crossroads.svg?branch=master)](https://travis-ci.org/agauniyal/crossroads) [![codecov](https://codecov.io/gh/agauniyal/crossroads/branch/master/graph/badge.svg)](https://codecov.io/gh/agauniyal/crossroads) [![codebeat badge](https://codebeat.co/badges/581a9965-bd52-486e-bdd5-7fb2a42a94fd)](https://codebeat.co/projects/github-com-agauniyal-crossroads-master)
P2PSP server implementation


## How to start?
 - Clone the repo - `git clone https://github.com/agauniyal/crossroads`
 - Install required dependencies `cd crossroads && npm install --production` (for yarn, replace `npm install` with `yarn` and keep the `--production` flag as it is)
 - Start the server - `npm start` (for yarn, use `yarn start`)

Make sure you have latest node version (node v8 currently), though it should work with v7 as well. Crossroads is continously tested on Travis CI against Node v8 and latest Node version.

## How to develop?
 - Clone the repo - `git clone https://github.com/agauniyal/crossroads`
 - Install required dependencies `cd crossroads && npm install` (for yarn, replace `npm install` with `yarn`)
 - Start the server - `npm run dev` (for yarn, use `yarn dev`)
 - Make changes, update test files in `tests` directory and run tests - `npm test` or `yarn test`
 - At the end, make sure to generate docs via - `npm run gen-docs` command (for yarn - `yarn gen-docs`)

Make sure to check out auto-generated [documentation](docs) as well.
