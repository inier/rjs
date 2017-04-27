({
    appUrl: "./web",
    baseUrl: "../../web",
    urlArgs: "ver=20170412091648",
    //mainConfigFile: "../mainConfig.js",
    fileExclusionRegExp: /^(r|build)\.js|.*\.scss$/,
    dir: "../../web-built",
    modules: [
        {
            name: 'rock/common',
            include: [
            'domReady', 'text', 'css', 'json',
            'baseClient',
            'placeholder',
            'checkbox',
            'goBack', 'dialog',
            'siteNav'
            ],
            exclude: ['jquery', 'underscore', 'backbone', 'bootstrap']
        }
        ,
         {
            name: 'home/index',
            include: [],
            exclude: ['jquery', 'underscore', 'backbone', 'bootstrap']
        }, {
            name: 'cars/index',
            include: [],
            exclude: ['jquery', 'underscore', 'backbone', 'bootstrap']
        }, {
            name: 'cacf/index',
            include: ['cacf/backbone-main'],
            exclude: ['jquery', 'underscore', 'backbone', 'bootstrap']
        }
    ],
    optimize: "uglify2",
    optimizeCss: 'standard',
    removeCombined: true,
    generateSourceMaps: true,   
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
    },
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
        common: 'rock/common'
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
})