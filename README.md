# Bookie
Desktop betting exchange application for the PeerPlays blockchain

## Install and Run
Clone this repo and do the following:

```
// Initialize the Peerplays submodules
$ git submodule init
$ git submodule update

// Install node dependencies 
$ npm install

// Link the local modules
$ npm link lib/peerplaysjs-lib lib/peerplaysjs-ws

// Change into the peerplaysjs-lib directory so that we can link the peerplaysjs-ws library
$ cd lib/peerplaysjs-lib

// Link the peerplaysjs-ws library for this submodule
$ npm link ../peerplaysjs-ws

// Start the dev server
$ npm start
```

The application will be opened as a web app (in a browser instance) and an Electron app.

## Technology Stack
- React
- Electron (wrapping into desktop app)
- Redux (single source of truth state management)
- React-Router (we use this to control navigation)
- React-Router-Redux (sync React-Router with Redux so we can handle navigation with Redux)
- Ant-Design (CSS/UI library)
- Redux dev tools (allow user to debug )
- ESlint (to ensure code style consistency)
- LESS (CSS preprocessor)

## Wiki
Please refer to the [Project Wiki](https://bitbucket.org/ii5/bookie/wiki/Home) for more information.
