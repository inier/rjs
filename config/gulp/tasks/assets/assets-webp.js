/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
var webp = require('gulp-webp');
var size = require('gulp-size');
var cache = require('gulp-cache');

// development or production
var config = require('../../../conf')('development').assets.image.webp;
/**
 * Convert images to WebP
 */
gulp.task('webp', function () {
    return gulp.src(config.src)
        .pipe(webp(config.options))
        .pipe(size())
        .pipe(gulp.dest(config.dist));
});