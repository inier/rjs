/**
 * Created by mosa on 2016/3/11.
 */
// js处理
var gulp = require('gulp'),
    jshint = require('gulp-jshint'), //js检查
    changed = require('gulp-changed'),
    cache = require('gulp-cache');

// development or production
var config = require('../../../conf')('development').assets.script;

gulp.task('js', function () {
    return gulp
        .src(config.src)
        .pipe(changed(config.dist))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        //.pipe(concat('main.js'))
        .pipe(gulp.dest(config.dist));
});