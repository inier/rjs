define([
    'jquery',
    'baseClient',
    'rockBase',
    'text!../cars/index.html',
    'dialog',
    'goBack',
    '../cacf/cacf-client'
], function ($, BaseClient, RockBase, Tpl, Dialog, GoBack, Client) {
    var animateState = 0; //是否切换到下一张缩略图，0表示切换，1表示不切换。     动画正在进行时不切换
    var reviewAjaxFlag = 0; //是否加载过参与记录的标志，加载过为1 ，否则为0
    var timer, //秒杀或者限购的定时器
        nowTime, //系统时间
        theStartTime, //开始时间
        theEndTime, //结束时间
        theOpenTime; //开奖时间
    var refreshData = {
        "lastState": 'start', //上一次的状态值
        "refreshCount": 3, //状态切换失败刷新次数
        "refreshTime": 3000, //状态切换失败重刷时间
        "nowRefreshCount": 0
    };

    var luckyNum = {}; //用户众筹信息

    var stockOnHand = {}; //当前众筹商品的库存
    var allKeys = ''; //页面中的型号选择的data-key
    var manager = ''; //初始化goodsmanager
    var theSkuData = ''; //页面中的型号尺码等数据
    var dataName = '';

    //计算倒计时的时间，并显示
    function countTime(type) {
        //判断当前时间 与  开始时间
        var judgeTime,
            data,
            showPlace;
        //计算显示倒计时
        switch (type) {
            case 'notStart':
                data = getTimeString(nowTime, theStartTime);
                showPlace = $('.activity').find('.leave-time');
                judgeTime = theStartTime;
                break;
            case 'now':
                data = getTimeString(nowTime, theEndTime);
                showPlace = $('.activity').find('.leave-time');
                judgeTime = theEndTime;
                break;
            case 'waitOpen':
                data = getTimeString(nowTime, theOpenTime);
                showPlace = $('.message-info .info');
                judgeTime = theOpenTime;
                break;
        }
        if (nowTime < judgeTime) {
            //当时时间小于购买开始时间

            showPlace.text(data.showTime);
            if (!timer) {
                timer = setInterval(function () {
                    countTime(type)
                }, 1000);
            }
            nowTime++;
        } else {
            //当前时间大于开始时间
            showPlace.text('0天0小时0分0秒');
            //清除定时器
            clearInterval(timer);
            timer = null;

            //重新请求页面的数据
            showAllPageData();
        }
    }

    //计算倒计时显示的字符串
    function getTimeString(nowTime, time) {
        var showTime;
        var leave = time - nowTime;
        var day = Math.floor(leave / (60 * 60 * 24));
        var hour = Math.floor(leave / 3600) - (day * 24);
        var minute = Math.floor(leave / 60) - (day * 24 * 60) - (hour * 60);
        var second = Math.floor(leave) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (day) {
            showTime = day + '天';
        } else {
            showTime = '0天';
        }
        if (hour) {
            showTime += hour + '小时';
        } else {
            showTime += '0小时';
        }
        if (minute) {
            showTime += minute + '分';
        } else {
            showTime += '0分';
        }
        if (second) {
            showTime += second + '秒';
        } else {
            showTime += '0秒';
        }
        var data = {};
        data.leave = leave;
        data.showTime = showTime;
        return data;
    }

    //显示用户信息的弹框对象
    function userLuckyNumDialog() {
        var el, //弹出窗口
            pageIndex,
            nowCount,
            total;

        //初始化窗口
        function init(ev, data) {
            $('.user-lucky-num').unbind();
            pageIndex = 2;
            nowCount = 72;
            total = data.partedNum;
            var ele = $('#cacfUserLuckyNum'),
                target = $(ev.currentTarget),
                container = target.parent();

            if (ele.length)
                ele.remove();

            var tpl = _.template($('#user-detail-template').html())({ data: data });
            container.append(tpl);
            el = $('#cacfUserLuckyNum');

            //给用户幸运号码区域绑定滚动事件
            $('.user-lucky-num').scroll(function () {
                var node = $('.user-lucky-num');
                if ((node.height() + node.scrollTop()) == $('.user-lucky-num-list').height()) {
                    showMoreRecord();
                }
            });
        }

        function showMoreRecord() {
            if (nowCount < total) {
                var orderId = $('.user-lucky-num').attr('data-id');
                pageIndex++;
                Client.getMoreRecord({
                    pageSize: 36,
                    pageIndex: pageIndex,
                    orderId: orderId,
                    beforeSend: function () { },
                    success: function (data) {
                        if (data.result == 0) {
                            var newRecord = '';
                            nowCount += 36;
                            total = data.total;
                            _.each(data.data.luckyNumber, function (item) {
                                if (item.length < 7) {
                                    newRecord += '<span>' + item + '</span>'
                                } else {
                                    newRecord += '<span class="long-lucky-num">' + item + '</span>'
                                }
                            });
                            $('.user-lucky-num-list').append(newRecord);
                        }
                    },
                    error: function (error) { }
                });
            }
        }

        function hide() {
            el.remove();
        }

        return {
            show: function (ev, data) {
                return init(ev, data);
            },
            hide: function () {
                return hide();
            }
        }
    }

    function showAllPageData() {

        Client.getAllData({
            productId: BaseClient.getGoodsCaId(),
            // productId: "11365",
            token: BaseClient.getCookie('token'),
            beforeSend: function () { },
            success: function (data) {
                //ajax返回成功
                if (data.result == 0) {

                    // 商品是否下架。显示对应的展示区域
                    if (data.data.isOnSale == 'Y') {
                        // 商品已经上架-->显示正常的页面（上架状态）
                        /**
                             * yjh 2017.3.20,fix IE new Date()bug
                             * time.replace(/-/g, "/")
                             */
                        theStartTime = (+ new Date(data.data.startTime.replace(/-/g, "/"))) / 1000;
                        theEndTime = (+ new Date(data.data.endTime.replace(/-/g, "/"))) / 1000;
                        theOpenTime = (+ new Date(data.data.openTime.replace(/-/g, "/"))) / 1000;
                        nowTime = (+ new Date(data.data.sysTime.replace(/-/g, "/"))) / 1000;

                        //计算当前商品每个sku对应的库存
                        _.each(data.data.sku, function (sku) {
                            stockOnHand[sku.skuId] = Math.floor(data.data.remainNum / sku.copies);
                        });

                        theSkuData = $('.data').text();
                        dataName = {};
                        try {
                            dataName = eval("(" + $(' .dataName').text() + ")");
                        } catch (e) { }

                        manager = new GoodsManager(theSkuData, BaseClient.getGoodsCaId(), stockOnHand);
                        allKeys = manager.getGoodsKeys();

                        //进入页面时获取商品价格显示最小值 商品已下架的时候不获取价格
                        if (!($('#unable').length > 0)) {
                            var price = manager.getGoodsPrice({});
                            if (price.length > 1 && price[1] && (price[0] != price[1])) {
                                $(".put-price").html(price[0].toFixed(2) + '-&nbsp;<span class="sign">￥</span>' + price[1].toFixed(2));
                            } else {
                                $(".put-price").text(manager.getGoodsPrice({})[0].toFixed(2));
                            }
                        }

                        //当前状态为正在进行中的时候，添加用于购买的class:buy-now
                        if (data.data.state == '1') {
                            if (!$('.activity .all-btn a').hasClass('buy-now')) {
                                $('.activity .all-btn a').addClass('buy-now');
                            }
                        }

                        // manager.getStockBySetting(getSetting(data));

                        (function (stock) {

                            var inventoryCount = _.reduce(manager.getGoodsId(getSetting(theSkuData)), function (result, sku) {
                                if (stock && _.has(stock, sku)) {
                                    result += stock[sku];
                                }
                                return result;
                            }, 0);

                            if (inventoryCount > 0) {

                                $('.buy-now').removeClass('disabled');
                            } else {
                                $('.buy-now').addClass('disabled');
                            }

                            //默认选中只有一个配置项的类型
                            _
                                .each(allKeys, function (k) {
                                    var cs = $(document.body).find("[data-key='" + k + "']");
                                    if (cs && cs.length == 1) {
                                        $(cs[0]).trigger("click");
                                    }
                                });

                            //零库存sku属性默认置灰
                            var myData = eval("(" + theSkuData + ")");
                            var none_skus = _.reduce(myData, function (result, sku) {
                                if (stock && _.has(stock, sku.goodsId) && stock[sku.goodsId] == 0) {
                                    result.push(sku);
                                }
                                return result;
                            }, []);

                            if (none_skus && none_skus.length > 0) {
                                for (var n = 0; n < none_skus.length; n++) {
                                    _
                                        .each(_.keys(none_skus[n]), function (k) {
                                            if (k != "price" && k != "goodsId") {
                                                var d = {};
                                                var v = none_skus[n][k];
                                                d[k] = v;
                                                if (_.where(none_skus, d).length == _.where(myData, d).length) {
                                                    $(document.body)
                                                        .find("[data-key='" + k + "']")
                                                        .each(function (index, el) {
                                                            if ($(el).attr('data-value') == v) {
                                                                if ($(el).hasClass("option-active")) {
                                                                    $(el).removeClass("option-active");
                                                                }
                                                                $(el).addClass("disabled");
                                                                $(el).addClass("nostock");
                                                            }
                                                        });
                                                }
                                            }
                                        });
                                }
                            }
                        })(stockOnHand);

                        if (refreshData.lastState != data.data.state) {
                            refreshData.lastState = data.data.state;
                            refreshData.nowRefreshCount = 0;

                            //根据状态显示页面对应的内容
                            switch (data.data.state) {
                                case '0':
                                    //活动未开始,并且活动可能存在问题
                                    showActivityNotStart(data.data);
                                    break;
                                case '5':
                                    //活动未开始，活动完全正确，等待开始
                                    showActivityNotStart(data.data);
                                    break;
                                case '1':
                                    //活动正在进行中
                                    showActivityNow(data.data);
                                    break;
                                case '2': //活动待揭晓
                                case '6': //活动延迟揭晓
                                    showActivityWaitOpen(data.data);
                                    break;
                                case '3':
                                    //活动已揭晓
                                    showActivityHasOpen(data.data);
                                    break;
                                case '4':
                                    //活动失败
                                    showActivityDie(data.data);
                                    break;
                            }
                        } else {
                            refreshDataAgain();
                        }
                    } else {
                        // 商品已经下架-->显示下架状态
                        showActivityUnableBuy();
                    }
                } else {
                    showMsg({ code: data.result });
                }
            },
            error: function (error) { }
        });
    }

    function showActivityNotStart(data) {

        $('.activity-writing').hide();
        $('.activity-die').hide();
        $('.unable-buy').hide();

        $('.activity .all-btn a')
            .addClass('disabled')
            .removeClass('buy-now');
        $('.activity')
            .show()
            .removeClass('hide');

        $('#cacf .loading').remove();

        var el = $('.activity');

        //活动人次的显示
        var speedNodes = el.find('.cf-pro .personCount');
        $(speedNodes[0]).text(0);
        $(speedNodes[1]).text(data.allPartNum);
        $(speedNodes[2]).text(data.allPartNum);
        $('.progress-speed').text('0%');

        //显示时间
        el
            .find('.time-describe')
            .text('开始时间：');
        // el.find('.leave-time').text(data.startTime);
        countTime('notStart');
    }

    function showActivityNow(data) {

        if (!$('.activity .all-btn a').hasClass('buy-now')) {
            $('.activity .all-btn a').addClass('buy-now');
        }
        $('.activity')
            .show()
            .removeClass('hide');
        $('.activity-writing').hide();
        $('.activity-die').hide();
        $('.unable-buy').hide();

        $('#cacf .loading').remove();

        var el = $('.activity');

        //幸福抽奖区域信息显示 活动众筹进度显示
        var percent = data.partedNum / data.allPartNum;
        var showPercent = percent;
        if (percent < 0.05 && percent != 0) {
            percent = 0.05;
        } else if (percent > 0.99 && percent != 1) {
            percent = 0.99;
        }
        percent = Number(percent).toFixed(2);
        if (showPercent == 0) {
            showPercent = 0;
        } else if (showPercent < 0.01) {
            showPercent = 1;
        } else if (showPercent == 1) {
            showPercent = 100;
        } else {
            showPercent = Number(showPercent) * 100;
            showPercent = Math.floor(showPercent);
        }
        el
            .find('.progress-bar')
            .css('width', percent * 100 + '%');
        el
            .find('.progress-speed')
            .text(showPercent + '%');
        //距离结束时间倒计时
        el
            .find('.time-describe')
            .text('距离结束时间：');
        countTime('now');

        //活动人次的显示
        var speedNodes = el.find('.cf-pro .personCount');
        $(speedNodes[0]).text(data.partedNum);
        $(speedNodes[1]).text(data.allPartNum);
        if (data.remainNum < 0) {
            $(speedNodes[2]).text('0');
        } else {
            $(speedNodes[2]).text(data.remainNum);
        }
    }

    function showActivityWaitOpen(data) {
        var me = this;

        $('.activity').hide();
        $('.activity-writing')
            .show()
            .removeClass('hide');
        $('.activity-die').hide();
        $('.unable-buy').hide();
        $('.lucky-user').hide();

        $('#cacf .loading').remove();

        /**
             * yjh 2017.3.20 新增延迟揭晓
             */
        var messageInfoDom = $('.message-info');
        if (data.state == '6') {
            $('.message-describe').remove();
            messageInfoDom.addClass('wait');
            messageInfoDom
                .find('img')
                .remove();
            messageInfoDom
                .find('.info')
                .text('中奖号码生成中，请稍等。');
        } else {
            //显示揭晓时间
            countTime('waitOpen');
            //中奖规则显示
            $('.message-describe').text('活动成功，距揭晓还剩');
        }

        /**
             * yjh 2017.3.21
             * 无中奖规则时,不显示
             */
        if (data.calculationRules) {
            $('.rule-content').text(data.calculationRules);
        } else {
            $('.rule-content')
                .parent()
                .hide();
        }

        if (data.orderId) {
            $('.link-my-record').css('display', 'block');
            $('.link-my-record').attr('href', '../person-center/entrance.html#crowdDetail?id=' + data.orderId);
        }
    }

    function showActivityHasOpen(data) {

        $('.activity').hide();
        $('.activity-writing')
            .show()
            .removeClass('hide');
        $('.activity-die').hide();
        $('.unable-buy').hide();

        $('#cacf .loading').remove();

        //中奖规则显示
        $('.message-describe').text('幸运号码');
        $('.message-info img').remove();
        $('.message-info .info').text(data.winNumber);
        /**
             * yjh 2017.3.21
             * 无中奖规则时,不显示
             */
        if (data.calculationRules) {
            $('.rule-content').text(data.calculationRules);
        } else {
            $('.rule-content')
                .parent()
                .hide();
        }

        if (data.orderId) {
            $('.link-my-record').css('display', 'block');
            $('.link-my-record').attr('href', '../person-center/entrance.html#crowdDetail?id=' + data.orderId);
        }

        $('.lucky-user').show();
        var info = $('.lucky-user-info .info');
        if (data.user.img) {
            $('.lucky-user-img img').attr('src', BaseClient.basePath + 'goods-img/img' + data.user.img);
        } else {
            $('.lucky-user-img img').attr('src', '../rock/img/default-head.png');
        }
        if (data.user.nickName)
            $(info[0]).text(data.user.nickName);
        if (data.openTime)
            $(info[1]).text(data.openTime);
        if (data.user.partCopies)
            $(info[2]).text(data.user.partCopies + '人次');
        if (data.user.buyTime)
            $(info[3]).text(data.user.buyTime);

    }

    function showActivityDie(data) {

        $('.activity').hide();
        $('.activity-writing').hide();
        $('.activity-die')
            .show()
            .removeClass('hide');
        $('.unable-buy').hide();

        $('#cacf .loading').remove();

        var el = $('.activity-die');

        //幸福抽奖区域信息显示 活动众筹进度显示
        var percent = data.partedNum / data.allPartNum;
        var showPercent = percent;
        if (percent < 0.05 && percent != 0) {
            percent = 0.05;
        } else if (percent > 0.99 && percent != 1) {
            percent = 0.99;
        }
        percent = Number(percent).toFixed(2);
        if (showPercent == 0) {
            showPercent = 0;
        } else if (showPercent < 0.01) {
            showPercent = 1;
        } else if (showPercent == 1) {
            showPercent = 100;
        } else {
            showPercent = Number(showPercent) * 100;
            showPercent = Math.floor(showPercent);
        }
        el
            .find('.progress-bar')
            .css('width', percent * 100 + '%');
        el
            .find('.progress-speed')
            .text(showPercent + '%');
        //距离结束时间倒计时
        el
            .find('.time-describe')
            .text('距离结束：');
        el
            .find('.leave-time')
            .text('已过期');

        el
            .find('.die-tip span')
            .text(data.productName);

        //活动人次的显示
        var speedNodes = el.find('.cf-pro .personCount');
        $(speedNodes[0]).text(data.partedNum);
        $(speedNodes[1]).text(data.allPartNum);
        if (data.remainNum && data.remainNum < 0) {
            $(speedNodes[2]).text('0');
        } else {
            $(speedNodes[2]).text(data.remainNum);
        }
    }

    function showActivityUnableBuy() {
        $('.activity').hide();
        $('.activity-writing').hide();
        $('.activity-die').hide();
        $('.unable-buy')
            .show()
            .removeClass('hide');

        $('#cacf .loading').remove();
    }

    //页面状态更新重新
    function refreshDataAgain() {
        if (refreshData.refreshCount > refreshData.nowRefreshCount) {
            setTimeout(function () {
                var me = this;
                showAllPageData();
                refreshData.nowRefreshCount++;
            }, refreshData.refreshTime);
        }
    }

    //页面中的提示信息（弹出层） msg是字符串
    function showMsg(option) {
        /*
             * option = {
             *   mag: string,    //用户提示的信息的
             *   code: string    //接口返回码
             * }
             * */
        var msg,
            errorCode = {
                //去支付接口
                '4000': '对不起，您还不能购买', //该用户没有中奖
                '1001': '商品无效', //商品无效
                '1002': '请重新填写商品数量', //购买数量不对
                '1006': '请选择其他经销商', //无效经销商
                '1007': '提车人信息无效', //无效提车人
                '1012': '请使用有效的地址', //无效地址
                '1024': '选配包配置有误，请重新选配', //无效选配包
                '1029': '该商品库存不足', //库存不足
                '1045': '您的购买数量已超过最大可购买数量，请修改商品数量', //超过购买限制
                '1046': '秒杀活动还未开始哦', //秒杀时间未到
                '1047': '众筹活动还未开始哦', //众筹时间未到
                '1048': '众筹活动已经结束了哦', //众筹已结束
                '3006': '您地址的数量已经达到上限，添加新地址失败', //地址数量已达上限
                '3021': '该优惠券已不能使用，请重试', //优惠券已经使用
                //商品详情接口
                '1030': '该商品不存在哦，请浏览其他商品', //查询商品不存在
                //其他
                '9999': '网络开小差了,请稍后再试哦', //系统异常
                '2010': '网络开小差了,请稍后再试哦', //参数异常
                '-1': '登陆信息已过期，请重新登陆' //token过期
            };

        if (!option.msg) {
            msg = "网络开小差了，请稍后再试。"
        } else {
            msg = option.msg;
        }

        if (option.code && errorCode[option.code]) {
            msg = errorCode[option.code];
        }
        /*$(".modal-body h4").text(msg);
             $('#myModal').modal();*/
        var dialog = Dialog.createDialog({
            icon: 'tip',
            content: msg,
            buttons: [
                {
                    name: '确定',
                    callback: function () {
                        dialog.hide();
                    },
                    className: 'btn-reverse'
                }
            ]
        });
    }

    //通过页面获取当前配置数据集合
    function getSetting(data) {
        var me = this;
        var result = {};
        if (data) {
            _
                .each(allKeys, function (key) {
                    if (key != "GoodsId") {
                        $(document.body)
                            .find("[data-key='" + key + "']")
                            .each(function (i, el) {
                                if ($(el).hasClass('option-active')) {
                                    result[key] = $(el).attr('data-value');
                                    return false;
                                }
                            });
                    }
                });
        }
        return result;
    }

    return RockBase
        .View
        .extend({
            id: "cacf", goodsId: "", //用户选中的商品id
            events: {},
            render: function () { },
            onShow: function () {
                var me = this;
                // var r = new Recommend('.recommend', 6, false, true);
                // r.render();
                // Cart.reload();
                $('#cacf').unbind();
                me.doInit(); //执行页面中的js

                //注册滚轮事件
                if (document.addEventListener) {
                    document.addEventListener('DOMMouseScroll', me.scrollFunc.bind(me), false);
                } //W3C/FireFox
                window.onmousewheel = document.onmousewheel = me
                    .scrollFunc
                    .bind(me); //IE/Opera/Chrome/Safari
                //拖动滚动条事件
                $(window).scroll(me.scrollFunc.bind(me));

                //进入页面时就执行
                me.token = BaseClient.getCookie('token');
                //获取页面信息---商品详情
                showAllPageData();

                //判断用户位于页面的位置，判断页面内的content-nav是需要置顶，参与记录是否需要立即加载
                me.scrollFunc();

                //进入页面时提交用户数据
                me.submitUserData();

                //获取商品图片属性
                me.getOptionImg();

                //进入页面时，获取商品库存 me.getGoodsInventory(); 获取用户ip
                me.getUserIP();

                // 返回顶部
                GoBack.init({ id: "#js-siteGoTop" });
            },

            doInit: function () {
                var me = this;

                //点击顶部左侧商品详情的缩略图显示相应的商品图片
                $('.parts-show').on("click", ".choose-img-little", function (event) {
                    var e = event || window.event;
                    $(".choose-img-little").removeClass("show-active show-slide");
                    var $theNode = $(e.currentTarget);
                    $theNode.addClass("show-active show-slide");
                    var img = $theNode.attr("data-img");
                    $(".detail-img")
                        .find("img")
                        .attr("src", img);
                    return false;
                });

                //点击缩略图的前后的箭头实现交互效果
                $('.parts-show').on("click", ".last", function () {
                    //动画正在切换时，不进行操作
                    if (animateState == 1) {
                        return false;
                    }
                    var view = $('.carousel .view');
                    var hide;
                    if ($(view[0]).prev().length == 0) {
                        $('.last').css('visibility', 'hidden');
                        return false;
                    }
                    if ($('.next').css('visibility') == "hidden") {
                        $('.next').css("visibility", "visible");
                    }
                    $(view[4]).removeClass("view");
                    $(view[0])
                        .prev()
                        .addClass("view");
                    if ($($('.carousel .view')[0]).prev().length == 0) {
                        hide = true;
                    }
                    var nowLeft = $('.carousel-content').css('margin-left');
                    nowLeft = nowLeft.substr(0, nowLeft.length - 2);
                    var newLeft = parseInt(nowLeft) + 80 + "px";
                    animateState = 1;
                    $(".carousel-content").animate({
                        marginLeft: newLeft
                    }, function () {
                        animateState = 0;
                    });
                    if (hide) {
                        $('.last').css('visibility', 'hidden');
                    }

                });
                //点击缩略图的前后的箭头实现交互效果
                $('.parts-show').on("click", ".next", function () {
                    //动画正在切换时，不进行操作
                    if (animateState == 1) {
                        return false;
                    }
                    var view = $('.carousel .view');
                    var hide;
                    if ($(view[4]).next().length == 0) {
                        $('.next').css("visibility", "hidden");
                        return false;
                    }
                    if ($('.last').css('visibility') == "hidden") {
                        $('.last').css('visibility', 'visible');
                    }
                    $(view[0]).removeClass("view");
                    $(view[4])
                        .next()
                        .addClass("view");
                    if ($($('.carousel .view')[4]).next().length == 0) {
                        hide = true;
                    }
                    var nowLeft = $('.carousel-content').css('margin-left');
                    nowLeft = nowLeft.substr(0, nowLeft.length - 2);
                    var newLeft = nowLeft - 80 + "px";
                    animateState = 1;
                    $(".carousel-content").animate({
                        marginLeft: newLeft
                    }, function () {
                        animateState = 0;
                    });
                    if (hide) {
                        $('.next').css('visibility', 'hidden');
                    }

                });

                //选择配件的型号
                var chooseOption = function (event) {
                    var e = event || window.event;
                    var $theNode = $(e.currentTarget);
                    var key = $theNode.attr("data-key");
                    var value = $theNode.attr("data-value");
                    //用户所点击的项是否是可选的，可选的才能进行后面的操作
                    if (!$theNode.hasClass("disabled")) {
                        var isSelfCancel = false;
                        if ($theNode.hasClass("option-active")) {
                            $theNode.removeClass("option-active");
                            isSelfCancel = true;

                            $('.choose-img-little.show-slide').click();
                        } else {
                            $("[data-key=" + key + "]").removeClass("option-active");
                            $theNode.addClass("option-active");

                            //商品换图
                            if (me.optionImg && !$.isEmptyObject(me.optionImg)) {
                                me.changeImgShow(value);
                            }
                        }

                        //获取当前设置集合
                        var setting = getSetting(theSkuData);
                        //console.log("setting:"); console.log(setting); 零库存关系集合
                        var stock = manager.getOutStockBySetting(setting);
                        //console.log("stock:"); console.log(stock);

                        var do_btn_filter = function (k) {
                            //获取当前key允许值集合
                            var values = manager.getGoodsAttrs(k, setting);
                            //console.log('rel:'); console.log(values); 遍历当前key的所有值集合
                            $(document.body)
                                .find("[data-key='" + k + "']")
                                .each(function (index, el) {
                                    //当前遍历项值
                                    var v = $(el).attr('data-value');
                                    //当前值可使用
                                    if (_.indexOf(values, v) > -1) {
                                        //零库存命中
                                        if (_.has(stock, k) && _.contains(stock[k], v)) {
                                            if ($(el).hasClass("option-active")) {
                                                $(el).removeClass("option-active");
                                            }
                                            $(el).addClass("disabled");
                                        } else {
                                            if (!$(el).hasClass("nostock"))
                                                $(el).removeClass("disabled");
                                            //当前值不可用
                                        }

                                    } else {
                                        //当前值已选中
                                        if ($(el).hasClass("option-active")) {
                                            $(el).removeClass("option-active");
                                        }
                                        $(el).addClass("disabled");
                                    }
                                });
                        };

                        //依赖关系验证 遍历所有key
                        _.each(allKeys, function (k) {
                            //不是当前key的才验证依赖关系,el为需要验证的key
                            if (k != "goodsId" && k != "images" && k != "price") {
                                //获取当前设置集合 setting = getSetting(theSkuData);
                                if (isSelfCancel) {
                                    do_btn_filter(k);
                                } else if (key != k) {
                                    do_btn_filter(k);
                                }
                            }
                        });

                        //显示库存
                        var inventoryCount = manager.getStockBySetting(getSetting(theSkuData));
                        if (!(inventoryCount > 0)) {
                            $('.buy-now').addClass('disabled');
                        } else {
                            $('.buy-now').removeClass('disabled');
                        }

                        //获取产品价格并显示
                        me.showPrice();

                        //将商品的id存放在goodsId中
                        me.goodsId = manager.getGoodsId(getSetting(theSkuData));

                    }

                };

                $('.parts-price').on("click", ".option", function (event) {
                    chooseOption(event);
                });

                $('.parts-price').on("click", ".option-pic", function (event) {
                    chooseOption(event);
                });

                // 显示config部分的tips
                $(".option-pic").popover({
                    trigger: 'hover',
                    placement: 'top',
                    delay: {
                        show: 100,
                        hide: 150
                    }
                });

                var unfinishedAction = function (setting) {
                    var txt = '';
                    _.each(_.values(_.omit(dataName, _.keys(setting))), function (t, index, list) {
                        txt += t + (index == list.length - 1
                            ? ""
                            : "、");
                    });

                    $(".modal-body h4").text("请选择" + txt);
                    $('#myModal').modal();
                };

                var buyNow = function () {
                    if ($(".buy-now").hasClass('disabled')) {
                        return false;
                    }
                    //将商品的id存放在goodsId中
                    var setting = getSetting(theSkuData);
                    me.goodsId = manager.getGoodsId(setting);
                    if (allKeys.length - 2 == _.keys(setting).length && me.goodsId.length == 1) {
                        //取消滚轮事件的绑定
                        $(window).unbind("scroll");
                        //跳转到确认订单
                        var count = $('.buy-count').val();
                        count = parseInt(count);
                        //                        var goodsId = me.goodsId[0];
                        var goodsId = me.goodsId[0];
                        //通过接口提交订单
                        me.confirmOrder(goodsId);
                    } else {
                        unfinishedAction(setting);
                    }
                };

                //点击立即购买
                $('.parts-price').on("click", ".buy-now", buyNow);

                if ($('#car #goodsStatus').val() == '0') {
                    $('.confirm-order-header').unbind('click');
                } else {
                    $('.confirm-order-header')
                        .unbind('click')
                        .bind("click", buyNow);
                }

                //点击导航条以后的动作
                function barChange(e) {
                    //找到点击的元素，修改活动元素的样式
                    var el = e.currentTarget;
                    $("#content-nav div").removeClass("nav-active");
                    var goHere = $(el)
                        .attr("class")
                        .substr(6);
                    $(el).addClass("nav-active");

                    //使相应区域的元素显示在页面上
                    var offset = $("." + goHere)
                        .offset()
                        .top;
                    // document.documentElement.scrollTop = offset - 55; document.body.scrollTop =
                    // offset - 55;                    if ($("body").scrollTop()) {
                    $("html,body").animate({
                        scrollTop: offset - 55
                    }, 1000);
                    //                    }
                    return false;
                }

                var fn = function (e) {
                    barChange(e)
                };
                var th = _.throttle(fn, 1000);

                //点击页面内部导航栏
                $('#cacf').on("click", "#content-nav [data-nav='true']", th);

                //初始化用户luckyNum弹出框
                var pop = new userLuckyNumDialog;

                //点击查看众筹码 弹出对话框
                $('#cacf').on('click', '.see-detail', function (ev) {
                    var event = ev || window.event,
                        id = $(event.currentTarget).attr('data-id');

                    pop.show(event, luckyNum[id]);

                    $('.see-detail.active').removeClass('active');
                    $(event.currentTarget).addClass('active');

                });
                //关闭对话框
                $('#cacf').on('click', '#cacfUserLuckyNum .close', function () {
                    pop.hide();

                    $('.see-detail.active').removeClass('active');
                });
            },

            //判断特定元素在平面中的位置，做相应的处理 触发的事件的鼠标滚轮滑动和拖动页面右侧的滚动条，进入页面的时候
            scrollFunc: function () {
                var me = this;

                var pos = $(window).innerHeight();

                //减去滚动条的高度
                var sTop = document.body.scrollTop || document.documentElement.scrollTop;

                var dTop = $(".detail")
                    .offset()
                    .top;
                // var pTop = $(".param").offset().top;
                var eTop = $(".evaluation")
                    .offset()
                    .top;

                //判断是否显示会到顶部按钮
                if (sTop >= pos) {
                    $(".go-top").fadeIn(200);
                } else {
                    $(".go-top").fadeOut(200);
                }

                //获取详情图片的div距离浏览器顶部的距离 获取详情图片的div距离页面顶部的距离
                var theDistance = dTop - sTop;
                //            console.log(theDistance); 根据div相对于浏览的顶部的位置，通过改变class实现div的状态改变
                var theClass = $("#content-nav").attr("class");
                if (theDistance < 60) {
                    if (theClass == "content-nav") {
                        $("#content-nav").attr("class", "content-nav-fixed");
                        $(".blank").css("display", "block");
                        $("#content-nav div").removeClass("nav-active");
                        $(".parts-detail").addClass("nav-active");
                    }
                } else if (theDistance >= -60) {
                    if (theClass == "content-nav-fixed") {
                        $("#content-nav").attr("class", "content-nav");
                        $(".blank").css("display", "none");
                        $("#content-nav div").removeClass("nav-active");
                    }
                }

                //参与记录的div距离浏览器顶部的距离
                var etheDistance = eTop - sTop;
                var eHeight = $(".evaluation").height();
                //                console.log(dtheDistance);
                if (etheDistance < 61) {
                    $("#content-nav div").removeClass("nav-active");
                    $(".parts-evaluation").addClass("nav-active");
                } else {
                    $("#content-nav div").removeClass("nav-active");
                    $(".parts-detail").addClass("nav-active");
                }
                if (etheDistance + eHeight + 135 + 105 + 20 <= $(window).height()) {
                    $("#content-nav div").removeClass("nav-active");
                    $(".parts-evaluation").addClass("nav-active");
                }

                //当评价晒单从底部出现的时候开始加载下面的评论
                function reviewAjaxFunc() {
                    // me._initParticipationRecord();
                    reviewAjaxFlag = 1;
                }

                //当用户没有加载过商品评论区域的内容时调用函数加载内容，即reviewAjaxFlag为0时
                if (reviewAjaxFlag == 0) {
                    //判断商品评论的div是否出现在页面中，如果出现在可视区域中开始加载评论的内容
                    var theReviewTop = $(".evaluation")
                        .offset()
                        .top;
                    var theReview = theReviewTop - sTop;
                    //屏幕可视区高度
                    var viewHeight = document.documentElement.clientHeight;
                    //console.log(theReview - viewHeight);
                    if ((theReview - viewHeight) < -20) {
                        reviewAjaxFunc();
                    }
                }

            },

            //显示页面上的价格
            showPrice: function () {
                var me = this;

                var setting = getSetting(theSkuData);
                var price = manager.getGoodsPrice(setting);
                if (price.length == 2) {
                    if (price[0] != price[1]) {
                        $(".put-price").html(price[0].toFixed(2) + '-&nbsp;<span class="sign">￥</span>' + price[1].toFixed(2));
                    } else {
                        $(".put-price").text(price[0].toFixed(2));
                    }
                } else if (price.length == 1) {
                    $(".put-price").text(price[0].toFixed(2));
                }
            },

            //进入页面的时候提交用户浏览的数据
            submitUserData: function () {
                var me = this;
                // var token = BaseClient.getCookie('token');
                if (me.token) {
                    Client.openPage({
                        goodsId: BaseClient.getGoodsCaId(),
                        // goodsId: '11127',
                        beforeSend: function () { },
                        success: function (data) {
                            //ajax返回成功
                            if (data.result == 0) {
                                //                            console.log("用户的浏览数据提交");
                            }
                        },
                        error: function (error) { }
                    });
                }

            },

            //下单
            confirmOrder: function (goodsId) {
                var me = this;
                if (me.status == 1)
                    return false;

                var raise = {};
                raise['raise'] = [
                    {
                        id: goodsId,
                        count: 1
                    }
                ];
                var raiseJson = JSON.stringify(raise);
                var goods = {
                    "goods": [],
                    "orderMsg": ""
                },
                    cars = [],
                    receiving = {},
                    receipt = {},
                    coupon = [];

                Client.goCash({
                    data: {
                        token: BaseClient.getCookie("token"),
                        from: '0',
                        IP: me.myIp,
                        raise: raiseJson,
                        cars: JSON.stringify(cars),
                        goods: JSON.stringify(goods),
                        receiving: JSON.stringify(receiving),
                        receipt: JSON.stringify(receipt),
                        coupon: JSON.stringify(coupon)
                    },
                    beforeSend: function () {
                        //修改用户能否调教请求的状态，发起请求之后不能再起提交
                        me.status = 1;
                    },
                    success: function (data) {
                        //ajax返回成功
                        if (data.result == 0) {
                            //修改能否提交订单的状态，当用户已经提交之后就不能提交订单了
                            me.status = 1;
                            if (data.data.pay == 0) {
                                //订单需要支付的金额为0的时候，跳转到支付成功界面
                                RockBase.navigate("complete/index?orderId=" + data.data.orderId);
                            } else if (data.data.pay > 0) {
                                //跳转页面到支付界面
                                RockBase.navigate("pay/index?orderId=" + data.data.orderId + "&pay=" + data.data.pay);
                            }
                        } else if (data.result == 4000) {
                            me.status = 0;
                            //该用户没有中奖
                            showMsg({ msg: "对不起，您还不能购买" });
                        } else if (data.result == 1001) {
                            //商品无效
                            me.status = 0;
                            showMsg({ msg: "商品无效" });
                        } else if (data.result == 1002) {
                            //购买数量不对
                            me.status = 0;
                            showMsg({ msg: "请重新填写商品数量" });
                        } else if (data.result == 1006) {
                            //无效经销商
                            me.status = 0;
                            showMsg({ msg: "请选择其他经销商" });
                        } else if (data.result == 1007) {
                            //无效提车人
                            me.status = 0;
                            showMsg({ msg: "提车人信息无效" });
                        } else if (data.result == 1012) {
                            //无效地址
                            me.status = 0;
                            showMsg({ msg: "请使用有效的地址" });
                        } else if (data.result == 1024) {
                            //无效选配包
                            me.status = 0;
                            showMsg({ msg: "选配包配置有误，请重新选配" });
                        } else if (data.result == 1029) {
                            //库存不足
                            me.status = 0;
                            showMsg({ msg: "该商品库存不足" });
                        } else if (data.result == 1045) {
                            //超过购买限制
                            me.status = 0;
                            showMsg({ msg: "您的购买数量已超过最大可购买数量，请修改商品数量" });
                        } else if (data.result == 1046) {
                            //秒杀时间未到
                            me.status = 0;
                            showMsg({ msg: "秒杀活动还未开始哦" });
                        } else if (data.result == 1047) {
                            //众筹时间未到
                            me.status = 0;
                            showMsg({ msg: "众筹活动还未开始哦" });
                        } else if (data.result == 1048) {
                            //众筹已结束
                            me.status = 0;
                            showMsg({ msg: "众筹活动已经结束了哦" });
                        } else if (data.result == 3006) {
                            //地址数量已达上限
                            me.status = 0;
                            showMsg({ msg: "您地址的数量已经达到上限，添加新地址失败" });
                        } else if (data.result == 3021) {
                            //优惠券已经使用
                            me.status = 0;
                            showMsg({ msg: "该优惠券已不能使用，请重试" });
                        } else if (data.result == -1) {
                            me.status = 0;
                            //token过期或者是没有token及用户未登陆的情况下跳转登录界面
                            window.location.href = "../login/login.html";
                        } else {
                            me.status = 0;
                            showMsg({ msg: "网络开小差了，请稍后再试" });
                        }
                    },
                    error: function (error) {
                        me.status = 0;
                    }
                });
            },

            _initParticipationRecord: function () {
                var me = this;
                var source = new DataSource({
                    // url: "../cacf/data/record.json",//数据源url地址
                    url: BaseClient.basePath + "main/crowdFundingRecord/list", //数据源url地址

                    data: {
                        productId: BaseClient.getGoodsCaId(),
                        // productId:'11127',
                        pageSize: 40,
                        numCount: 72
                    },
                    withoutTK: true
                });
                var dataRender = function (items, data) {
                    var html = '';
                    var header = '';
                    if (items && items.length && items.length != 0) {
                        _
                            .each(items, function (item) {
                                var img;
                                item.img
                                    ? img = BaseClient.basePath + 'goods-img/img' + item.img
                                    : img = '../rock/img/default-head.png';
                                luckyNum[item.memberId] = {
                                    userName: item.nickname,
                                    orderId: item.orderId,
                                    img: img,
                                    luckyNumber: item.luckyNumber,
                                    partedNum: item.partedNum
                                };
                                html += _.template($('#user-info-template').html(), {
                                    data: item,
                                    img: img
                                });
                            });
                        header += _.template($('#user-info-header-template').html(), {});
                    } else {
                        html += _.template($('#user-noneInfo-template').html(), {});
                        $('.page-container').hide();
                    }
                    $('.evaluation-content .header-content').html(header);
                    $('.user-info-container').html(html);

                };
                var paging = new Paging({
                    el: '#car-comment-paging', //分页控件窗口标识
                    dataSource: source, //绑定数据源
                    render: dataRender, //自定义渲染方法，参数为data数组
                    next: null,
                    beforeChange: function () {
                        var offset = $('.evaluation')
                            .offset()
                            .top;
                        $("html,body").animate({
                            scrollTop: offset - 70
                        }, 0);
                    }
                });
            },

            //获取商品属性图
            getOptionImg: function () {
                var me = this;

                Client.getOptionImg({
                    productId: BaseClient.getGoodsCaId(),
                    // productId: '11127',
                    beforeSend: function () { },
                    success: function (data) {
                        //ajax返回成功
                        if (data.result == 0) {
                            me.optionImg = data.data;
                        } else { }
                    },
                    error: function (error) { }
                });
            },

            //生成当前商品的二维码
            createQRCode: function () {
                var me = this;
                var productId = BaseClient.getGoodsCaId();
                var isCanvas = true;

                var browser = navigator.appName;
                var b_version = navigator.appVersion;
                var version = b_version.split(";");
                if (version[1]) {
                    var trim_Version = version[1].replace(/[ ]/g, "");
                    if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
                        isCanvas = false;
                    } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
                        isCanvas = false;
                    } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
                        isCanvas = false;
                    } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
                        isCanvas = false;
                    }
                }

                if (isCanvas) {
                    $('#code').qrcode({
                        render: "canvas",
                        width: 120,
                        height: 120,
                        text: "http://cloud.mall.changan.com.cn/caecapp/main/index.html#classification/goods-de" +
                        "tail-crowdfunding.html?goodsid=" + productId + "&isShare=true"
                    });
                } else {
                    $("#code").qrcode({
                        render: "table",
                        width: 120,
                        height: 120,
                        text: "http://cloud.mall.changan.com.cn/caecapp/main/index.html#classification/goods-de" +
                        "tail-crowdfunding.html?goodsid=" + productId + "&isShare=true"
                    });
                }
            },

            changeImgShow: function (key) {
                var me = this;
                key = key.substr(5);
                if (me.optionImg[key] && me.optionImg[key].length > 0) {
                    var src = me.optionImg[key][0];
                    var thePosition = src.lastIndexOf('.');
                    var theCompleteSrc = src.substr(0, thePosition) + '_600_600' + src.substr(thePosition);
                    var detailContent = $('.parts-show');
                    detailContent
                        .find('.choose-img-little')
                        .removeClass('show-active');
                    detailContent
                        .find('.detail-img-content img')
                        .attr('src', theCompleteSrc);
                }
            },

            //获取ip
            getUserIP: function () {
                var me = this;
                //http://freegeoip.net/json/?callback=?  跨域获取ip
                $.getJSON('https://freegeoip.net/json/?callback=?', function (data) {
                    if (data) {
                        me.myIp = data.ip;
                    }
                });
            },
            //  onNewIp - your listener function for new IPs
            findIP: function (onNewIP) {
                var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
                var pc = new myPeerConnection({ iceServers: [] }),
                    noop = function () { },
                    localIPs = {},
                    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
                    key;

                function ipIterate(ip) {
                    if (!localIPs[ip])
                        onNewIP(ip);
                    localIPs[ip] = true;
                }

                pc.createDataChannel(""); //create a bogus data channel
                pc.createOffer(function (sdp) {
                    sdp
                        .sdp
                        .split('\n')
                        .forEach(function (line) {
                            if (line.indexOf('candidate') < 0)
                                return;
                            line
                                .match(ipRegex)
                                .forEach(ipIterate);
                        });
                    pc.setLocalDescription(sdp, noop, noop);
                }, noop); // create offer and set local description
                pc.onicecandidate = function (ice) { //listen for candidate events
                    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex))
                        return;
                    ice
                        .candidate
                        .candidate
                        .match(ipRegex)
                        .forEach(ipIterate);
                };
            }

        });

});