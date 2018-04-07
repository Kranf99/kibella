define(function (require) {

  // base angular components/directives we expect to be loaded
  require('angular-bootstrap');
  
  require('services/private');
  require('components/config/config');
  require('components/courier/courier');
  require('components/filter_bar/filter_bar');
  require('components/notify/notify');
  require('components/persisted_log/persisted_log');
  require('components/state_management/app_state');
  require('components/storage/storage');
  require('components/url/url');
  require('components/doc_title/doc_title');
  require('components/tooltip/tooltip');
  require('components/style_compile/style_compile');
  require('components/watch_multi');
  require('components/bind');
  require('components/listen');
  require('components/fancy_forms/fancy_forms');
  require('components/stringify/register');
  require('directives/click_focus');
  require('directives/info');
  require('directives/spinner');
  require('directives/paginate');
  require('directives/pretty_duration');
  require('directives/rows');
  require('directives/user_panel');
  require('angular-clipboard');

  var Notifier = require('components/notify/_notifier');

  // ensure that the kibana module requires ui.bootstrap
  require('ui/modules')
  .get('kibana', ['ui.bootstrap', 'angular-clipboard'])
  .config(function ($tooltipProvider) {
    $tooltipProvider.setTriggers({ 'mouseenter': 'mouseleave click' });
  })

  // Must be improve with a directive for the entire navbar
  .factory('kibanaNavbar',  function($window) {
    var factoryNav = {};

    factoryNav = {
        isExpand: false,
        init: function() {

          /*if($cookies.get('isExpand') == true) {
            factoryNav.expand();
          }else{
            factoryNav.compress();
          }*/
  
        },
        expand: function() {
          factoryNav.isExpand = true;
         // $cookies.put('isExpand', true);
          $window.$(window).trigger('resize');
        },
        compress: function() {
          factoryNav.isExpand = false;
          //$cookies.put('isExpand', false);
          $window.$(window).trigger('resize');
        }
    }

    factoryNav.init();

    return factoryNav;
  })

  .directive('kibana', function (Private, $rootScope, $injector, Promise, config, kbnSetup, kibanaNavbar) {
    return {
      template: require('text!plugins/kibana/kibana.html'),
      controllerAs: 'kibana',
      controller: function ($scope) {
        var _ = require('lodash');
        var self = $rootScope.kibana = this;
        var notify = new Notifier({ location: 'Kibana' });

        // this is the only way to handle uncaught route.resolve errors
        $rootScope.$on('$routeChangeError', function (event, next, prev, err) {
          notify.fatal(err);
        });

        $rootScope.nav = kibanaNavbar;
        $scope.isUserPanelShowed = false;

        // run init functions before loading the mixins, so that we can ensure that
        // the environment is ready for them to get and use their dependencies
        self.ready = Promise.all([ kbnSetup(), config.init() ])
        .then(function () {
          // load some "mixins"
          var mixinLocals = { $scope: $scope, notify: notify };
          $injector.invoke(require('plugins/kibana/_init'), self, mixinLocals);
          $injector.invoke(require('plugins/kibana/_apps'), self, mixinLocals);
          $injector.invoke(require('plugins/kibana/_timepicker'), self, mixinLocals);

          $scope.setupComplete = true;
        });
      }
    };
  });
});
