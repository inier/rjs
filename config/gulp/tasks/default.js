/**
 * Created by mosa on 2016/3/11.
 */
var gulp = require('gulp'),
    clean = require('gulp-clean');                  //清空文件夹
var config = require('../../conf')('development');
//// 清理任务：清理图片、样式、js
//gulp.task('clean', function () {
//    return gulp.src([config.scss.dest, config.caCss.dest, config.demoCss.dest, config.js.dest, config.images.dest, config.fonts.dest], {read: false})
//        .pipe(clean());
//});
//
//// 预设任务：清空图片、样式、js并重建 运行语句 gulp
//gulp.task('default', ['clean'], function () {
//    gulp.start(['html', "scss", 'images', 'js', 'fonts', 'watch']);
//});

gulp.task('default', ['watch']);
