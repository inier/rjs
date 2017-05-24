/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
var collect = require('gulp-rev-collector');

// development or production
var config = require('../../../conf')('production').collect;

/**
 * Replace all links to assets in files
 * from a manifest file
 */
gulp.task('rev:collect', function () {
  return gulp
    .src(config.src)
    .pipe(collect({replaceReved: true}))
    .pipe(gulp.dest(config.dist));
});