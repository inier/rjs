/**
 * Created by Administrator on 2015/11/3.
 */
define(['jquery'], function () {

    // 2016-11-17 yjh修改
    // 增加初始化方法的返回

    var doInit = function () {
        var $navcur = $(".nav-main-current");
        var $nav = $("#js-mainNav");
        var navItem = ".menu";
        var current = ".active";
        var speed = 300;
        var itemW = $nav.find(current).width();	//默认当前位置宽度
        var elCurrent = $nav.find(current);
        if (elCurrent && elCurrent.length > 0) {
            var defLeftW = elCurrent.position().left;	//默认当前位置Left值

            //添加默认下划线
            $navcur.css({width: itemW, left: defLeftW});

            //hover事件
            $nav.find(navItem).hover(function () {
                var index = $(this).index();	//获取滑过元素索引值
                var leftW = $(this).position().left;	//获取滑过元素Left值
                var currentW = $nav.find(navItem).eq(index).width();	//获取滑过元素Width值
                $navcur.stop().animate({
                    left: leftW,
                    width: currentW
                }, speed);

            }, function () {
                $navcur.stop().animate({
                    left: defLeftW,
                    width: itemW
                }, speed)
            });

            //个人中心  导航专用
            $nav.find('.menu .js-person-item').on('click', function (e) {
                var $c = $(e.currentTarget);
                itemW = $c.parent().width();
                defLeftW = $c.parent().position().left;
                $navcur.css({width: itemW, left: defLeftW});
            });
        }
    };

    doInit();
    $(window).resize(function(){
        doInit();
    });
    return {
        init: doInit
    }
});