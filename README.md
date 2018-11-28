# Bookie
Desktop betting exchange application for the PeerPlays blockchain

## Install and Run
Clone this repo and do the following:

```
// Install node dependencies
$ npm install

// Start the dev server
$ npm start

// Build the app to be packaged with Electron
$ npm run build
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
