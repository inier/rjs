/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
var base64 = require('gulp-base64');

// development or production
var config = require('../../../conf')('development').assets.image.base64;

/**
 * Replace urls in CSS fies with base64 encoded data
 */
gulp.task('base64', function () {
    return gulp.src(config.src)
        .pipe(base64(config.options))
        .pipe(gulp.dest(config.dist));
});