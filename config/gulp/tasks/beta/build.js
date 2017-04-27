/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:beta', function (callback) {
    runSequence(
        //'clean',
        ['html'],
        [
            'sass','css:copy'
        ],
        ['js'],
        ['images'],
        [
            'base64'//,'sprites-svg'
        ],
        ['copy:assets','copy:fonts'],
        callback
    );
});