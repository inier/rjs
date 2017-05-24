var gulp = require('gulp');
var copy = require('gulp-copy');
var clean = require('gulp-clean');
var del = require('del');
var rjs = require('requirejs');
//var replace = require('gulp-replace');
var replace = require('gulp-batch-replace');

// development or production
var cfgs = require('../../../conf')('development');
var config = cfgs.optimize.rjs;

console.log(config);
var replacement = 'rock/common';
var replaceArr = [
    [
        'rock/js/rock-client', replacement
    ],
    [
        'rock/js/rockbase', replacement
    ],
    [
        'rock/com/jquery-lazyload/jquery.lazyload.min', replacement
    ],
    [
        'rock/js/checkbox/Checkbox', replacement
    ],
    [
        'rock/js/placeholder/Placeholder', replacement
    ],
    [
        'rock/com/jquery-raty/jquery.raty', replacement
    ],
    [
        'cartMenu/nav-cart', replacement
    ],
    [
        'login/user', replacement
    ],
    [
        'rock/js/nav-main', replacement
    ],
    [
        'rock/js/nav-details', replacement
    ],
    [
        'rock/js/imgReload/imgReload', replacement
    ],
    ['rock/com/jquery-FlexSlider/jquery.flexslider.min', replacement]
];

// gulp.task('copy:RJS', function (cb) {     return  gulp.src(config.path.lib)
// .pipe(gulp.dest(config.path.dist)); });

gulp.task('JS-COMBO', function (cb) {


    if (null == config) {
        return gulp
            .src(`${cfgs.project.paths.src}/**`)
            .pipe(gulp.dest(cfgs.project.paths.dist));
    }

    rjs
        .optimize(config.js, function (buildResponse) {
            console.log('build response', buildResponse);
            cb();
        }, cb);

    return gulp
        .src([`${config.js.dir}/**/index.js`])
        .pipe(replace(replaceArr))
        .pipe(gulp.dest(config.js.dir));
});

gulp.task('RJS:REPLACE', function () {
    return gulp
        .src([`${DIST}/**/index.js`])
        .pipe(replace(replaceArr))
        .pipe(gulp.dest(DIST));
});
