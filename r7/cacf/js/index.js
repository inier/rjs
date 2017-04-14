require.config({
	baseUrl: '../../../com/lib',
	paths: {
		jquery: ['../../../com/lib/jquery-1.11.2', 'http://apps.bdimg.com/libs/jquery/1.11.1/jquery.min']
	}
});

require(['jquery', 'event', 'selector'], function($, E, S) {
	alert($);
});