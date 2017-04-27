/**
 * Created by mosa on 2016/3/16.
 */
// HTML处理
var gulp = require('gulp'),
    changed = require('gulp-changed');

// development or production
var config = require('../../../conf')('development').assets.html;

gulp.task('html', function () {
    return gulp
        .src(config.src)
        .pipe(changed(config.dist))
        .pipe(gulp.dest(config.dist));
});