/**
 * Created by mosa on 2016/3/16.
 */
// FONT处理
var gulp = require('gulp'),
    cache = require('gulp-cache');

// development or production
var config = require('../../../conf')('development').assets;

/**
 * Copy fonts to folder
 */
gulp.task('copy:assets', function () {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dist));
});
