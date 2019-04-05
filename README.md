# Peerplays-Core-GUI

Graphical User Interface allowing users to manage their funds on the Peerplays blockchain.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) 
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## Technology Stack

- React
- [Electron](https://electronjs.org/) (wrapping into desktop app)
- [Redux](https://redux.js.org/) (single source of truth state management)
- Redux dev tools (allow user to debug )
- React-Router (we use this to control navigation)
- React-Router-Redux (sync React-Router with Redux so we can handle navigation with Redux)
- [ESlint](https://eslint.org/) (to ensure code style consistency)
- [Commitlint](https://www.npmjs.com/package/@commitlint/cli) (to ensure commit message adhere to [Conventional Commits](https://www.conventionalcommits.org))
- SCSS (CSS preprocessor)

<hr>

## Getting started

Peerplays-UI depends on Node.js. While it should work using versions as old as 0.12.x, it is recommended to use v8.9.x

On Ubuntu and OSX, the easiest way to install Node is to use the [Node Version Manager](https://github.com/creationix/nvm).
For Windows users there is [NVM-Windows](https://github.com/coreybutler/nvm-windows).

To install NVM for Linux/OSX, simply copy paste the following in a terminal:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
nvm install v8
nvm use v8
```

Once you have Node installed, you can clone the repo:

```bash
git clone https://github.com/peerplays-network/peerplays-core-gui
cd peerplays-core-gui
```

### Development

Initialize the application by running `npm run init`. Doing so will install commitizen globally on your environment so you can later commit via `git cz`.

> Before running this script, ensure you have at least one environments settings configured within `./config/enpoints.js`. By default, Alice endpoint is configured and the start script will point to it.
> To point to another endpoint configuration, add it to the `endpoints.js` file and select it with the start script like so: `TARGET=notAlice npm run start`

```bash
npm run start
```

Once the compilation is done the GUI will be available in your browser at: localhost:8082. Hot Reloading is enabled so the browser will live update as you edit the source files.

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

## Production

If you'd like to host your own wallet somewhere, you should create a production build and host it using NGINX or Apache. In order to create a prod bundle, simply run the following command:

```bash
npm run build
```

This will create a bundle in the /dist folder that can be hosted with the web server of your choice.

## How to Build the Executables of the Core GUI Wallet for Linux, MacOS, and Windows

### Requirements

Building the executables for a particular operating system should be performed from that particular operating system (e.g. build the Windows executable on Windows; build the MacOS exectuable on MacOS; build the Linux executable on Linux)

The requirements assume that certain tools are already available on the system. These include Node.js and Node Package Manager (NPM) and certain build tools for your operating system including Python 2.7+.

### Build Tools for Linux and MacOS

Node.js, NPM, and python may be obtained from your operating system's typical package manager such as "apt" for Ubuntu.

### Build Tools for Windows 10

.NET Framework 4.5.1 is required and is already installed on Windows 10.

Node.js and NPM may be downloaded from https://nodejs.org/en/download.  **You must use Node v.6.7.0 or earlier else errors will occur when downloading the dependencies of the "web" sub-directory.**

The remaining build tools for Windows (see https://www.npmjs.com/package/windows-build-tools) may be obtained with the following steps:

Open a new cmd as Administrator (Run as Administrator) and run

```bash
npm install --global --production windows-build-tools
npm config set msvs_version 2015 --global
```

## Obtain the Source Code of the Core GUI Wallet

```bash
git clone https://github.com/peerplays-network/peerplays-core-gui.git
cd peerplays-core-gui
```

Before building the GUI you will need to install the various dependencies that are unique for each subdirectory "module":

```bash
npm install
cd ../electron; npm install
cd build/; npm install
```

## Building the Executable

>The exectuable will appear within the "releases" folder within the "electron" folder for windows users. Linux based systems will have the releases in the root of the project after running the below script(s).

### Building the executable for Mac, Windows, and Linux

```bash
npm run release-mwl
```

### Building the executable for MacOS

```bash
npm run release-mac
```

### Building the Executable for Linux

If building on a mac the following command are required in order to produce the linux build

```bash
brew install dpkg fakeroot
npm run release-lin
```

### Building the Executable for Windows

```bash
npm run release-win
```
