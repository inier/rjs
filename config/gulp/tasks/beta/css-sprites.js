/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var spritesmith = require('gulp.spritesmith');
var cache = require('gulp-cache');
var changed = require('gulp-changed');

// development or production
var config = require('../../../conf')('development').assets.image;

// 合并精灵图任务 ps:该任务为独立任务，无法作为链式pipe的输入
var configSPRITES = config.sprites;

function doCombo(src, options, tBase) {
    var distImg = `${tBase}/${configSPRITES.dist.image}`;
    var distCss = `${tBase}/${configSPRITES.dist.css}`;

    console.log(src);
    // Generate our spritesheet
    var spriteData = gulp
        .src(src)
        .pipe(changed(src))
        .pipe(spritesmith(options));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData
        .img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
        .pipe(buffer())
        .pipe(gulp.dest(distImg));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData
        .css
    //.pipe(csso())
        .pipe(gulp.dest(distCss));

    // Return a merged stream to handle both `end` events
    merge(imgStream, cssStream);
}

gulp
    .task('sprites', function () {
        for (var i = 0; i < configSPRITES.dir.length; i++) {
            var tBase = `${config.project.src}/${configSPRITES.dir[i]}`;
            var src = `${tBase}/${configSPRITES.src}`;

            doCombo(src, configSPRITES.options, tBase);
        }
    });

gulp.task('spritesRetina', function () {
    for (var i = 0; i < configSPRITES.dir.length; i++) {
        var tBase = `${config.project.src}/${configSPRITES.dir[i]}`;
        var src = `${tBase}/${configSPRITES.srcRetina}`;

        doCombo(src, configSPRITES.optionsRetina, tBase);
    }
});