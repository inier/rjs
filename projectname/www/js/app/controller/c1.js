define(['./Base','./c11'], function (Base) {
    var c1 = new Base('Controller 1');
    require(['app/controller/c11'],function(c11){
        console.log(c11);
    });
    return c1;
});
