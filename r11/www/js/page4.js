require.config({
	baseUrl: 'js/lib',
	paths: {
		'jquery': 'jquery'
	}
});

require(['jquery', 'event', 'selector'], function($, E, S) {
	$('body').append('<pre>'+ $ +'</pre>');
});