/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    uglify = require('gulp-uglify'),    //jsѹ��
    rename = require('gulp-rename'),    //������
    concat = require('gulp-concat'),
    size = require('gulp-size');

// development or production
var config = require('../../../conf')('production').optimize.js;
/**
 * Copy and minimize JS files
 */
gulp.task('optimize:js', function () {
    return gulp.src(config.src)
        //.pipe(concat('main.js'))
        .pipe(gulp.dest(config.dist))
        .pipe(uglify(config.options).on('error', gulpUtil.log))
        .pipe(size())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.dist));
});