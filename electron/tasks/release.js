

var gulp = require('gulp');
var utils = require('./utils');

var releaseForOs = {
  osx: require('./release_osx'),
  linux: require('./release_linux'),
  windows: require('./release_windows'),
};

gulp.task('release', [], function () {
  return releaseForOs['osx']();
});

gulp.task('release-windows', [], function () {
  return releaseForOs['windows']();
});

gulp.task('release-linux', [], function () {
  return releaseForOs['linux']();
});
