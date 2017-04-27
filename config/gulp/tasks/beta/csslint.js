/**
 * Created by mosa on 2016/4/15.
 */
var gulp = require('gulp'),
    csslint = require('gulp-csslint');

// development or production
var config = require('../../../conf')('development').assets.style.csslint;

gulp.task('csslint', function () {
    return gulp
        .src(config.src)
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(csslint.failReporter());
});