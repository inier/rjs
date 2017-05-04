/**
 * Created by yjh on 2015/12/28.
 * /**
 * 引入 dialog.js
 *
 * me.dialog = Dialog.createDialog({
                    autoOpen: true/false,                     是否自动打开(默认自动)
                    size: "sm",                               窗口大小 sm/md/lg
                    closeBtn: true/false,                     是否使用小叉叉(默认不实用)
                    title: '确定删除吗?',                       标题
                    icon: 'well/tip/build',                    提示类型图片
                    content: '您确定要删除此条地址吗?',           内容
                    buttons: [                                  按钮组
                        {
                            name: '确定',                        按钮名字
                            callback: function(){},              回调函数
                            className: 'btn-reverse'             按钮class名字(自定义样式)
                        }
                    ],
                    listener: {
                        close: function(){}                     默认关闭模态窗
                    }
                });
 me.dialog.show();             显示
 me.dialog.hide();             隐藏
 */

define([
        'jquery',
        'underscore',
        'text!rock/js/dialog/dialog.html',
        'bootstrap'
    ],
    function ($, _, Tpl) {
        function dialog(options) {
            var me = this;

            //默认参数
            this.opts = {
                id:"",
                size: "sm",
                autoOpen: true,
                closeBtn: false,
                title: null,
                content: null,
                buttons: null,
                listener: null
            };
            this.opts = _.extend(this.opts, options);

            this.init = function () {
                //添加模版
                var tpl = _.template($(Tpl).html())({data: me.opts});
                //tpl = $(tpl).find('.modal-dialog').css({
                //    'width': this.opts.width + 'px'
                //});
                $('body').append(tpl);

                var dom = $('.com-dialog');
                //给小叉叉绑定事件
                if (options.closeBtn) {
                    $('.close', '.com-dialog').on('click', function (e) {
                        if (me.opts.listener && me.opts.listener.close && typeof me.opts.listener.close === "function") {
                            me.opts.listener.close();
                        } else {
                            me.hide();
                        }
                    });
                }
                //给按钮组绑定事件
                var btnList = dom.find('.btn');
                if (me.opts.buttons) {
                    _.each(me.opts.buttons, function (item, index) {
                        btnList.eq(index).on('click', function (e) {
                            item.callback.apply(me);
                        });
                    })
                }
                //监听模态窗关闭动画结束
                dom.on('hidden.bs.modal', function () {
                    dom.remove();
                    if (me.opts.listener && me.opts.listener.close && typeof me.opts.listener.close === "function") {
                        me.opts.listener.close();
                    }
                });
                //是否自动show
                if (me.opts.autoOpen) {
                    this.show();
                }
            };

            this.show = function () {
                $('.com-dialog').modal('show');
            };

            this.hide = function () {
                $('.com-dialog').modal('hide');
            }
        }

        function createDialog(options) {
            var d = new dialog(options);
            d.init();
            return d;
        }

        return {
            createDialog: createDialog
        }
    }
);