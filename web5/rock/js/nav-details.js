// 导航菜单交互事件
define(['jquery'],function($){
    var navUl = $("#js-detailsNav"),
        tIndex = 0,
        speed = 200;

    function clicked() {
        n = navUl.find("li.active").index();       
    }

    clicked();
    navUl.on("hover", "li", function () {
            tIndex = navUl.find("li.active").index();
            n = $(this).index();
        }
    );
    navUl.on("click", ".menu", function (e) {
        var tt = e.currentTarget;
        tIndex = $(this).index();
        if (!$(tt).hasClass("active")) {
            $(tt).addClass("active").siblings().removeClass("active");
        }
    });
});