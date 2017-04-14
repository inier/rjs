require.config({
    // map: {     'A': {         'jquery': '../../com/jquery-1.7.2'     },     'B':
    // {         'jquery': '../../com/jquery-1.11.2'     } }, config: {     'A': {
    //     info: {name: 'jack'}     } }
    paths: {
        jquery: ['http://apps.bdimg.com/libs/jquery/1.11.1/jquery.min', '../../com/lib/jquery-1.11.2']
    }
});

require(['jquery'], function ($) {
    alert($().jquery);
}, function (err) {
    console.log(err);
    var failedId = err.requireModules && err.requireModules[0];
    if (failedId === 'jquery') {
        requirejs.undef(failedId);
    }
});

// download jquery-1.7.2.js require(['A'], function (A) {
// console.log('success');     var info = A.config().info; console.log(info); },
// function (err) {     console.log(err) }); setTimeout(function () {     //
// download jquery-1.11.2.js     require(['B'], function () {
// console.log('success');         alert($().jquery); }, function (err) {
//  console.log(err)         var failedId = err.requireModules &&
// err.requireModules[0];         if (failedId === 'jquery') {
// requirejs.undef(failedId);         }     }); }, 5000);