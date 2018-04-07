var $ = require('jquery');
window.jQuery = $;
window.$ = $;

require("font-awesome-webpack");
require("style!css!./styles/animate.css");

var showCacheMessage = location.href.indexOf('?embed') < 0 && location.href.indexOf('&embed') < 0;
if (!showCacheMessage && document.getElementById('cache-message')) document.getElementById('cache-message').style.display = 'none';

if (window.KIBANA_BUILD_NUM.substr(0, 2) !== '@@') {
  // only cache bust if this is really the build number
  require.config({ urlArgs: '_b=' + window.KIBANA_BUILD_NUM });
}

require('./styles/main.less');

var kibana = require('./kibana');
kibana.init();