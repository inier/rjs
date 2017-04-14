require.config({
    baseUrl: '../../com/lib'
});
 
require(['selector', 'event'], function($, E) {
    var els = $('p');
    for (var i=0; i<els.length; i++) {
        E.bind(els[i], 'click', function() {
            console.log(this.innerHTML);
        });
    }
});