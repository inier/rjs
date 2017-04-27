/**
 * Created by mosa on 2016/3/17.
 */
var gulp   = require('gulp');
var rev    = require('gulp-rev');

// development or production
var config = require('../../../conf')('production').revision;

/**
 * Revision all asset files and
 * write a manifest file
 */
gulp.task('revision', function() {
  return gulp.src(config.src.assets, { base: config.src.base })
    .pipe(gulp.dest(config.dist.assets))
    .pipe(rev())
    .pipe(gulp.dest(config.dist.assets))
    .pipe(rev.manifest({ path: config.dist.manifest.name }))
    .pipe(gulp.dest(config.dist.manifest.path));
});