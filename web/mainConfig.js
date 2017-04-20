// The build will inline common dependencies into this file. For any third party
// dependencies, like jQuery, place them in the lib folder. Configure loading
// modules from the lib directory, except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: "../web/rock",
    urlArgs: "ver=20170412091648",
    paths: {
        text: 'com/requirejs-text/text',
        json: 'com/requirejs-json/json',
        css: 'com/requirejs-css/css',
        domReady: 'com/requirejs-domready/domReady',
        jquery: 'com/jquery/jquery-1.11.2.min',
        underscore: 'com/underscore/underscore-min',
        backbone: 'com/backbone/backbone',
        bootstrap: 'com/bootstrap/js/bootstrap.min',
        // lib
        baseClient: 'js/rock-client',
        rockBase: 'js/rockbase',
        siteNav: 'js/nav-main',
        topNav: 'js/nav-details',
        dialog: 'js/dialog/dialog',
        checkbox: 'js/checkbox/Checkbox',
        placeholder: 'js/placeholder/Placeholder',
        goBack: 'js/goBack/goBack'
        // jquery_plugin
    },
    waitSeconds: 0,
    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        underscore: {
            exports: '_'
        },
        rockBase: {
            deps: ['backbone']
        }
    }
});
