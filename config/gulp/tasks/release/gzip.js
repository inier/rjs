/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
var gzip = require('gulp-gzip');

// development or production
var config = require('../../../conf')('production').assets.gzip;

/**
 * Gzip text files
 */
gulp.task('gzip', ['build:release'], function () {
    return gulp.src(config.src)
        .pipe(gzip(config.options))
        .pipe(gulp.dest(config.dist));
});