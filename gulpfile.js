var gulp = require('gulp');
var copy = require('gulp-copy');
var clean = require('gulp-clean');
var del = require('del');
var rjs = require('requirejs');

var libJS = ['jquery', 'underscore', 'backbone', 'bootstrap'];
var commonJS = [
  'domReady!', 'text!', 'css!', 'json!',
  //'baseClient',
  'placeholder',
  'checkbox',
  //'goBack', 'dialog',
  'siteNav'
];
var config = {
  rjs: {
    js: {
      appUrl: "./web",
      baseUrl: "./web",
      fileExclusionRegExp: /^\./,
      mainConfigFile: "./web/mainConfig.js",
      dir: "./web-built",
      urlArgs: "ver=20170412091648",
      modules: [
        {
          name: 'rock/common',
          include: commonJS,
          exclude: libJS
        }, {
          name: 'home/index',
          include: [],
          exclude: commonJS.concat(libJS)
        }, {
          name: 'cars/index',
          include: [],
          exclude: commonJS.concat(libJS)
        }, {
          name: 'cacf/index',
          include: [],
          exclude: commonJS.concat(libJS)
        }
      ],
      optimize: "uglify2",
      optimizeCss: 'standard',
      removeCombined: true
    },
    css: {
      baseUrl: './web/rock/css',
      out: '../css/main.min.css',
      cssIn: '../css/main.css',
      optimizeCss: 'standard'
    }
  },
  scripts: ['modules/**/*.js', 'modules/**/**/*.js', 'main.js']
};

gulp.task('buildJS', function (cb) {
  rjs
    .optimize(config.rjs.js, function (buildResponse) {
      // console.log('build response', buildResponse);
      cb();
    }, cb);
});
// Rerun the task when a file changes gulp.task('watch', function() {   var
// watcher = gulp.watch(paths.scripts, ['build']);   watcher.on('change',
// function(event) {     console.log('File ' + event.path + ' was ' + event.type
// + ', running tasks...');   }); });

gulp.task('default', [
  'buildJS'
  //,'buildCSS' ,'watch'
]);
