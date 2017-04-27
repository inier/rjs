/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin');

// development or production
var config = require('../../../conf')('production').optimize.html;

/**
 * Minimize HTML
 */
gulp.task('optimize:html', function () {
    return gulp
        .src(config.src)
        .pipe(htmlmin(config.options))
        .pipe(gulp.dest(config.dist));
});
