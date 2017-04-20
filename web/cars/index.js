/*
 * Created by KirK-Jiang on 2015/4/13.
 */
// The build will inline common dependencies into this file. For any third party
// dependencies, like jQuery, place them in the lib folder. Configure loading
// modules from the lib directory, except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: "../web/rock",
    urlArgs: "ver=20170412091648",
    paths: {
        text: 'com/requirejs-text/text',
        json: 'com/requirejs-json/json',
        css: 'com/requirejs-css/css',
        domReady: 'com/requirejs-domready/domReady',
        jquery: 'com/jquery/jquery-1.11.2.min',
        underscore: 'com/underscore/underscore-min',
        backbone: 'com/backbone/backbone',
        bootstrap: 'com/bootstrap/js/bootstrap.min',
        // lib
        baseClient: 'js/rock-client',
        rockBase: 'js/rockbase',
        siteNav: 'js/nav-main',
        topNav: 'js/nav-details',
        dialog: 'js/dialog/dialog',
        checkbox: 'js/checkbox/Checkbox',
        placeholder: 'js/placeholder/Placeholder',
        goBack: 'js/goBack/goBack'
        // jquery_plugin
    },
    waitSeconds: 0,
    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
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
    'domReady!',
    'underscore',
    'baseClient',
    'placeholder',
    'checkbox',
    'goBack',
    'dialog',
    'siteNav'
], function ($, _, domReady, BaseClient, placeholder, Checkbox, goBack, Dialog) {

    BaseClient
        .ajax({
            url: BaseClient.basePath + 'main/actives/list?channelId=mine_car_home&status=0',
            type: 'get'
        })
        .done(function (data) {
            if (data) {
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
                            href = '';
                        }
                    });
                    tDom && $("#tSlides").html(tDom);
                }
            }
        })
        .fail(function () {});

    require(['bootstrap'], function () {});

    var conData = [];

    //加载条件
    $(document).ready(function () {
        var html = "";
        BaseClient.ajax({
            // url: "../body-cars/data/condition.json",//数据源url地址
            url: BaseClient.basePath + "main/goods/buyCarCon", //数据源url地址
            data: {},
            success: function (data) {
                var dataType = [];
                if (data.result == 0) {
                    _
                        .each(data.data, function (data) {
                            html += _.template($('#cars-condtion-template').html(), data);
                            var liType = data.type;
                            dataType.push(liType);
                        });
                    $(".condition-list").html(html);
                    clickCondition(dataType);
                }
            },
            complete: function () {
                ajaxCarList(conData);
            }
        }, true);
    });
    function ajaxCarList(conData) {
        BaseClient.ajax({
            // url: "../body-cars/data/data.json",//数据源url地址
            url: BaseClient.basePath + "main/goods/buyCars", //数据源url地址
            data: {
                searches: JSON.stringify(conData),
                pageSize: 9999,
                pageIndex: 1
            },
            success: function (data) {
                var tpl = "";
                var tem = _.template($('#car-result-template').html());
                if (data.result == 0) {
                    if (data.total != 0) {
                        _
                            .each(data.data, function (item) {
                                item.ImageFun = BaseClient.getSuitableImageUrl;
                                tpl += tem(item);
                            });

                    } else {
                        tpl = $("#have-no-template").html();
                    }
                    $(".car-list .result-list").html(tpl);
                }
            }
        }, true);
    }

    //点击条件
    function clickCondition(dataType) {
        for (var i = 0; i < dataType.length; i++) {
            $(".con-li-" + dataType[i])
                .on("click", ".list-item", function (e) {
                    var curTarget = $(e.currentTarget);
                    var delTarget = $(e.delegateTarget);
                    var liId = delTarget.attr("id");
                    $("#" + liId + " .list-item").removeClass("red");
                    curTarget.addClass("red");
                    confiditionList();
                });

        }
    }
    //获取查询条件
    function confiditionList() {
        conData = [];
        var conBlue = $(".confidition-div .red");
        for (var b = 0; b < conBlue.length; b++) {
            var conDataLi = {};
            var conType = $(conBlue[b]).attr("data-type");
            var conValue = $(conBlue[b]).attr("data-value");
            if (conType && conValue) {
                conDataLi.type = conType;
                conDataLi.value = conValue;
                conData.push(conDataLi);
            }

        }
        ajaxCarList(conData);
    }

    // 返回顶部
    GoBack.init({id: "#js-siteGoTop"});

});