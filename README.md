## Overview
The following project is a boilerplate for compiling an electron application. Using git submodules we can 
link to another web project that builds its output to a build folder. The build process will copy the build
folder over and inject it as the contents for the electron app.

### Setup

``` 
// Install the dependencies
$ npm install 

// If compiling for linux the gettext package is required.
$ brew install gettext

// To Update the submodule with the latest code in develop.
$ npm run update-submodules

// Compile the electron app.
$ npm run dist

// or
// Launch electron pointing at the development server.
$ npm run live

```
