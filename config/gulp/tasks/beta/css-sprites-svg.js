/**
 * Created by mosa on 2016/3/17.
 */
var gulp = require('gulp');
//var svgSymbols = require('gulp-svg-symbols');
var config = require('../../../conf')('development').assets.image.svg.sprites;

/**
 * Generate sprite and css file from SVGs
 */
//gulp.task('sprites-svg', function () {
//    return gulp.src(config.src)
//        .pipe(svgSymbols())
//        .pipe(gulp.dest(config.dest.image));
//});