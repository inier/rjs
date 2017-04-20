define(['./Base','./c21'], function (Base) {
    var c2 = new Base('Controller 2');
    require(['app/controller/c21'],function(c21){
        console.log(c21);
    });
    return c2;
});
