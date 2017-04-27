/**
 * Created by mosa on 2016/6/12.
 */
var gulp = require('gulp');
var html2md = require('gulp-html2md');

// development or production
var config = require('../../../conf')('production').assets.markdown.fromHtml;
/**
 * Html2Markdown
 */

gulp.task('Html2Md', function(){
  return gulp.src(config.src)
    .pipe(html2md())
    .pipe(gulp.dest(config.dist));
});