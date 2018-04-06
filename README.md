Peerplays-Core-GUI
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


# How to Build the Executables of the Core GUI Wallet for Linux, MacOS, and Windows

## Requirements
Building the executables for a particular operating system should be performed from that particular operating system (e.g. build the Windows executable on Windows; build the MacOS exectuable on MacOS; build the Linux executable on Linux)

The requirements assume that certain tools are already available on the system. These include Node.js and Node Package Manager (NPM) and certain build tools for your operating system including Python 2.7+.


### Build Tools for Linux and MacOS
Node.js, NPM, and python may be obtained from your operating system's typical package manager such as "apt" for Ubuntu.


### Build Tools for Windows 10
.NET Framework 4.5.1 is required and is already installed on Windows 10.

Node.js and NPM may be downloaded from https://nodejs.org/en/download.  **You must use Node v.6.7.0 or earlier else errors will occur when downloading the dependencies of the "web" sub-directory.**

The remaining build tools for Windows (see https://www.npmjs.com/package/windows-build-tools) may be obtained with the following steps:

Open a new cmd as Administrator (Run as Administrator) and run ...
```
npm install --global --production windows-build-tools
```

... and then ...
```
npm config set msvs_version 2015 --global
```


## Obtain the Source Code of the Core GUI Wallet
```
git clone https://github.com/PBSA/peerplays-core-gui.git
cd peerplays-core-gui
```

Before building the GUI you will need to install the various dependencies that are unique for each subdirectory "module":
```
cd dl; npm install
cd ../web; npm install
cd ../electron; npm install
```

## Building the Executable
### Building the executable for MacOS
```
cd web; npm run electron
cd ../electron/node_modules/electron-prebuilt; rm -rf dist
npm_config_platform=darwin npm run postinstall
cd ../../
npm run release
```

The exectuable will appear within the "releases" folder within the "electron" folder.

### Building the Executable for Linux
```
cd web; npm run electron
cd ../electron/node_modules/electron-prebuilt; rm -rf dist
npm_config_platform=linux npm run postinstall
cd ../../
npm run release-linux
```

The exectuable will appear within the "releases" folder within the "electron" folder.

### Building the Executable for Windows
```
cd web; npm run electron
cd ../electron/node_modules/electron-prebuilt; rm -rf dist
npm_config_platform=win32 npm run postinstall
cd ../../
npm run release-windows
```

The exectuable will appear within the "releases" folder within the "electron" folder.
