define(['./Base','./c23'], function (Base) {
    var c22 = new Base('Controller 22');
    require(['app/controller/c23'],function(c23){
        console.log(c23);
    });
    return c22;
});
