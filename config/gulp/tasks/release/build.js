/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:release', ['build:beta'], function (callback) {
    runSequence(
        //'clean:cache',
        [
            'optimize:css',
            'optimize:js',
            'optimize:images',
            'optimize:html',
            'copy:fonts'
        ],
        'revision',
        'rev:collect',
        ['gzip'],
        callback);
});