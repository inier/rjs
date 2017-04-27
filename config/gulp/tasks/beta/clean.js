/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp'),
    del = require('del'),
    cache = require('gulp-cache');

// development or production
var config = require('../../../conf')('development').tools.gulp.del;

gulp.task('clean:dist', function(callback) {
    del(config.src, callback);
});

gulp.task('clean:cache', function(callback) {
    del(config.src);
    return cache.clearAll(callback);
});