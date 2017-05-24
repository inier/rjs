/**
 * == rjs优化项
 */

// 是否启动JS优化
const isOptimised = true;
// js优化等级[ 0 , 1, 2 ]  1: 提取公共文件到common.js   2：所有合并到一个文件
const jsOptimisedLevel = "1";

// 资源版本号，仅开发时使用
const ASSETS_VERSION = "ver=" + (+ new Date());

// 'baseClient', 'placeholder', 'checkbox', 'goBack', 'dialog',
// 'siteNav','domReady', 'json','text','css'
const libArr = ['jquery', 'underscore', 'backbone', 'bootstrap'];

// 不需要使用返回值的模块
const extCommonArr = ['siteNav', 'detailNav', 'imgReload', 'flexslider'];

// 需要使用返回值的模块
const commonArr = [
    'baseClient',
    'rockBase',
    'lazyload',
    'checkbox',
    'placeholder',
    'raty',
    'cartMenuNav',
    'user'
].concat(extCommonArr);

const excludeArr = ['goBack', 'dialog'];

var bkExcludeArr = [];

if (isOptimised) {
    switch (jsOptimisedLevel) {
        case "2":
            {
                bkExcludeArr = [];
                break;
            }
        case "1":
            {
                bkExcludeArr = libArr
                    .concat(commonArr)
                    .concat(['common'])
                    .concat(excludeArr);
                break;
            }
    };
}

