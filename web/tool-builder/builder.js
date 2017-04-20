({
    baseUrl: "",
    name: "../home/index",
    //optimize: "none",
    out: "../home/build.js",
	//userStrict: false,
	//fileExclusionRegExp: /^(css\\!../recommend/recommend)\.css$/,
	paths: {
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
        dialog:'../rock/js/dialog/dialog',
        checkbox: '../rock/js/checkbox/Checkbox',
        placeholder: '../rock/js/placeholder/Placeholder',
        feedback:'../rock/js/feedback/feedback',
        user:'../login/user',
        cartMenu:'../cartMenu/nav-cart',
		recommend:'../recommend/recommend',
        // jquery_plugin
        pngfix: '../rock/com/jquery-pngFix/pngFix',
        flexslider: '../rock/com/jquery-FlexSlider/jquery.flexslider.min',
        pagination:'../rock/com/jquery-pagination/js/pagination',
        raty:'../rock/com/jquery-raty/jquery.raty',
		lazyload:'../rock/com/jquery-lazyload/jquery.lazyload.min',
        bootstrap:'../rock/com/bootstrap/js/bootstrap.min',
        imgReload:'../rock/js/imgReload/imgReload',
        iealert:'../rock/com/jquery-ieAlert/iealert'
    },
    shim: {
         backbone: {
            deps: ['underscore'],
            exports: 'backbone'
        },

        bootstrap:{
        	deps: ['jquery'],
            exports: 'bootstrap'
        },

        pngfix: ['jquery'],

        flexslider: ['jquery'],

        pagination:['jquery'],
        
        imgReload:['jquery'],

        raty:['jquery'],

        underscore: {
            exports: '_'
        },

        rockBase: {
            deps: ['backbone']
        }
    }
})