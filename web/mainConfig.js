// The build will inline common dependencies into this file. For any third party
// dependencies, like jQuery, place them in the lib folder. Configure loading
// modules from the lib directory, except for 'app' ones, which are in a sibling
// directory.
require.config({
    baseUrl: "./",
    urlArgs: "ver=20170412091648",
    paths: {
        text: 'rock/com/requirejs-text/text',
        json: 'rock/com/requirejs-json/json',
        css: 'rock/com/requirejs-css/css',
        domReady: 'rock/com/requirejs-domready/domReady',
        jquery: 'rock/com/jquery/jquery-1.11.2.min',
        underscore: 'rock/com/underscore/underscore-min',
        backbone: 'rock/com/backbone/backbone',
        bootstrap: 'rock/com/bootstrap/js/bootstrap.min',
        // lib
        baseClient: 'rock/js/rock-client',
        rockBase: 'rock/js/rockbase',
        siteNav: 'rock/js/nav-main',
        topNav: 'rock/js/nav-details',
        dialog: 'rock/js/dialog/dialog',
        checkbox: 'rock/js/checkbox/Checkbox',
        placeholder: 'rock/js/placeholder/Placeholder',
        goBack: 'rock/js/goBack/goBack',
        common:'rock/common'
        // jquery_plugin
    },
    waitSeconds: 0,
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore', 'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        rockBase: {
            deps: ['backbone']
        }
    }
});
