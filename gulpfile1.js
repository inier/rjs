var gulp = require('gulp');
var copy = require('gulp-copy');
var clean = require('gulp-clean');
var del = require('del');
var rjs = require('requirejs');

var libJS = ['jquery', 'underscore', 'backbone', 'bootstrap'];
var commonJS = [
  'domReady'
  // ,'baseClient', 'placeholder', 'checkbox', 'goBack', 'dialog', 'siteNav'
];
var config = {
  rjs: {
    js: {
      appUrl: "./web",
      baseUrl: './web',
      // mainConfigFile: "./web/mainConfig.js", 
      fileExclusionRegExp: /^(r|build)\.js|.*\.scss$/,
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
          exclude: libJS
            .concat(commonJS)
            .concat(['common'])
        }, {
          name: 'cars/index',
          include: [],
          exclude: libJS
            .concat(commonJS)
            .concat(['common'])
        }, {
          name: 'cacf/index',
          include: ['cacfEntry'],
          exclude: libJS
            .concat(commonJS)
            .concat(['common'])
        }
      ],
      paths: {
        text: 'rock/com/requirejs-text/text',
        json: 'rock/com/requirejs-json/json',
        css: 'rock/com/requirejs-css/css',
        domReady: 'rock/com/requirejs-domready/domReady',
        jquery: 'rock/com/jquery/jquery-1.11.2',
        underscore: 'rock/com/underscore/underscore',
        backbone: 'rock/com/backbone/backbone',
        bootstrap: 'rock/com/bootstrap/js/bootstrap',
        // lib
        baseClient: 'rock/js/rock-client',
        rockBase: 'rock/js/rockbase',
        siteNav: 'rock/js/nav-main',
        topNav: 'rock/js/nav-details',
        dialog: 'rock/js/dialog/dialog',
        checkbox: 'rock/js/checkbox/Checkbox',
        placeholder: 'rock/js/placeholder/Placeholder',
        goBack: 'rock/js/goBack/goBack',
        common: 'rock/common',
        cacfEntry: 'cacf/backbone-main'
        // jquery_plugin
      },
      waitSeconds: 0,
      shim: {
       
      },
      optimize: "none",
      optimizeCss: 'standard',
      removeCombined: true,
      //generateSourceMaps: true,
      uglify2: {
        output: {
          beautify: true
        },
        compress: {
          sequences: false,
          global_defs: {
            DEBUG: false
          }
        },
        warnings: true,
        mangle: false
      }
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
