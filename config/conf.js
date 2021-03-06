/**
 * Created by mosa on 2016/3/11.
 * 项目的配置文件
 * gulp命令会由gulpfile.js运行
 */
const Settings = require('./settings');

// 项目名称
const Project = Settings.project.name;

// 发布版本号
const Version = Settings.project.version;

// 精灵图sprite合并
const spriteDir = Settings.sprite.dir;
const spriteOutFile = Settings.sprite.outFile;
// 打包精灵图的目录
const spriteRange = Settings.sprite.spriteRange;

// 发布 == 目录定义 
// -- 根目录
const ROOT = Settings.project.dir.root;
// -- 源文件
const _SRC = Settings.project.dir.src;
// 测试版本输出
const _BETA = Settings.project.dir.beta;
// 发布版本输出
const _PROD = Settings.project.dir.prod;
// 第三方库
const _VENDOR = Settings.project.dir.vendor;
// 公共组件库
const _COMMON = Settings.project.dir.common;
// MOCK
const _MOCK = Settings.project.dir.mock;
// VIEW
const _VIEWS = Settings.project.dir.view;
// 模板
const _TPLS = Settings.project.dir.tpl;
// 文档
const _DOC = Settings.project.dir.doc;
// 资源
const _ASSETS = Settings.project.dir.asset;
// 样式
const _STYLE = Settings.project.dir.style;
// 脚本
const _SCRIPT = Settings.project.dir.script;
// 图片
const _IMAGE = Settings.project.dir.image;
// 字体
const _FONT = Settings.project.dir.font;

// == 目录结构 源文件目录
const SRC = `${ROOT}/${_SRC}`;
const srcAssets = `${ROOT}/${SRC}/${_ASSETS}`;
// 目标文件目录 const DIST = `${ROOT}/dist`;
const BETA = `${ROOT}/${_BETA}/${Version}`; // 开发环境
const PROD = `${ROOT}/${_PROD}/${Version}`; // 发布环境
// 开发环境公共目录
const betaAssets = `${ROOT}/${BETA}/${_ASSETS}`;
// 发布环境公共目录
const prodAssets = `${ROOT}/${PROD}/${_ASSETS}`;
// 第三方库目录
const VENDOR = `${ROOT}/${_ASSETS}/${_VENDOR}`;
// 公共组件库目录
const COMMON = `${ROOT}/${_ASSETS}/${_COMMON}`;
// 版面目录
const VIEWS = `${ROOT}/${SRC}/${_VIEWS}`;
// 页面模板目录
const TPLS = `${ROOT}/${SRC}/${_TPLS}`;

// == 项目server
const HOST_BETA = 'http://localhost';
const PORT_BETA = 3000;
const PORT_UI_BETA = 3030;
const PORT_WEINRE_BETA = 3031;
const HOST_PROD = 'http://localhost';
const PORT_PROD = 80;
const PORT_UI_PROD = 8080;
const PORT_WEINRE_PROD = 8081;


