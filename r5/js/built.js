define('selector',[],function () {

    function query(selector, context) {
        var s = selector,
            doc = document,
            regId = /^#[\w\-]+/,
            regCls = /^([\w\-]+)?\.([\w\-]+)/,
            regTag = /^([\w\*]+)$/,
            regNodeAttr = /^([\w\-]+)?\[([\w]+)(=(\w+))?\]/;

        var context = (context == undefined)
            ? document
            : ((typeof context == 'string')
                ? doc.getElementById(context.substr(1, context.length))
                : context);

        // 匹配id
        if (regId.test(s)) {
            return doc.getElementById(s.substr(1, s.length));
        }
        //匹配class
        if (regCls.test(s)) {
            return doc.querySelector(s);
        }
        //匹配Tag name
        if (regTag.test(s)) {
            return doc.getElementsByTagName(s);
        }
        // 略...
    }

    return query;
});
define('cache',[],function() {
    var idSeed = 0,
        cache = {},
        id = '_ guid _';
 
    // @private
    function guid(el) {
        return el[id] || (el[id] = ++idSeed);
    }
 
    return {
        set: function(el, key, val) {
 
            if (!el) {
                throw new Error('setting failed, invalid element');
            }
 
            var id = guid(el),
                c = cache[id] || (cache[id] = {});
            if (key) c[key] = val;
 
            return c;
        },
 
        // 略去...
    };
});
define('event',['cache'], function(cache) {
    var doc = window.document,
        w3c = !!doc.addEventListener,
        expando = 'snandy' + (''+Math.random()).replace(/\D/g, ''),
        triggered,
        addListener = w3c ?
            function(el, type, fn) { el.addEventListener(type, fn, false); } :
            function(el, type, fn) { el.attachEvent('on' + type, fn); },
        removeListener = w3c ?
            function(el, type, fn) { el.removeEventListener(type, fn, false); } :
            function(el, type, fn) { el.detachEvent('on' + type, fn); },
        dispatch = w3c ?
        function(el, type){
            try{
                var evt = document.createEvent('Event');
                evt.initEvent(type,true,true);
                el.dispatchEvent(evt);
            }catch(e){alert(e)};
        } :
        function(el, type){
            try{
                el.fireEvent('on'+type);
            }catch(e){alert(e)}
        };
 
    // 略去...
     
    return {
        on : addListener,
        un : removeListener,
        fire : dispatch
    };
});
require.config({
    baseUrl: '../../com/lib',
    paths:{
        jquery: ['../../com/lib/jquery-1.11.2', 'http://apps.bdimg.com/libs/jquery/1.11.1/jquery.min']
    }
});
 
require(['jquery', 'selector', 'event'], function($, $$, E) {
    var els = $$('p');
    for (var i=0; i<els.length; i++) {
        E.on(els[i], 'click', function() {
            console.log(this.innerHTML);
        });
    }
    alert($);
});
define("../../r5/js/main", function(){});

