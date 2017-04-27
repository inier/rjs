/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
var jshint = require('gulp-jshint'); //js检查
var stylish = require('jshint-stylish');
var changed = require('gulp-changed');

// development or production
var config = require('../../../conf')('development').assets.script.jshint;

/**
 * Check JavaScript sytax with JSHint
 */
gulp.task('jshint', function () {
    return gulp
        .src(config.src)
        .pipe(changed(config.dist))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish));
});