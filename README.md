[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) 
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# Bookie

Desktop betting exchange application for the PeerPlays blockchain

## Install and Run

Clone this repo and do the following:

```bash
// Install commitizen and other npm packages
$ npm run init

// Start the dev server
$ npm start

// Build the app to be packaged with Electron
$ npm run build
```

The application will be opened as a web app (in a browser instance) and an Electron app.

## Technology Stack

- React
- [Electron](https://electronjs.org/) (wrapping into desktop app)
- [Redux](https://redux.js.org/) (single source of truth state management)
- React-Router (we use this to control navigation)
- React-Router-Redux (sync React-Router with Redux so we can handle navigation with Redux)
- [Ant-Design](https://ant.design/) (CSS/UI library)
- Redux dev tools (allow user to debug )
- [ESlint](https://eslint.org/) (to ensure code style consistency)
- [Commitlint](https://www.npmjs.com/package/@commitlint/cli) (to ensure commit message adhere to [Conventional Commits](https://www.conventionalcommits.org))
- LESS (CSS preprocessor)

## Commits

> If you have run the init script, you can commit via `git cz`.  
> If you have not run the init script, you must commit via `npm run commit`.  
> If you do neither, commit message consistency will be difficult for you.

This repository uses a combination of tools to aid in consistent commit messages. The reason we do this is so we can have dynamic changelog creation and smart semantic versioning based on commits (with the ability to override).

The following tools are used:

1. [commitizen](https://www.npmjs.com/package/commitizen)  
   Used for prompting recommended entries within a commit message to ensure it contains the necessary information.
   - [conventional changelog](https://www.npmjs.com/package/cz-conventional-changelog)  
     - Prompts for conventional changelog standard.
2. [husky](https://www.npmjs.com/package/husky)  
   By using the hooks from this package we intercept commits being made and verify them with commitlint.
   - Prevent bad commits/pushes.
3. [commitlint](https://www.npmjs.com/package/@commitlint/cli)
   - cli
   - [config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional)
     - rule preset in use

## Releases

This repository uses a [standard version](https://www.npmjs.com/package/standard-version) to aid in version control and release management.

When using standard version to cut a release, there is automated changelog modifitions made based on commit messages. 

```csharp
// If you typically use npm version to cut a new release, do this instead:
npm run release
// To cut a release and bump the version by major, minor, or patch, use the following respectively:
npm run release --major // major bump
npm run release --minor // minor bump
npm run release --patch // patch bump
// To cut a pre-release:
npm run prerelease // v0.2.1 to v0.2.2-rc.0
```
