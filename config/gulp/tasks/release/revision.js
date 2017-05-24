/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
var rev = require('gulp-rev');

// development or production
var config = require('../../../conf')('production').revision;

/**
 * Revision all asset files and
 * write a manifest file
 */
gulp.task('rev', function () {
  return gulp
    .src(config.src.assets, {base: config.src.base})
    .pipe(rev())
    .pipe(gulp.dest(config.dist.assets))
    .pipe(rev.manifest({path: config.dist.manifest.name}))
    .pipe(gulp.dest(config.dist.manifest.path));
});

gulp.task('rev:css', function () {
  return gulp
    .src('src/css/*.css')
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));
});

gulp.task('rev:scripts', function () {
  return gulp
    .src('src/js/*.js')
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));
});