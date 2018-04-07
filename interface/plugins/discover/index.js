define(function (require, module, exports) {
  require('plugins/discover/saved_searches/saved_searches');
  require('plugins/discover/directives/timechart');
  require('components/collapsible_sidebar/collapsible_sidebar');
  require('plugins/discover/components/field_chooser/field_chooser');
  require('plugins/discover/controllers/discover');
  require('css!plugins/discover/styles/main.css');

  var apps = require('ui/registry/apps');
  apps.register(function DiscoverAppModule() {
    return {
      id: 'discover',
      name: 'Discover',
      icon: '<span class="fa fa-database"></span>',
      order: 0
    };
  });
});
