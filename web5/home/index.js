require.config({
    baseUrl: "../",
    urlArgs: "ver=20170412091648",
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
});

require([
    'jquery',
    'common',
    'underscore',
    'baseClient',
    'placeholder',
    'checkbox',
    'goBack',
    'siteNav','bootstrap'
], function ($, domReady, _, BaseClient, placeholder, Checkbox, GoBack) {
    

    function CarDiy() {
        var scaleRatio = 1;
        var IMAGES = [
            {
                'class': 'car-base',
                "url": '../home/img/base/base02.png'
            },
            // {'class': 'car-base', "url":
            // 'rock/img/car-builder/cs15/roofColor/white/02.png'}, {'class': 'car-base',
            // "url": 'rock/img/car-builder/cs15/louver/level2/02.png'},
            {
                'class': 'car-skin',
                "url": 'rock/img/car-builder/cs15/exteriorColor/orange/02.png'
            }, {
                'class': 'car-skin',
                "url": 'rock/img/car-builder/cs15/exteriorColor/blue/02.png'
            }, {
                'class': 'car-skin',
                "url": 'rock/img/car-builder/cs15/exteriorColor/red/02.png'
            }, {
                'class': 'car-skin',
                "url": 'rock/img/car-builder/cs15/exteriorColor/gold/02.png'
            }, {
                'class': 'car-skin',
                "url": 'rock/img/car-builder/cs15/exteriorColor/white/02.png'
            }, {
                'class': 'car-skin',
                "url": 'rock/img/car-builder/cs15/exteriorColor/gray/02.png'
            }, {
                'class': 'car-skin',
                "url": 'rock/img/car-builder/cs15/exteriorColor/black/02.png'
            }
        ];

        var documentEl = $(document);
        // 触摸板
        var touchIdStr = 'ctrlTouch',
            // 触摸板选择串
            touchId = '#' + touchIdStr,
            // palette色块数
            part = 7;

        var CB_HandleEl = $('#carBuilderCtrl'),
            ctrlTouch = $(touchId),
            ctrlPaletteEl = $("#ctrlPalette"),
            ctrlPaletteImgEl = $('#ctrlPaletteImg'),
            ctrlTip = $('#ctrlTip');

        // ppo色板宽度
        var ctrlPaletteWidth = ctrlPaletteEl.width(),
            ctrlTouchWidth = ctrlTouch.width(),
            ctrlTouchHeight = ctrlTouch.height(),
            // 每一个颜色所占的宽度
            piece = parseInt(ctrlPaletteWidth / part);

        // 开始的X轴位置，X轴移动位置，当前的X轴位置，临时位置，每一个颜色所占的位置
        var startX,
            offsetX,
            offsetY,
            moveX,
            currentX,
            tmpX,
            abs;
        // 是否为自动展示
        var isAutoShow = true;
        // 拖动状态
        var dragging = false;

        //更新缩放比例
        var updateScale = function () {
            if (document.body.clientWidth >= 1636) {
                scaleRatio = 1;
            }
            if (document.body.clientWidth >= 1200 && document.body.clientWidth < 1636) {
                scaleRatio = 0.75;
            }
            if (document.body.clientWidth >= 900 && document.body.clientWidth < 1200) {
                scaleRatio = 0.55;
            }
            CB_HandleEl.css({
                '-ms-transform': 'scale(' + scaleRatio + ',' + scaleRatio + ')',
                '-webkit-transform': 'scale(' + scaleRatio + ',' + scaleRatio + ')',
                '-moz-transform': 'scale(' + scaleRatio + ',' + scaleRatio + ')',
                '-o-transform': 'scale(' + scaleRatio + ',' + scaleRatio + ')',
                'transform': 'scale(' + scaleRatio + ',' + scaleRatio + ')'
            });
        };
        //updateScale(); $(window).on('resize', updateScale);

        var changeColor = function (current) {
            var currentColor;
            switch (current) {
                case 1:
                    {
                        currentColor = ".color1";
                        break;
                    }
                case 2:
                    {
                        currentColor = ".color2";
                        break;
                    }
                case 3:
                    {
                        currentColor = ".color3";
                        break;
                    }
                case 4:
                    {
                        currentColor = ".color4";
                        break;
                    }
                case 5:
                    {
                        currentColor = ".color5";
                        break;
                    }
                case 6:
                    {
                        currentColor = ".color6";
                        break;
                    }
                case 7:
                    {
                        currentColor = ".color7";
                        break;
                    }
            }
            $('#carBuilderWrap ' + currentColor)
                .addClass("active")
                .siblings()
                .removeClass("active");
        };

        var move = function (tmpX) {
            abs = tmpX + ctrlPaletteWidth;
            var current = part - 1 - Math.floor(abs / piece);
            if (current == -1) {
                current = part - 1;
            }
            current = current - Math.floor(part / 2);
            if (current < 0) {
                current = current + part;
            }
            if (current > part) {
                current = current - part;
            }
            //console.log("当前色卡：" + current);
            changeColor(current);
            var carBuilderCtrlGoEl = $('.car-builder-ctrl-go');
            carBuilderCtrlGoEl.attr('href', '../diy/' + carBuilderCtrlGoEl.attr("data-model") + '.html?exterieurColor=' + current);
        };

        //控制背景滚动的距离区间，防止越界
        var posLimit = function (iX) {
            // 临时位置超过 0，证明移动累计超过1圈，重新设置基数
            if (iX >= -(ctrlPaletteWidth)) {
                iX = iX - ctrlPaletteWidth;
                currentX = currentX - ctrlPaletteWidth;
            }
            // 临时位置低于 -双倍ctrlPaletteWidth，只取余数
            if (iX <= -(ctrlPaletteWidth * 2)) {
                iX = iX + ctrlPaletteWidth;
                currentX = currentX + ctrlPaletteWidth;
            }
            return iX;
        };

        // 鼠标按下
        var mouseDown = _.throttle(function (ev) {
            var e = ev || window.event,
                oTarget = e.target || e.srcElement,
                currentTag = $(oTarget).attr('id');

            //$('#ppoColorTip').addClass('none'); 若是在触摸板上
            if (currentTag == touchIdStr) {
                //当鼠标按下时设定为true
                dragging = true;

                // 当前的位置为 -812
                currentX = +(ctrlTouch.attr('data-currentX')) || -(ctrlPaletteWidth * 1);

                // 开始的位置
                startX = Math.round(e.clientX / scaleRatio);

                //设置捕获范围
                if (oTarget.setCapture) {
                    oTarget.setCapture();
                } else if (window.captureEvents) {
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }

                // 绑定鼠标移动和离开的事件
                documentEl.on("mousemove", mouseMove);
                documentEl.on("mouseup", mouseUp);
            }

            return false;
        }, 200);

        // 鼠标移动时
        var mouseMove = function (ev) {
            var e = ev || window.event,
                oTarget = e.target || e.srcElement,
                currentTag = $(oTarget).attr('id');

            offsetX = e.offsetX || e.layerX;
            offsetY = e.offsetY || e.layerY;
            if (offsetX <= 20 || offsetX >= ctrlTouchWidth - 20 || offsetY <= 10 || offsetY >= ctrlTouchHeight - 10) {
                dragging = false;
                //console.log("越界");
                documentEl.off("mousemove");
                documentEl.off("mouseup");
            }
            if (dragging) {
                // 若是在触摸板上
                if (currentTag == touchIdStr) {
                    // 移动的位置 ＝ 当前的位置 - 开始的位置
                    moveX = Math.ceil(e.clientX / scaleRatio - startX);
                    // 当前的位置
                    tmpX = posLimit(currentX + moveX);
                    ctrlPaletteImgEl.css({left: tmpX});
                    // 移动至当前的位置
                    move(tmpX);
                } else {
                    mouseUp(event);
                }
            }

            return false;
        };

        //鼠标离开时
        var mouseUp = function (ev) {
            var e = ev || window.event,
                oTarget = e.target || e.srcElement;

            dragging = false;

            if (oTarget.releaseCapture) {
                oTarget.releaseCapture();
                e.cancelBubble = true;
            } else if (window.captureEvents) {
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }

            documentEl.off('mousemove');
            documentEl.off('mouseup');

            currentX = tmpX;

            //$('#ppoColorTip').removeClass('none');
            ctrlTouch.attr('data-currentX', tmpX);
            ctrlPaletteImgEl.css({left: tmpX});

            return false;
        };

        // touchStart
        var touchStart = function (e) {
            e.preventDefault();
            //var touch = event.targetTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
            var touch = e.originalEvent.changedTouches[0];
            //当拇指按下时设定为true
            dragging = true;
            // 当前的位置为 -812
            currentX = +(ctrlTouch.attr('data-currentX')) || -(ctrlPaletteWidth * 1);
            // 开始的位置
            startX = Math.round(touch.clientX / scaleRatio);
            documentEl.on("touchend", touchEnd);
            ctrlTouch.on("touchmove", touchMove);
        };
        // touchMove
        var touchMove = function (ev) {
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if (ev.originalEvent.targetTouches.length > 1 || ev.scale && ev.scale !== 1) 
                return;
            var touch = ev.originalEvent.changedTouches[0];
            if (dragging) {
                ev.preventDefault();

                // 移动的位置 ＝ 当前的位置 - 开始的位置
                moveX = Math.ceil(touch.clientX / scaleRatio - startX);
                // 当前的位置
                tmpX = posLimit(currentX + moveX);

                ctrlPaletteImgEl.css({left: tmpX});
                // 移动至当前的位置
                move(tmpX);
            }
            return false;
        };
        // touchEnd
        var touchEnd = function () {
            dragging = false;
            //判断是左移还是右移，当偏移量大于10时执行
            currentX = tmpX;
            //$('#ppoColorTip').removeClass('none');
            ctrlTouch.attr('data-currentX', tmpX);
            ctrlPaletteImgEl.css({left: tmpX});
            // 解除绑定
            documentEl.off('touchend');
            ctrlTouch.off('touchmove');
        };

        var bindEvent = function () {
            ctrlTouch.on("mousedown", mouseDown);
            //移动端
            ctrlTouch.on("touchstart", touchStart);
        };

        // 初始动画
        var action = function () {
            setTimeout(function () {
                var tx = -(ctrlPaletteWidth);
                var initAnimate = setInterval(function () {
                    if (tx == 0) {
                        window.clearInterval(initAnimate);
                        tmpX = currentX = -(ctrlPaletteWidth);
                        isAutoShow = false;
                        return;
                    }
                    move(tx);
                    tx = tx + 5;
                }, 10);
            }, 1000);
        };

        var showTip = function () {
            if (!CB_HandleEl.hasClass("show")) {
                $(".handle-hand").css({"animation-play-state": "running"});
                CB_HandleEl.addClass("show");
                //action();
            }
        };

        var hideTip = function () {
            if (CB_HandleEl.hasClass("show")) {
                $(".handle-hand").css({"animation-play-state": "paused"});
                CB_HandleEl.removeClass("show");
            }
        };

        //tip动画处理
        var calcScroll = function (el) {
            var CB_HandleEl = $(el),
                screenHeight = $(window).height(),
                CB_HandleHeight = CB_HandleEl.height(),
                CB_HandleOffsetTop = CB_HandleEl
                    .offset()
                    .top,
                pageScrollTop = documentEl.scrollTop();

            var remainHeight = CB_HandleOffsetTop - screenHeight + CB_HandleHeight + 20;
            if (pageScrollTop >= remainHeight && pageScrollTop <= CB_HandleOffsetTop - CB_HandleHeight + 40) {
                showTip();
            } else {
                hideTip();
            }
        };

        /* CSS TRANSITION SUPPORT */
        $.support.transitions = (function () {
            var thisBody = document.body || document.documentElement,
                thisStyle = thisBody.style;
            return thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
        })();
        /* 判断animaitionEnd的类型 */
        var animationEnd = (function () {
            var transition = "transition",
                body = document.body || document.documentElement,
                style = body.style;
            var vendorPrefix = (function () {
                var i = 0,
                    vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
                transition = transition
                    .charAt(0)
                    .toUpperCase() + transition.substr(1);
                while (i < vendor.length) {
                    if (typeof style[vendor[i] + transition] === "string") {
                        return vendor[i];
                    }
                    i++;
                }
                return false;
            })();

            if (vendorPrefix == "Webkit") {
                return "webkitAnimationEnd";
            } else {
                return "animationend";
            }
        }());

        var status = true;
        //tip动画降级处理
        if ($.support.transitions) {
            var scrollTimeout = false;
            $(window).on("scroll", function () {
                if (status) {
                    if (scrollTimeout) {
                        clearTimeout(scrollTimeout);
                    }
                    scrollTimeout = setTimeout(function () {
                        calcScroll('#carBuilderCtrl');
                    }, 200);
                }
            });

            ctrlTip.on("mouseover click", function () {
                hideTip();
                //$(window).off("scroll");
                status = false;
            });

            CB_HandleEl.on(animationEnd, function (e) {
                e.stopPropagation();
                hideTip();
                //$(window).off("scroll");
                status = false;
            });
        }

        //键盘操作
        /* documentEl.on("keydown", function (event) {
        var e = event || window.event;
        var key = e.keyCode || e.which || e.charCode;

        if (e && key == 39) { // right
        tmpX = posLimit(tmpX + piece);
        ctrlPaletteImgEl.css({
        left: tmpX
        });
        }
        if (e && key == 37) { // left
        tmpX = posLimit(tmpX - piece);
        ctrlPaletteImgEl.css({
        left: tmpX
        });
        }
        // 移动至当前的位置
        move(tmpX);
        });*/

        //图片loading
        function loading(config) {
            var IMAGES = config.images,
                imgNum = IMAGES.length,
                oImgs = [imgNum],
                loadingEl = $(config.el);
            _.each(IMAGES, function (data) {
                if (data && data.url) {
                    var newImg = new Image();
                    newImg.src = data.url;
                    oImgs.push(newImg);
                    if (oImgs.length > imgNum) {
                        if (loadingEl.hasClass("show")) {
                            loadingEl.removeClass("show");
                        }
                        $(config.elWrap).removeClass("hide");
                        bindEvent();
                    }
                }
            });
        }

        loading({images: IMAGES, el: '#onLoading', elWrap: '.car-builder-title, .car-builder-go, .car-builder-box'});
    }

    $(document)
        .ready(function () {});

    CarDiy();

    // 返回顶部
    GoBack.init({id: "#js-siteGoTop"});
    
});