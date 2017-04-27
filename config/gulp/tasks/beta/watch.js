/**
 * Created by mosa on 2016/3/11.
 */
// 监听任务: 运行语句 gulp watch
var gulp = require('gulp');

// development or production
var config = require('../../../conf')('development').tools.gulp.watch;

/**
 * Start browserSync task and then watch files for changes ['browsersync'],
 */
gulp.task('watch', ['browserSync'], function () {
    // 监听html
    gulp
        .watch(config.html, function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            gulp.start(['html']);
        });
    //监听scss档，出现修改、立即执行对应任务
    gulp.watch(config.css, function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start(['css:copy']);
    });
    // watch(config.caCss.src, ['ca-css']); watch(config.demoCss.src, ['demo-css']);
    // 监听js
    gulp.watch(config.scripts, function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start(['js']);
    });
    // 监听images
    gulp.watch(config.images, function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start(['images']);
    });
    // 监听fonts
    gulp.watch(config.fonts, function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start(['copy:fonts']);
    });
});