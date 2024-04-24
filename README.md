# @metafox/workbox

## Scripts

### In Workbox

**bootstrap**

Bootstrap project's dependencies, actually alias of lerna bootstrap && lerna clean && lerna link

```shell script
# check node version, use node v16.14.0 stable version at https://nodejs.org/
node -v
```

** install dependencies **

```shell script
yarn && yarn bootstrap
```

** start dev server **

```shell script
yarn start

# to avoid admin site
yarn yarn start:admincp

# to start bundle analyzer

yarn start --analyzer
```

** test **

```bash
yarn test
```

**yarn bundle**

```shell script
# fill env variable in `app/.env`
# build production site
yarn bundle
```

## Directory structures

```text
- node_modules/: nodejs packages dependencies
- app: working site configuration
	- .env.example: example configuration
	- .env.development: overwrite config on local develop
	- .env.admincp.development: overwrite config on local develop for admincp
- packages/: yarn workspace projects
  - framework/: @metafox/framework packages
  - src/: source code
    - index.ts: source file
      - others.tsx: others source file
			- packages.json: package configuration
- package.json: dependency configuration
```

## Code Quality

**Code format**

- [eslint-config-metafox](https://www.npmjs.com/package/eslint-config-metafox)
- [prettier-config-metafox](https://www.npmjs.com/package/prettier-config-metafox)
- [stylelint-config-metafox](https://www.npmjs.com/package/stylelint-config-metafox)

**Documentation**

[Documents](https://www.docz.site/)

[Storybook](https://storybook.js.org/)

## CREDIT

- react
- react-router-dom
- redux
- @reduxjs/toolkit
- redux-saga
- material-ui@v5
- axios
- react-window
- react-mentions
- face-api.js
- lerna
- dotenv
- react-draggable
- react-easy-crop
- react-h5-audio-player
- react-intl
- react-resize-detector
- wavesurfer.js
- webpack
- husky
- draft-js
- commitlint
- typescript
- jest
- @testing-library/react
- webdriver-io
- cucumber-js
