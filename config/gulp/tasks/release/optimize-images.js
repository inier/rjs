/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp'),
    changed = require('gulp-changed'),
    size = require('gulp-size');

// development or production
var config = require('../../../conf')('production').optimize.image;

/**
 * Copy and minimize image files
 */
gulp.task('optimize:images', function () {
    return gulp.src(config.src)
        .pipe(changed(config.dist)) // Ignore unchanged files
        .pipe(size())
        .pipe(gulp.dest(config.dist));
});