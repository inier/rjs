require.config({
	baseUrl: 'js',
	paths: {
		'jquery': 'lib/jquery'
	}
});

require(['jquery', 'event', 'selector'], function($, E, S) {
	alert($);
});