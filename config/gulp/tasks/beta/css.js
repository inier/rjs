/**
 * Created by mosa on 2016/3/17.
 */
// 样式处理
var gulp = require('gulp'); //基础库
var scss = require('gulp-scss'), //scss
    sourcemaps = require('gulp-sourcemaps'),
    handleErrors = require('../../utils/handleErrors'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'), //合并文件
    autoPreFixer = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    watch = require('gulp-watch');

// development or production
var config = require('../../../conf')('development').assets.style;

//task: scss
gulp.task('sass', function () {
    return gulp.src(config.src.scss) //scss源文件
        .pipe(changed(config.dist))
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: handleErrors})) //错误提示
        .pipe(autoPreFixer(config.autoprefixer))
        .pipe(scss(config.mode.expanded)) //执行编译
        .pipe(gulp.dest(config.dist)); //输出目录
});

//task: watch scss
gulp.task('sass:watch', function () {
    return gulp.src(config.src.scss) //scss源文件
        .pipe(watch(config.src.scss))
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: handleErrors})) //错误提示
        .pipe(autoPreFixer(config.autoprefixer))
        .pipe(scss(config.mode.expanded)) //执行编译
        .pipe(gulp.dest(config.dist)); //输出目录
});

//task: copy:css
gulp.task('css:copy', ['sass'], function () {
    return gulp.src(config.src.css) //css源文件
        .pipe(changed(config.dist))
        .pipe(gulp.dest(config.dist)); //输出目录
});