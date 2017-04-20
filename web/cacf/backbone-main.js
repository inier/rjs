/**
 * Created by KirK-Jiang on 2015/4/13.
 */
require.config({
    baseUrl: '',
    urlArgs: "ver=20170412091648",
    paths: {
        // require.js plugins
        text: '../rock/com/requirejs-text/text',
        json: '../rock/com/requirejs-json/json',
        css: '../rock/com/requirejs-css/css',
        domReady: '../rock/com/requirejs-domready/domReady',
        jquery: '../rock/com/jquery/jquery-1.11.2.min',
        underscore: '../rock/com/underscore/underscore',
        backbone: '../rock/com/backbone/backbone',
        moment: '../rock/com/moment/moment',
        // lib
        baseClient: '../rock/js/rock-client',
        rockBase: '../rock/js/rockbase',
        dialog: '../rock/js/dialog/dialog',
        feedback: '../rock/js/feedback/feedback',
        checkbox: '../rock/js/checkbox/Checkbox',
        placeholder: '../rock/js/placeholder/Placeholder',
        user: '../login/user',
        location: '../rock/js/location/Location',
        // jquery_plugin
        pngfix: '../rock/com/jquery-pngFix/pngFix',
        flexslider: '../rock/com/jquery-FlexSlider/jquery.flexslider',
        pagination: '../rock/com/jquery-pagination/js/pagination',
        bootstrap: '../rock/com/bootstrap/js/bootstrap.min',
        lazyload: '../rock/com/jquery-lazyload/jquery.lazyload.min',
        imgReload: '../rock/js/imgReload/imgReload'
    },
    waitSeconds: 0,
    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'backbone'
        },

        pngfix: ['jquery'],

        flexslider: ['jquery'],

        lazyload: ['jquery'],

        underscore: {
            exports: '_'
        },

        rockBase: {
            deps: ['backbone']
        }
    }
});

require(['jquery', 'domReady!', 'user', 'lazyload', '../cacf/backbone-router'],
    function ($, domReady, User, lazyload, Router) {
        //console.log("Dom Is Ready! Do Something Init!");
        window.rock_router = new Router();
        Backbone.history.start({pushState: false});

        require(['checkbox', "placeholder", /*"../rock/js/nav-details",*/ "bootstrap"],
            function () {

            }
        );
    }
);

