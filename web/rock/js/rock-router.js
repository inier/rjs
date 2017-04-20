/**
 * Created by KirK-Jiang on 2015/4/14.
 */
define([
        'jquery',
        'backbone',
        'baseClient'
        //,
        //'json!data/routerConfig.json'
    ],
    function ($, Backbone, baseClient) {
        
        return Backbone.Router.extend({
            isHomeView: false,
            routes: {
                "": "home",//定义当前项目首页
                "*path(?*params)": "main"
            },

            home: function () {
                var router = this;

                this.isHomeView = true;

                require([baseClient.firstModule], function (homeView) {
                    router.changePage(new homeView(), true);
                });
            },

            main: function (path, params) {
                var router = this;
                var url = decodeURI(location.href);
                var hash = url.split("#");

                if (!this.isHomeView) {
                    this.isHomeView = true;

                    require([baseClient.firstModule], function (homeView) {
                        router.changePage(new homeView({
                            attributes: {isRenderContent: true}
                        }), true);

                        if (hash && hash.length > 0) {
                            var viewHash = hash[1].split("?");

                            require([viewHash[0]], function (view) {
                                router.changePage(new view(), false, path);
                            });
                        }
                    });
                } else {
                    if (hash && hash.length > 0) {
                        var viewHash = hash[1].split("?");

                        require([viewHash[0]], function (view) {
                            router.changePage(new view(), false, path);
                        });
                    }
                }
            },

            changePage: function (view, first, path) {

                if (first) {
                    $('body').html(view.el);
                } else {
                    var page = _.find(config, function (item, index) {
                        return item.page === path;
                    });
                    if (page) {
                        $(page.container).html(view.el);
                    } else {
                        $('body').html(view.el);
                    }
                }

                //el填充后视图show执行(业务ajax执行填充模板)
                if (view.onShow) {
                    var param = window.BackboneViewParams;
                    if (param) {
                        try {
                            view.onShow(param);
                        } catch (e) {
                            console.log(e);
                        }
                        window.BackboneViewParams = undefined;
                    } else {
                        view.onShow();
                    }
                }
            }
        });
    });