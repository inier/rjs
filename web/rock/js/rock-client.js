/**
 * Created by KirK-Jiang on 2015/4/14.
 */
define(
    [
        //"json!rock/profile/profile.json",
         "jquery", "underscore"],
    function (Profile, $, _) {
        var config = eval("(" + Profile + ")");
        var basePath = config.serverUrl;
        var firstModule = config.firstModule;
        var pageSize = config.pageSize;
        var expires = config.expires || 3600;
        var imageType = config.imageType || {};
        var pageParams = [];

        var GUID = function () {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        };

        return {
            firstModule: firstModule,// 项目首页模块
            basePath: basePath,// 后台服务器地址
            pageSize: pageSize, // 通用列表分页大小
            expires: expires,//cookie过期时间

            // 从Hash值获取参数
            request: function (paras) {
                var url = decodeURI(location.href);
                url = url.split('#');
                if (url.length > 1)
                    url = url[1];
                else
                    url = url[0];
                var paraString = url.substring(url.indexOf("?") + 1,
                    url.length).split("&");
                var returnValue;
                for (var i = 0; i < paraString.length; i++) {
                    var tempParas = paraString[i].split('=')[0];
                    var parasValue = paraString[i].split('=')[1];
                    if (tempParas === paras)
                        returnValue = parasValue;
                }

                if (typeof (returnValue) == "undefined") {
                    //return "";
                } else {
                    return returnValue;
                }
            },

            getSuitableImageUrl: function (url, type, ver) {
                if (url && type) {
                    var str = url.split('.');
                    return _.reduce(str, function (r, data, index) {
                        if (index == 0) {
                            return data;
                        }
                        else if (str.length > 1 && str.length - 1 == index) {
                            return r + (imageType[type] || "") + "." + data + (ver ? (ver) : "");
                        }
                        else {
                            return r + "." + data;
                        }
                    }, "");

                    //return url+"?size="+type;
                }
                return url;
            },

            getLoginUrlWithRedirect: function (redirect) {
                return "../login/login.html" + (redirect ? ("?redirect=" + encodeURIComponent(redirect)) : "");
            },

            //从当前url地址获取参数
            getParamByUrl: function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regexS = "[\\?&]" + name + "=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(window.location.search);
                if (results == null)
                    return "";
                else
                    return decodeURIComponent(results[1].replace(/\+/g, " "));
            },

            //获取商品分类标识
            getGoodsCaId: function () {
                var url = decodeURI(location.href);
                var sp = url.split("/");
                var file = sp[sp.length - 1];
                return file.substring(0, file.indexOf(".html"));
            },

            ajax: function (params, withoutTK, noRedict) {
                var me = this;
                var callbacks = _.pick(params, ['success', 'error', 'expire']);

                var defaults = {
                    dataType: "json",
                    timeout: 15000,
                    cache: false
                };

                // 带有默认值
                params = _.extend(defaults, params);
                if (!params.data) {
                    params.data = {};
                }

                params = _.extend(params, {
                    error: function (data) {
                        //console.log('Call API error');
                        if (callbacks.error)
                            callbacks.error(data);
                    },
                    success: function (data) {
                        //tk过期
                        if (data.result === "-1") {
                            if (noRedict) {
                                if (callbacks.expire)
                                    callbacks.expire(data);
                            } else {
                                var url = window.location.href;
                                window.location.href = "../login/login.html" + (url ? ("?redirect=" + encodeURIComponent(url)) : "");
                            }
                        } else {
                            if (callbacks.success)
                                callbacks.success(data);
                        }

                    }
                });

                if (!withoutTK) {
                    params.data['token'] = this.getCookie("token");
                }

                return $.ajax(params);
            },

            // 判断是否为空
            isNull: function (data) {
                var def = true;
                if (typeof data == "string") {
                    data = data.trim();
                }
                if ((typeof data !== "undefined" && data && data.length !== 0)
                    || typeof data === "function") {
                    def = false;
                }
                return def;
            },

            putCookie: function (key, value, expires) {
                var second = expires || 3600 * 24; // 过期时间，以秒计，默认3600*24
                var exp = new Date(); // new Date("December 31, 9998");
                exp.setTime(exp.getTime() + second * 1000);
                document.cookie = key + "=" + escape(value) + ";expires="
                    + exp.toGMTString() + ";path=/";
            },

            putSessionCookie: function (key, value) {
                document.cookie = key + "=" + escape(value) + ";path=/";
            },

            getCookie: function (key) {// 取cookies函数
                var arr = document.cookie.match(new RegExp("(^| )" + key
                    + "=([^;]*)(;|$)"));
                if (arr != null)
                    return unescape(arr[2]);
                return null;

            },

            removeCookie: function (key) {// 删除cookie
                var exp = new Date();
                exp.setTime(exp.getTime() - 3600 * 12);
                var cval = this.getCookie(key);
                if (cval != null)
                    document.cookie = key + "=" + cval + ";expires="
                        + exp.toGMTString() + ";path=/";
            },

            putPageParam: function (data) {
                var params = [];
                var strCookie = document.cookie;
                var arrCookie = strCookie.split("; "); // 将多cookie切割为多个名/值对
                for (var i = 0; i < arrCookie.length; i++) { // 遍历cookie数组，处理每个cookie对
                    var arr = arrCookie[i].split("=");
                    if (arr.length > 0 && arr[0].indexOf("page_") === 0) {
                        params.push(arr[0]);
                    }
                }
                if (params.length > 5) {
                    var me = this;
                    _.each(params, function (p) {
                        me.removeCookie(p);
                    });
                }

                var id = "page_" + GUID();
                this.putCookie(id, data, 60 * 5);
                pageParams.push(id);
                if (pageParams.length > 10) {
                    this.removeCookie(pageParams.shift());
                }
                return id;
            },

            getPageParam: function (key) {
                return this.getCookie(key);
            }
        }
    });