function getConfig(cfg) {
    const SRC = cfg.src,
        DIST = cfg.dist,
        ASSET = cfg.asset;

    if (isOptimised && jsOptimisedLevel) {
        return {
            js: {
                appUrl: `${SRC}`,
                baseUrl: `${SRC}`,
                //mainConfigFile: `${SRC}/rock/common.js`,
                fileExclusionRegExp: /(^example)|(.git)|(node_modules)|(bower_components)|(test)|(\.(scss))$/,
                dir: `${DIST}`,
                urlArgs: ASSETS_VERSION,
                paths: {
                    // lib
                    text: 'rock/com/requirejs-text/text',
                    json: 'rock/com/requirejs-json/json',
                    css: 'rock/com/requirejs-css/css',
                    domReady: 'rock/com/requirejs-domready/domReady',
                    jquery: 'rock/com/jquery/jquery-1.11.2',
                    underscore: 'rock/com/underscore/underscore',
                    backbone: 'rock/com/backbone/backbone',
                    bootstrap: 'rock/com/bootstrap/js/bootstrap',
                    moment: 'rock/com/moment/moment',
                    // jquery_plugin
                    pngfix: 'rock/com/jquery-pngFix/pngFix',
                    flexslider: 'rock/com/jquery-FlexSlider/jquery.flexslider.min',
                    raty: 'rock/com/jquery-raty/jquery.raty',
                    lazyload: 'rock/com/jquery-lazyload/jquery.lazyload.min',
                    videoJs: 'rock/com/jquery-videojs/video',
                    datepicker: 'rock/com/datetimepicker/bootstrap-datetimepicker.min',
                    pagination: 'rock/com/jquery-pagination/js/pagination',
                    pagePaging: 'rock/js/page/Paging',
                    pageDataSource: 'rock/js/page/DataSource',
                    qrcode: 'rock/js/qrCode/jquery.qrcode.min',
                    // site common(preload)
                    baseClient: 'rock/js/rock-client',
                    rockBase: 'rock/js/rockbase',
                    imgReload: 'rock/js/imgReload/imgReload',
                    checkbox: 'rock/js/checkbox/Checkbox',
                    placeholder: 'rock/js/placeholder/Placeholder',
                    cartMenuNav: 'cartMenu/nav-cart',
                    siteNav: 'rock/js/nav-main',
                    detailNav: 'rock/js/nav-details',
                    user: 'login/user',
                    // site common(lazylod)
                    feedback: 'rock/js/feedback/feedback',
                    dialog: 'rock/js/dialog/dialog',
                    goBack: 'rock/js/goBack/goBack',
                    location: 'rock/js/location/Location',
                    locationSelect: 'usedCar/locationSelect',
                    District: 'rock/js/location/District',
                    // site other
                    bounces: 'bounce/bounce',
                    recommend: 'recommends/index'
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
                        deps: ['backbone', "underscore"]
                    },
                    pngfix: ['jquery'],
                    flexslider: ['jquery'],
                    pagination: [
                        'jquery', 'css!rock/com/jquery-pagination/css/pagination.css'
                    ],
                    pagePaging: ['jquery'],
                    imgReload: ['jquery'],
                    detailNav: ['jquery'],
                    common: ['jquery'],
                    raty: ['jquery'],
                    lazyload: ['jquery'],
                    videoJs: {
                        deps: ['jquery', 'css!rock/com/jquery-videojs/video-js.css']
                    }
                },
                map: {
                    '*': {
                        //css: `/workspace/rjs/bower_components/require-css/css`
                        css: `tool-builder/require-css/css`
                    }
                },
                modules: [
                    {
                        name: 'rock/common',
                        include: commonArr,
                        exclude: libArr.concat(["text", "json", "css"])
                    }, {
                        name: 'cars/index',
                        include: [],
                        exclude: bkExcludeArr
                    }, {
                        name: 'home/index',
                        include: [],
                        exclude: bkExcludeArr
                    }, {
                        name: 'cacf/index',
                        include: [
                            'cacf/backbone-main', 'cacf/index'
                        ],
                        exclude: bkExcludeArr
                    }, {
                        name: 'diys/index',
                        include: [],
                        exclude: bkExcludeArr
                    }
                    /*, {
                                            name: 'comment/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'coupon/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'dealer/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'finance/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'help/help',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'news/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'partsList/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'shop/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'testDrive/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'usedCar/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'usedCarShop/index',
                                            include: [],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'car/index',
                                            include: ['car/backbone-main','car/index'],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'cart/index',
                                            include: ['cart/backbone-main','cart/index'],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'confirmOrder/index',
                                            include: ['confirmOrder/backbone-main','confirmOrder/index'],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'diy/index',
                                            include: ['diy/backbone-main','diy/index'],
                                            exclude: bkExcludeArr
                                        }, {
                                            name: 'parts/index',
                                            include: ['parts/backbone-main','parts/index'],
                                            exclude: bkExcludeArr
                                        }*/
                ],
                // 设置logLevel,TRACE: 0,INFO: 1,WARN: 2,ERROR: 3,SILENT: 4
                logLevel: 3,
                //在2.1.3，有些情况下当错误发生时不会抛出异常并停止优化，你可能想让优化器在某些错误发生时停止，就可以使用这个参数
                /*throwWhen: {
                            optimize: true
                        },*/
                optimize: isOptimised && jsOptimisedLevel
                    ? 'uglify2'
                    : 'none',
                uglify2: {
                    output: {
                        beautify: false
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
                optimizeCss: isOptimised && jsOptimisedLevel
                    ? 'standard'
                    : "none",
                // 是否忽略 CSS 资源文件中的 @import 指令
                cssImportIgnore: null,
                //如果设置为true，在输出目录将会删除掉已经合并了的文件
                removeCombined: true,
                // 默认注释有授权在里面。当然，在大项目生成时，文件比较多，注释也比较多，这样可以把所有注释写在文件的顶部。
                preserveLicenseComments: true,
                // 如果不是一个文件的优化，描述输出目录的所有.js文件的插件依赖，如果这个插件支持优化成为一个单独的文件，就优化它。
                // optimizeAllPluginResources: true,
                findNestedDependencies: true,
                // 当设置为true时，优化器将会跳过非构建中被约束的JS文件。
                skipDirOptimize: true,
                // 在2.0.2中。如果为true, 优化器会添加define(require, exports,
                // module){})；包裹每一个没有调用define()的文件。
                cjsTranslate: true,
                // 在2.0.2，有点实验性质。每一个模块集最后都会添加一段//#sourceUrl的注释。 useSourceUrl: true,
                // 处理所有的文本资源依赖项，从而避免为加载资源而产生的大量单独xhr请求
                inlineText: true,
                // 在 RequireJS 2.0.2 中，输出目录的所有资源会在 build 前被删除。值为 true 时
                // rebuild更快，但某些特殊情景下可能会出现无法预料的异常
                keepBuildDir: true,
                generateSourceMaps: true
            },
            css: {
                baseUrl: './web/rock/css',
                out: '../css/main.min.css',
                cssIn: '../css/main.css',
                optimizeCss: 'standard'
            }
        };
    } else {
        return null;
    }
}

module.exports = getConfig;