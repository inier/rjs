define(['./Base','./c22'], function (Base) {
    var c21 = new Base('Controller 21');
    require(['app/controller/c22'],function(c22){
        console.log(c22);
    });
    return c21;
});
