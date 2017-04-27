/**
 * Created by mosa on 2016/3/17.
 */
var gulp        = require('gulp');
var browserSync = require('browser-sync');

// development or production
var config = require('../../../conf')('production').tools.browserSync.prod;

/**
 * Start a server and watch changes with BrowserSync
 */
gulp.task('browserSync:release', ['build:release'], function() {
  browserSync(config);
});

gulp.task("reload:release", function () {
    gulp.src(config.files)
        .pipe(browserSync.reload({stream: true}));
});