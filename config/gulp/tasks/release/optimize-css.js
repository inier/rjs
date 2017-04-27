/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),  //重命名
    minifycss = require('gulp-minify-css'),  //css压缩
    changed = require('gulp-changed');

// development or production
var config = require('../../../conf')('production').optimize.css;
/**
 * Copy CSS files
 */
gulp.task('optimize:css', function () {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dist))  //输出目录
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(size())
        .pipe(gulp.dest(config.dist));
});