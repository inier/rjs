/*
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
        underscore: '../rock/com/underscore/underscore-min',
        backbone: '../rock/com/backbone/backbone',
        moment: '../rock/com/moment/moment',
                // lib
        baseClient: '../rock/js/rock-client',
        rockBase: '../rock/js/rockbase',
        dialog:'../rock/js/dialog/dialog',
        checkbox: '../rock/js/checkbox/Checkbox',
        locationSelect: '../usedCar/locationSelect',
                feedback:'../rock/js/feedback/feedback',
                placeholder: '../rock/js/placeholder/Placeholder',
        user: '../login/user',
        cartMenu: '../cartMenu/nav-cart',
                location:'../rock/js/location/Location',
                        // jquery_plugin
                pngfix: '../rock/com/jquery-pngFix/pngFix',
        flexslider: '../rock/com/jquery-FlexSlider/jquery.flexslider-min',
        pagination:'../rock/com/jquery-pagination/js/pagination',
        raty:'../rock/com/jquery-raty/jquery.raty',
        lazyload:'../rock/com/jquery-lazyload/jquery.lazyload.min',
        bootstrap:'../rock/com/bootstrap/js/bootstrap.min',
        imgReload:'../rock/js/imgReload/imgReload'
    },
    waitSeconds: 0,
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
        lazyload:['jquery'],
        underscore: {
            exports: '_'
        },
        rockBase: {
            deps: ['backbone']
        }
    }
});

require([
        'jquery',
    'lazyload',
    'domReady!',
        'location',    'cartMenu',
    'baseClient',
    'user',
    '../rock/js/page/Paging',
    'placeholder',
    '../rock/js/page/DataSource',
    'raty',
    'checkbox',
        'feedback',
            'dialog',        '../recommend/recommend',
    'underscore'
        ,'flexslider'        ,'../rock/js/nav-main'            ,'css!../rock/com/jquery-pagination/css/pagination.css'
        ,'css!../recommend/recommend.css'
        ],
function (
        $,
    lazyload,
    domReady,
        Location,    CartMenu,
    BaseClient,
    User,
    Paging,
    placeholder,
    DataSource,
    Raty,
    Checkbox,
        Feedback,
            Dialog,        Recommend,
    _
) {
            
            BaseClient.ajax({
                url: BaseClient.basePath+'main/actives/list?channelId=mine_car_home&status=0',
                type: 'get'})
                .done(function (data) {
                    if(data) {
                        if (data.result == "0") {
                            var tDom = '';
                            var href = '';
                            //渲染整图
                            _.each(data.data, function (item) {
                                if (item.img) {
                                    if (item.href) {
                                        href = 'href="' + item.href + '" target="_blank"';
                                    }
                                    tDom += '<li class="slider-item"><a class="slider-item-img"' + href + '><img src="' + item.img + '" alt="" /></a></li>';
                                    href= '';
                                }
                            });
                            tDom && $("#tSlides").html(tDom);
                        }

                        $('.flexslider', "#js-caSiteNav").flexslider({
                            animation: "fade", // slide or fade
                            keyboard: false,
                            pauseOnAction: false,
                            touch: true,
                            start: function (slider) {
                                slider.parent().removeClass('no-js');
                            }
                        });
                    }
                })
                .fail(function(){
                });
            
    require(['bootstrap'],function(){});

    
            var conData=[];

//加载条件
$(document).ready(function() {
    var html="";
    BaseClient.ajax({
        // url: "../body-cars/data/condition.json",//数据源url地址
        url: BaseClient.basePath + "main/goods/buyCarCon",//数据源url地址
        data: {
        },
        success: function (data) {
            var dataType=[];
            if (data.result == 0) {
                _.each(data.data, function (data) {
                    html += _.template($('#cars-condtion-template').html(), data);
                    var liType=data.type;
                    dataType.push(liType);
                });
                $(".condition-list").html(html);
                clickCondition(dataType);
            }
        },
        complete:function(){
            ajaxCarList(conData);
        }
    },true);
});
function ajaxCarList(conData){
    BaseClient.ajax({
        // url: "../body-cars/data/data.json",//数据源url地址
        url: BaseClient.basePath + "main/goods/buyCars",//数据源url地址
        data: {
            searches: JSON.stringify(conData),
            pageSize:9999,
            pageIndex: 1
        },
        success: function(data){
            var tpl = "";
            var tem = _.template($('#car-result-template').html());
            if (data.result == 0) {
                if (data.total != 0) {
                    _.each(data.data, function (item) {
                        item.ImageFun = BaseClient.getSuitableImageUrl;
                        tpl += tem(item);
                    });

                }
                else {
                    tpl = $("#have-no-template").html();
                }
                $(".car-list .result-list").html(tpl);
            }
        }},true);
}

//点击条件
function clickCondition(dataType){
    for(var i=0;i<dataType.length;i++)
    {
        $(".con-li-"+dataType[i]).on("click",".list-item",function(e){
            var curTarget = $(e.currentTarget);
            var delTarget = $(e.delegateTarget);
            var liId=delTarget.attr("id");
            $("#"+liId+" .list-item").removeClass("red");
            curTarget.addClass("red");
            confiditionList();
        });

    }
}
//获取查询条件
function confiditionList(){
    conData = [];
    var conBlue=$(".confidition-div .red");
    for(var b=0;b<conBlue.length;b++){
        var conDataLi={};
        var conType=$(conBlue[b]).attr("data-type");
        var conValue=$(conBlue[b]).attr("data-value");
        if(conType&&conValue){
            conDataLi.type=conType;
            conDataLi.value=conValue;
            conData.push(conDataLi);
        }

    }
    ajaxCarList(conData);
}    
    // 返回顶部-预约试驾等悬浮板块
            // 在线客服跳转处理
        function live800UrlInitS(el){
            var tToken = BaseClient.getCookie("token");
            var tUrl = $(el).attr("href");
            BaseClient.putCookie("live800Url0", tUrl);
            if(!tToken){
                BaseClient.putCookie("live800UrlChange", 0);
            }else{
                BaseClient.ajax({
                    //url: "../rock/live800.json",//数据源url地址
                    url: BaseClient.basePath + "member/webOnline/live800Para",//数据源url地址
                    type: 'get',
                    data: {
                        token: tToken
                    },
                    success: function (data) {
                        if (data.result == 0) {
                            tUrl += "&"+data.data;
                            $(el).attr("href",tUrl);
                            BaseClient.putCookie("live800Url1", tUrl);
                            BaseClient.putCookie("live800UrlChange", 1);
                        }
                    }
                },true);
            }
        }
        function live800UrlUpdateS(el){
            var tFlag = BaseClient.getCookie("live800UrlChange");
            var tToken = BaseClient.getCookie("token");
            var tUrl = BaseClient.getCookie("live800Url0");
            if(tToken){
                if(tFlag == 0){
                    BaseClient.ajax({
                        //url: "../rock/live800.json",//数据源url地址
                        url: BaseClient.basePath + "member/webOnline/live800Para",//数据源url地址
                        type: 'get',
                        data: {
                            token: tToken
                        },
                        success: function (data) {
                            if (data.result == 0) {
                                tUrl += "&"+data.data;
                                BaseClient.putCookie("live800Url1", tUrl);
                                BaseClient.putCookie("live800UrlChange", 1);
                            }
                        }
                    },true);
                }else if(tFlag == 1){
                    tUrl = BaseClient.getCookie("live800Url1");
                }
            }

            $(el).attr("href",tUrl);
                // .off("click").trigger("click");
        }

        // live800初始化
        // live800UrlInitS("#js-live800Side");
        //
        // $("#js-live800Side").on("click", function(e){
        //     // e.stopPropagation();
        //     // e.preventDefault();
        //     live800UrlUpdateS("#js-live800Side");
        // });
        
        // 意见反馈
        $("#js-feedback").on("click", function(){
            Feedback.showFeedback();
        });

        // 返回顶部
        (function(el){
            el = $(el);
            var documentEl = $(document),
                windowObj = $(window),
                isShow = false;

            function doScroll(){
                var pos = windowObj.innerHeight();
                if (documentEl.scrollTop() >= pos) {
                    if(!isShow){
                        el.animate({"height": "50px"}, 300);
                        console.log("show");
                        isShow = true;
                    }
                } else {
                    if(isShow) {
                        el.animate({"height": "0"}, 300);
                        console.log("hide");
                        isShow = false;
                    }
                }
            }

            doScroll();
            windowObj.on("scroll", doScroll);

            // 滚动到指定元素的id处
            el.on("click", function () {
                $("html, body").animate({
                    scrollTop: 0  //在指定方向上的边界值
                }, 600);  //控制滚动的速度, 默认500ms
                return false;
            });
        })("#js-siteGoTop");

    
    CartMenu.reload();

    $(".nav-brand-search a").on('click',function(){
        this.href = "../search/index.html?search="+encodeURI($(".nav-brand-search input").val());
    });

    $(".nav-brand-search input").on('keyup',function(e) {
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            var btn = $(".nav-brand-search a")[0];
            btn.href = "../search/index.html?search="+encodeURI($(".nav-brand-search input").val());
            btn.click();
        }
    });
});