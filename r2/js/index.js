require.config({
    baseUrl: '../../com/lib'
});
 
require(['selector'], function(query) {
    var els = query('.wrapper');
    console.log(els);
    els = query('#box');
    console.log(els);
    els = query('span');
    console.log(els);
});