function getConfig(env) {
    const DIST = (env == 'production') ?
        PROD :
        BETA;

    const distAssets = (env == 'production') ?
        prodAssets :
        betaAssets;

    // == rjs优化项
    const confRJS = require('./confRJS')({
        src: SRC,
        dist: DIST,
        asset: _ASSETS
    });

    return {
        project: {
            name: Project,
            ver: Version,
            paths: {
                common: {
                    from: 'common',
                    to: 'common'
                },
                dist: DIST,
                css: _STYLE,
                js: _SCRIPT,
                src: SRC,
                view: VIEWS,
                tpl: TPLS
            },
            options: {
                isSPA: false
            }
        },
        assets: {
            src: `${srcAssets}/**/*.*`,
            dist: distAssets,
            html: {
                src: [`${SRC}/**/!(_)*.html`],
                dist: DIST
            },
            style: { //所有css
                src: {
                    css: [
                        `${SRC}/**/*.css`, `${SRC}/**/*.map`
                    ],
                    scss: `${SRC}/**/!(_)*.scss` //所有scss的源路径
                },
                dist: DIST, //所有css的目标路径
                sourceMapPath: SRC,
                csslint: {
                    src: `${SRC}/**/*.css`
                },
                options: {
                    noCache: true,
                    compass: false,
                    bundleExec: true,
                    sourcemap: true,
                    precss: {},
                    mqpacker: {}
                },
                mode: { //编译scss过程需要的配置，可以为空
                    nested: {
                        style: 'nested'
                    }, //nested: 嵌套缩进的css代码，它是默认值；
                    expanded: {
                        style: 'expanded',
                        sourcemap: true
                    }, //expanded: 没有缩进的、扩展的css代码；
                    compact: {
                        style: 'compact'
                    }, //compact: 简洁格式的css代码；
                    compressed: {
                        style: 'compressed'
                    } //compressed：压缩后的css代码。
                },
                autoprefixer: {
                    browsers: [
                        'last 2 versions',
                        'safari 5',
                        'ie 8',
                        'ie 9',
                        'opera 12.1',
                        'ios 6',
                        'android 4'
                    ],
                    cascade: true
                }
            },
            script: { //所有脚本
                src: `${SRC}/**/*.js`,
                dist: DIST,
                jshint: {
                    src: `${SRC}/**/*.js`
                }
            },
            image: {
                src: `${SRC}/**/${_IMAGE}/**/*.+(jpeg|jpg|png|tiff|webp)`,
                dist: `${DIST}`,
                resize: {
                    src: `${SRC}/**/${_IMAGE}/**/*.+(jpeg|jpg|png|tiff|webp)`,
                    dist: `${DIST}/**/${_IMAGE}/resize`
                },
                sprites: {
                    // 需要打包精灵图的目录
                    dir: spriteRange,
                    src: `/${_IMAGE}/${spriteDir}/**/!(${spriteOutFile}|*@2x)*.png`,
                    srcRetina: `/${_IMAGE}/${spriteDir}/**/!(${spriteOutFile})*.png`,
                    dist: {
                        css: _STYLE,
                        image: _IMAGE
                    },
                    options: {
                        imgName: `${spriteOutFile}.png`, // 生成的图片
                        cssName: `${spriteOutFile}.scss`, // 生成的sass文件
                        imgPath: `../img/${spriteOutFile}.png`,
                        padding: 8, // 图元之间的距离
                        algorithm: 'binary-tree', // 图元的排序方式
                        cssFormat: 'css',
                        cssTemplate: "gulp/sprites/handlebarsStr.scss.handlebars", // 模板,采用handlebar
                        progressive: true //图片为连续
                    },
                    optionsRetina: {
                        retinaSrcFilter: [`${SRC}/**/${_IMAGE}/${spriteDir}/*@2x.png`],
                        retinaImgName: `${spriteOutFile}@2x.png`,
                        retinaImgPath: `../img/${spriteOutFile}@2x.png`,
                        imgName: `${spriteOutFile}.png`, // 生成的图片
                        cssName: `${spriteOutFile}.scss`, // 生成的sass文件
                        imgPath: `../img/${spriteOutFile}.png`,
                        padding: 8, // 图元之间的距离
                        algorithm: 'binary-tree', // 图元的排序方式
                        cssFormat: 'css',
                        cssTemplate: "gulp/utils/sprites/handlebarsStr.scss.handlebars", // 模板,采用handlebar
                        progressive: true //图片为连续
                    }
                },
                svg: {
                    src: [`${SRC}/**/${_IMAGE}/vectors/**/*.svg`],
                    dist: `${DIST}/**/${_IMAGE}/vectors`,
                    sprites: {
                        src: [`${SRC}/**/${_IMAGE}/vectors/**/*.svg`],
                        dist: {
                            css: `${DIST}/**/${_STYLE}`,
                            image: `${DIST}/**/${_IMAGE}/vectors`
                        }
                    }
                },
                webp: {
                    src: [`${SRC}/**/${_IMAGE}/**/*.{jpg,jpeg,png}`],
                    dist: `${DIST}/**/${_IMAGE}/webp`,
                    options: {}
                },
                base64: {
                    src: `${DIST}/**/${_STYLE}/**/*.css`,
                    dist: `${DIST}`,
                    options: {
                        baseDir: DIST,
                        extensions: ['png'],
                        maxImageSize: 20 * 1024, // bytes
                        debug: false
                    }
                }
            },
            fonts: {
                src: `${SRC}/**/${_FONT}/**/*.*`,
                dist: `${DIST}`
            },
            markdown: {
                toPdf: {
                    //src: [`${SRC}/${_DOC}/**/*.md`],
                    src: [
                        `${SRC}/${_DOC}/css.md`, `${SRC}/${_DOC}/js.md`
                    ],
                    dist: `${SRC}/${_DOC}/pdf`
                },
                toHtml: {
                    //src: [`${SRC}/${_DOC}/**/*.md`],
                    src: [
                        `${SRC}/${_DOC}/css.md`, `${SRC}/${_DOC}/js.md`
                    ],
                    dist: `${SRC}/${_DOC}/html`
                },
                fromHtml: {
                    src: [`${SRC}/${_DOC}/html2md/icons.html`],
                    dist: `${SRC}/${_DOC}/html2md`
                }
            },
            gzip: {
                src: `${DIST}/**/*.{html,xml,json,css,js}`,
                dist: `${DIST}`,
                options: {}
            }
        },
        optimize: {
            html: {
                src: [
                    `${DIST}/**/*.html`, `!${DIST}/**/help/**`, `!${DIST}/**/tool-precss/**`
                ],
                dist: DIST,
                options: {
                    removeComments: true, //清除HTML注释
                    collapseWhitespace: true, //压缩HTML
                    // collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==>
                    // <input /> removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==>
                    // <input />
                    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
                    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
                    minifyJS: true, //压缩页面JS
                    minifyCSS: true //压缩页面CSS
                }
            },
            css: {
                src: [
                    `${DIST}/**/*.css`, `!${DIST}/**/(.min)*.css`, `!${DIST}/**/tool-precss/**`
                ],
                dist: DIST,
                options: {
                    keepSpecialComments: 0
                }
            },
            js: {
                src: [
                    `${DIST}/**/*.js`, `!${DIST}/**/(.min)*.js`, `!${DIST}/**/tool-precss/**`
                ],
                dist: DIST,
                options: {
                    //mangle: true,//类型：Boolean 默认：true 是否修改变量名
                    mangle: {
                        except: ['require', 'exports', 'module', '$']
                    }, //排除混淆关键字
                    compress: true //, //类型：Boolean 默认：true 是否完全压缩
                        //preserveComments: all //保留所有注释
                }
            },
            rjs: confRJS,
            image: {
                src: [
                    `${SRC}/**/${_IMAGE}/**/*.*`, `!${SRC}/**/tool-precss/**`
                ],
                dist: DIST,
                options: {
                    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                    multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
                    svgoPlugins: [{
                            removeViewBox: false
                        }] //不要移除svg的viewbox属性
                        //use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
                }
            }
        },
        revision: {
            src: {
                assets: [
                    `${DIST}/**/*.css`, `${DIST}/**/*.js`, `${DIST}/**/${_IMAGE}/**`, `!${DIST}/**/tool-precss/**`
                ],
                base: DIST
            },
            dist: {
                assets: DIST,
                manifest: {
                    name: 'manifest.json',
                    path: DIST
                }
            }
        },
        collect: {
            src: [
                `${DIST}/**/manifest.json`, `${DIST}/**/*.{html,xml,txt,json,css,js}`, `!${DIST}/feed.xml`
            ],
            dist: DIST
        },
        server: {
            beta: {
                host: HOST_BETA,
                port: PORT_BETA
            },
            prod: {
                host: HOST_PROD,
                port: PORT_PROD
            }
        },
        tools: {
            gulp: {
                watch: {
                    html: `${SRC}/**/*.html`,
                    css: `${SRC}/**/*.css`,
                    scss: `${SRC}/**/!(_)*.scss`,
                    scripts: `${SRC}/**/${_SCRIPT}/**/*.js`,
                    fonts: `${SRC}/**/fonts/**/*`,
                    images: `${SRC}/**/${_IMAGE}/**/*`,
                    sprites: `${SRC}/**/${_IMAGE}/**/*.png`,
                    svg: `${SRC}/**/${_IMAGE}/vectors/**/ *.svg`
                },
                del: {
                    src: [`${DIST}/**/*`, `!${distAssets}/**/*`]
                }
            },
            mock: {},
            browserSync: {
                beta: {
                    server: {
                        //指定服务器启动根目录
                        baseDir: [`./${BETA}`]
                    },
                    //覆盖主机检测，如果你知道正确的IP使用
                    host: HOST_BETA,
                    port: PORT_BETA,
                    //更改默认端口weinre
                    ui: {
                        port: PORT_UI_BETA,
                        weinre: {
                            port: PORT_WEINRE_BETA
                        }
                    },
                    files: [`./${BETA}/**/*.*`],
                    //显示了我对过程的其他信息
                    logLevel: "debug"
                },
                prod: {
                    server: {
                        //指定服务器启动根目录
                        baseDir: [DIST]
                    },
                    host: HOST_PROD,
                    port: PORT_PROD,
                    ui: {
                        port: PORT_UI_PROD,
                        weinre: {
                            port: PORT_WEINRE_PROD
                        }
                    },
                    files: [`./${PROD}/**/*.*`]
                }
            }
        }
    };
}

module.exports = getConfig;