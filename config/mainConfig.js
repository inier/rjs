// The build will inline common dependencies into this file. For any third party
// dependencies, like jQuery, place them in the lib folder. Configure loading
// modules from the lib directory, except for 'app' ones, which are in a sibling
// directory.
require.config({
  baseUrl: "",
  urlArgs: "ver=20170412091648",
  paths: {
    text: 'rock/com/requirejs-text/text',
    json: 'rock/com/requirejs-json/json',
    css: 'rock/com/requirejs-css/css',
    domReady: 'rock/com/requirejs-domready/domReady',
    baseClient: 'rock/js/rock-client'
  },
  waitSeconds: 0  
});

requirejs([
  'baseClient', 'domReady'
], function (BaseClient, domReady) {
  
});
requirejs.onError = function (err) {
  console.log(err.requireType);
  if (err.requireType === 'timeout') {
    console.log('modules: ' + err.requireModules);
  }
  throw err;
};