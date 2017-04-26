({
    appDir: '../../web',
    baseUrl: ".",
    mainConfigFile: "../mainConfig.js",
    fileExclusionRegExp: /^(r|build)\.js|.*\.scss$/,
    dir: "../../web-built",
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
    },
    modules: [
        {
            name: 'rock/common',
            include: ['domReady'],
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'bootstrap',
                'baseClient',
                'goBack',
                'dialog',
                'checkbox',
                'placeholder',
                'siteNav'
            ]
        }, {
            name: 'home/index',
            include: [],
            exclude: [
                'jquery',
                'underscore',                
                'backbone',
                'bootstrap',
                'baseClient',
                'goBack',
                'dialog',
                'checkbox',
                'placeholder',
                'siteNav',
                'common',
                'json','text','css',
                'json!rock/profile/profile.json'
            ]
        }, {
            name: 'cars/index',
            include: [],
            exclude: [
                'jquery',
                'underscore',                
                'backbone',
                'bootstrap',
                'baseClient',
                'goBack',
                'dialog',
                'checkbox',
                'placeholder',
                'siteNav',
                'common',
                'json','text','css',
                'json!rock/profile/profile.json'
            ]
        }, {
            name: 'cacf/index',
            include: ['cacf/backbone-main'],
            exclude: [
                'jquery',
                'underscore',                         
                'backbone',
                'bootstrap',
                'baseClient',
                'goBack',
                'dialog',
                'checkbox',
                'placeholder',
                'siteNav',
                'common',       
                'json','text','css',
                'json!rock/profile/profile.json'
            ]
        }
    ],
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
})