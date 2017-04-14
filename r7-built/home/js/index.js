require.config({
	baseUrl: '../../../com/lib'	
});
define(['event', 'selector'], function(E, S) {
	// todo with E and $
	console.log(S("head")[0]);
});