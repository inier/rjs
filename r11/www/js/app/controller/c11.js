define(['./Base','./c12'], function (Base) {
    var c11 = new Base('Controller 11');
    require(['app/controller/c12'],function(c12){
        console.log(c12);
    });
    return c11;
});