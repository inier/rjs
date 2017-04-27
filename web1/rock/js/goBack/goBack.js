/**
 * Created by jazz on 2017/4/17.
 */
// 返回顶部
define([ 'jquery','underscore'], function($, _) {
    function GoBack(options){
        var me = this;

        // 默认项
        this.opts = {
            id:"",
            elHeight: "50px",
            animateDuration: "300",
            scrollDuration: "600"
        };

        this.opts = _.extend(this.opts, options);

        this.init = function(){
            var documentEl = $(document),
                windowObj = $(window),
                el = $(me.opts.id),
                isShow = false;

            function doScroll(){
                var pos = windowObj.innerHeight();
                if (documentEl.scrollTop() >= pos) {
                    if(!isShow){
                        el.animate({"height": me.opts.elHeight}, me.opts.animateDuration);
                        isShow = true;
                    }
                } else {
                    if(isShow) {
                        el.animate({"height": "0"}, me.opts.animateDuration);
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
                }, me.opts.scrollDuration);  //控制滚动的速度, 默认600ms
                return false;
            });
        };
    }

    return {
        init: function (options) {
            var fn = new GoBack(options);
            fn.init();
            return fn;
        }
    }
});