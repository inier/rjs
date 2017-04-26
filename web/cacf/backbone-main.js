require.config({
    baseUrl: '',
    urlArgs: "ver=20170420072707",
    paths: {
        text: '../rock/com/requirejs-text/text',
        json: '../rock/com/requirejs-json/json',
        css: '../rock/com/requirejs-css/css',
        domReady: '../rock/com/requirejs-domready/domReady',
        jquery: '../rock/com/jquery/jquery-1.11.2',
        underscore: '../rock/com/underscore/underscore',
        backbone: '../rock/com/backbone/backbone',
        bootstrap: '../rock/com/bootstrap/js/bootstrap',
        // lib
        baseClient: '../rock/js/rock-client',
        rockBase: '../rock/js/rockbase',
        siteNav: '../rock/js/nav-main',
        topNav: '../rock/js/nav-details',
        dialog: '../rock/js/dialog/dialog',
        checkbox: '../rock/js/checkbox/Checkbox',
        placeholder: '../rock/js/placeholder/Placeholder',
        goBack: '../rock/js/goBack/goBack',
        common: '../rock/common'
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

require([
    'jquery', 'domReady', 'cacf/backbone-router'
], function ($, domReady, Router) {
    //console.log("Dom Is Ready! Do Something Init!");
    window.rock_router = new Router();
    Backbone
        .history
        .start({pushState: false});

    require([
        'checkbox', "placeholder", 'topNav', "bootstrap"
    ], function () {});
});
