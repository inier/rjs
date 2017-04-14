require.config({
    baseUrl: '../../com/lib',
    paths:{
        jquery: ['../../com/lib/jquery-1.11.2', 'http://apps.bdimg.com/libs/jquery/1.11.1/jquery.min']
    }
});
 
require(['jquery', 'selector', 'event'], function($, $$, E) {
    var els = $$('p');
    for (var i=0; i<els.length; i++) {
        E.bind(els[i], 'click', function() {
            console.log(this.innerHTML);
        });
    }
    alert($);
});