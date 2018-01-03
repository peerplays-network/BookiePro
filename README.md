Peerplays-UI
============

### Getting started

Peerplays-UI depends on Node.js. While it should work using versions as old as 0.12.x, it is recommended to use v5.x.

On Ubuntu and OSX, the easiest way to install Node is to use the [Node Version Manager](https://github.com/creationix/nvm).
For Windows users there is [NVM-Windows](https://github.com/coreybutler/nvm-windows).

To install NVM for Linux/OSX, simply copy paste the following in a terminal:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
nvm install v5
nvm use v5
```

Once you have Node installed, you can clone the repo:
```
git clone https://github.com/PBSA/peerplays-core-gui
cd peerplays-core-gui
```

Before launching the GUI you will need to install the npm packages for each subdirectory:
```
cd dl; npm install
cd ../web; npm install
```

## Running the dev server

Once all the packages have been installed you can start the development server by going to the ./web folder and running:
```
npm start
```

Once the compilation is done the GUI will be available in your browser at: localhost:8082. Hot Reloading is enabled so the browser will live update as you edit the source files.

## Production
If you'd like to host your own wallet somewhere, you should create a production build and host it using NGINX or Apache. In order to create a prod bundle, simply run the following command:
```
npm run build
```
This will create a bundle in the /dist folder that can be hosted with the web server of your choice.
