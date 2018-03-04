var gulp          = require('gulp');
var browsersync   = require('browser-sync').create();
var nodemon       = require('gulp-nodemon');
var gutil         = require('gulp-util');
var reload = browsersync.reload;

const env = gutil.env.env;

var BROWSER_SYNC_REFRESH = 1; // increase this value if browsersync fails to refresh.

var paths = {
  app: './app.js',
  'READMES': './READMES/*.md'
};

var arrWatchPaths = [];
for (key in paths){
  arrWatchPaths.push(paths[key]);
}

gulp.task('browserSync', ['nodemon'], function() {
  browsersync.init({
    proxy: "http://localhost:3000",  // local node app address
    port: 4000,
    notify: false
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    env: {'NODE_ENV': env}
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
});

gulp.task('default', ['browserSync'], function (){
  gulp.watch(arrWatchPaths).on('change', function (){
    setTimeout(reload, BROWSER_SYNC_REFRESH);
  });
});
