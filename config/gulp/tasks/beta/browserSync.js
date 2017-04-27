/**
 * Created by mosa on 2016/3/16.
 */
//browser-sync
var browserSync = require('browser-sync'),
    gulpUtil = require('gulp-util'),
    gulp = require('gulp');

// development or production
var config = require('../../../conf')('development').tools.browserSync.beta;
/**
 * Run the build task and start a server with BrowserSync
 */
gulp.task('browserSync', ['build:beta'], function () {
    browserSync(config, function (err, bs) {
        console.log(bs.options.getIn(["urls", "local"]));
    });
    //�����κ��ļ��仯��ʵʱˢ��ҳ��
    gulp.watch(config.files).on('error', gulpUtil.log).on('change', browserSync.reload);
});

gulp.task("reload", function () {
    gulp.src(config.files)
        .pipe(browserSync.reload({stream: true}));
});