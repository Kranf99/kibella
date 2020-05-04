  define(function (require) {
  var _ = require('lodash');
  var $ = require('jquery');
  var angular = require('angular');
  var ConfigTemplate = require('utils/config_template');

  require('directives/config');
  require('components/courier/courier');
  require('components/config/config');
  require('components/notify/notify');
  require('components/typeahead/typeahead');
  require('plugins/dashboard/directives/grid');
  require('plugins/dashboard/components/panel/panel');
  require('plugins/dashboard/services/saved_dashboards');
  require('css!plugins/dashboard/styles/main.css');
  const anime = require('animejs');

  var rison = require('utils/rison');

  // require('plugins/dashboard/directives/share');

  var app = require('ui/modules').get('app/dashboard', [
    'elasticsearch',
    'ngRoute',
    'kibana/courier',
    'kibana/config',
    'kibana/notify',
    'kibana/typeahead'
  ]);

  require('routes')
  .when('/dashboard', {
    template: require('text!plugins/dashboard/index.html'),
    resolve: {
      dash: function (savedDashboards) {
        return savedDashboards.get();
      }
    }
  })
  .when('/dashboard/:id', {
    template: require('text!plugins/dashboard/index.html'),
    resolve: {
      dash: function (savedDashboards, Notifier, $route, $location, courier) {
        return savedDashboards.get($route.current.params.id)
        .catch(courier.redirectWhenMissing({
          'dashboard' : '/dashboard'
        }));
      }
    }
  });

  app.directive('dashboardApp', function (Notifier, courier, AppState, timefilter, kbnUrl) {
    return {
      controller: function ($scope, $rootScope, $route, $routeParams, $location, $http, kbnPath, configFile, Private, getAppState) {
        var queryFilter = Private(require('components/filter_bar/query_filter'));

        var notify = new Notifier({
          location: 'Dashboard'
        });


        // Empty Dashboard Animation

        var cubes = {
          top: document.querySelector('#cube-top'),
          bottom: document.querySelector('#cube-bottom'),
          left: document.querySelector('#cube-left'),
          right: document.querySelector('#cube-right')
        }

        anime({
          targets: cubes.top,
          transform: "matrix(0.28400005,0,0,0.28400005,44.963816,-1132.9252)",
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutExpo',
          duration: 2000,
          delay: 600,
        });

        anime({
          targets: cubes.bottom,
          transform: "matrix(0.28400004,0,0,0.28400004,44.963814,-1120.2128)",
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutExpo',
          duration: 2000,
          delay: 400,
        });

        anime({
          targets: cubes.left,
          transform: "matrix(0.28400005,0,0,0.28400005,36.303559,-1133.1068)",
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutExpo',
          duration: 2000,
        });

        anime({
          targets: cubes.right,
          transform: "matrix(0.28400005,0,0,0.28400005,53.624067,-1127.3796)",
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutExpo',
          duration: 2000,
          delay: 200
        });

        //

        var dash = $scope.dash = $route.current.locals.dash;

        if (dash.timeRestore && dash.timeTo && dash.timeFrom && !getAppState.previouslyStored()) {
          timefilter.time.to = dash.timeTo;
          timefilter.time.from = dash.timeFrom;
        }

        if(dash.shared === 1 || dash.shared === "1")
          $scope.shared = true
        else if(dash.shared === 0 || dash.shared === "0")
          $scope.shared = false
        else
          console.error("Invalid value: shared must be 1 or 0 (Number or String)")

        $scope.$on('$destroy', dash.destroy);

        var matchQueryFilter = function (filter) {
          return filter.query && filter.query.query_string && !filter.meta;
        };

        var extractQueryFromFilters = function (filters) {
          var filter = _.find(filters, matchQueryFilter);
          if (filter) return filter.query;
        };

        var stateDefaults = {
          title: dash.title,
          panels: dash.panelsJSON ? JSON.parse(dash.panelsJSON) : [],
          query: extractQueryFromFilters(dash.searchSource.getOwn('filter')) || {query_string: {query: '*'}},
          filters: _.reject(dash.searchSource.getOwn('filter'), matchQueryFilter),
          theme: $rootScope.theme
        };

        var $state = $scope.state = new AppState(stateDefaults);

        $scope.configTemplate = new ConfigTemplate({
          save: require('text!plugins/dashboard/partials/save_dashboard.html'),
          load: require('text!plugins/dashboard/partials/load_dashboard.html'),
          share: require('text!plugins/dashboard/partials/share.html'),
          pickVis: require('text!plugins/dashboard/partials/pick_visualization.html'),
          settings: require('text!plugins/dashboard/partials/settings.html')
        });

        $scope.refresh = _.bindKey(courier, 'fetch');

        timefilter.enabled = true;
        $scope.timefilter = timefilter;
        $scope.$listen(timefilter, 'fetch', $scope.refresh);

        courier.setRootSearchSource(dash.searchSource);

        function init() {
          updateQueryOnRootSource();

          var docTitle = Private(require('components/doc_title/doc_title'));
          if (dash.id) {
            docTitle.change(dash.title);
          }

          $scope.$emit('application.load');
        }


        function updateQueryOnRootSource() {
          var filters = queryFilter.getFilters();
          if ($state.query) {

              if( $state.query.query_string !== undefined       &&
                  $state.query.query_string.query !== undefined &&
                  $state.query.query_string.query !== "*"       ){

                $state.query.query_string.query.split(/( AND | OR | and | or )/)
                  .map(function(str,i) {
                    if(!str.includes(" AND ") && !str.includes(" OR ") &&
                      !str.includes(" and ") && !str.includes(" or ")) {
                      return str.split("=").map(function(str,i) {
                        if(i % 2 !== 0)
                          return str.replace('"', "'").replace('"', "'")
                        return str;
                      }).join('=')
                    }
                    return str;
                  }).join(' ')
              }

            dash.searchSource.set('filter', _.union(filters, [{
              query: $state.query
            }]));
          } else {
            dash.searchSource.set('filter', filters);
          }
        }

        // update root source when filters update
        $scope.$listen(queryFilter, 'update', function () {
          updateQueryOnRootSource();
          $state.save();
        });

        // update data when filters fire fetch event
        $scope.$listen(queryFilter, 'fetch',  $scope.refresh);

        $scope.newDashboard = function () {
          kbnUrl.change('/dashboard', {});
        };

        $scope.filterResults = function () {
          updateQueryOnRootSource();
          $state.save();
          $scope.refresh();
        };

        $scope.save = function () {
          $state.title = dash.id = dash.title;
          $state["theme"] = $rootScope.theme;
          $state.save();
          dash.panelsJSON = angular.toJson($state.panels);
          dash.timeFrom = dash.timeRestore ? timefilter.time.from : undefined;
          dash.timeTo = dash.timeRestore ? timefilter.time.to : undefined;

          dash["theme"] = $rootScope.theme;
          dash.save()
          .then(function (id) {
            $scope.configTemplate.close('save');
            if (id) {
              notify.info('Saved Dashboard as "' + dash.title + '"');
              if (dash.id !== $routeParams.id) {
                kbnUrl.change('/dashboard/{{id}}', {id: dash.id});
              }
            }
          })
          .catch(notify.fatal);
        };

        var pendingVis = _.size($state.panels);
        $scope.$on('ready:vis', function () {
          if (pendingVis) pendingVis--;
          if (pendingVis === 0) {
            $state.save();
            $scope.refresh();
          }
        });

        
        // listen for notifications from the grid component that changes have
        // been made, rather than watching the panels deeply
        $scope.$on('change:vis', function () {
          $state.save();
        });

        // called by the saved-object-finder when a user clicks a vis
        $scope.addVis = function (hit) {
          $scope.configTemplate.close('pickVis');
          pendingVis++;
          $state.panels.push({ id: hit.id, type: 'visualization', isNew: true });
        };

        $scope.addSearch = function (hit) {
          pendingVis++;
          $state.panels.push({ id: hit.id, type: 'search' });
        };
        
        $rootScope.theme = dash.theme
        $state["theme"] = dash.theme

        $scope.location = $location

        var prev_location = "";
        var hash = "";

        $rootScope.showSpy = true;

        // Setup configurable values for config directive, after objects are initialized
        $scope.opts = {
          dashboard: dash,
          save: $scope.save,
          addVis: $scope.addVis,
          addSearch: $scope.addSearch,
          isShared: $scope.shared,
          showRawTables: $rootScope.showSpy,
          themes: ["bright", "dark"],
          selectedTheme: $rootScope.theme || $rootScope.defaultTheme,
          updateTheme: function(e) {
            $rootScope.theme = $scope.opts.selectedTheme;
            $state["theme"] = $scope.opts.selectedTheme;

            var s = $location.search()

            if(s["_a"] === undefined) return;

            var e = rison.decode(s["_a"]);
            
            if(e.theme === undefined) return;
            
            e.theme = $scope.opts.selectedTheme
            s["_a"] = rison.encode(e);
            $location.search(s).replace();
          
           // $scope.refresh();
          },
          changeShared: function() {
            $http.post(kbnPath + '/JSON_SQL_Bridge/dashboard/actions/changeShared.php', { id: $route.current.params.id, sharedValue: $scope.opts.isShared });
          },
          changeRawTables: function() {
            $http.post(kbnPath + '/JSON_SQL_Bridge/dashboard/actions/changeRawTables.php', { id: $route.current.params.id, showTablesValue: $scope.opts.showRawTables });
          },
          shareData: function () {        
            return  {
              link:  $location.absUrl().split('_g=()')[0].replace('?',''),
              rolink: $location.absUrl().replace('?', '?embed').split('_g=()')[0],
              embed: '<iframe src="' + $location.absUrl().replace('?', '?embed').split('_g=()')[0] +
                '" height="600" width="800"></iframe>'
            };
          }
        };

        $http.post(kbnPath + '/JSON_SQL_Bridge/dashboard/actions/showRawTables.php', { id: $route.current.params.id })
          .then(function (resp) {
              $rootScope.showSpy = Boolean(Number(resp.data))
              $scope.opts.showRawTables = $rootScope.showSpy
          }, function (err) {
            console.error(err)
          });


        init();
      }
    };
  });

  var apps = require('ui/registry/apps');
  apps.register(function DashboardAppModule() {
    return {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '<svg       xmlns:dc="http://purl.org/dc/elements/1.1/"       xmlns:cc="http://creativecommons.org/ns#"       xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"       xmlns:svg="http://www.w3.org/2000/svg"       xmlns="http://www.w3.org/2000/svg"       xmlns:xlink="http://www.w3.org/1999/xlink"       id="svg8"       version="1.1"       viewBox="0 0 6.9638661 8.3248787"       height="13.874798mm"       width="11.606444mm">      <defs         id="defs2">        <linearGradient           id="linearGradient6220">          <stop             id="stop6216"             offset="0"             style="stop-color:#9745ba;stop-opacity:0.89411765" />          <stop             id="stop6218"             offset="1"             style="stop-color:#d473ff;stop-opacity:1" />        </linearGradient>        <linearGradient           y2="-1388"           x2="95.262817"           y1="-1378"           x1="112.58333"           gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"           gradientUnits="userSpaceOnUse"           id="linearGradient12054"           xlink:href="#linearGradient6220" />        <linearGradient           y2="-1388"           x2="95.262817"           y1="-1378"           x1="112.58333"           gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"           gradientUnits="userSpaceOnUse"           id="linearGradient12056"           xlink:href="#linearGradient6220" />        <linearGradient           y2="-1388"           x2="95.262817"           y1="-1378"           x1="112.58333"           gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"           gradientUnits="userSpaceOnUse"           id="linearGradient12058"           xlink:href="#linearGradient6220" />        <linearGradient           y2="-1388"           x2="95.262817"           y1="-1378"           x1="112.58333"           gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"           gradientUnits="userSpaceOnUse"           id="linearGradient12092"           xlink:href="#linearGradient6220" />        <linearGradient           y2="-1388"           x2="95.262817"           y1="-1378"           x1="112.58333"           gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"           gradientUnits="userSpaceOnUse"           id="linearGradient12195"           xlink:href="#linearGradient6220" />        <linearGradient           y2="-1388"           x2="95.262817"           y1="-1378"           x1="112.58333"           gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"           gradientUnits="userSpaceOnUse"           id="linearGradient12197"           xlink:href="#linearGradient6220" />        <linearGradient           y2="-1388"           x2="95.262817"           y1="-1378"           x1="112.58333"           gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"           gradientUnits="userSpaceOnUse"           id="linearGradient12199"           xlink:href="#linearGradient6220" />        <linearGradient           y2="-1388"           x2="95.262817"           y1="-1378"           x1="112.58333"           gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"           gradientUnits="userSpaceOnUse"           id="linearGradient12201"           xlink:href="#linearGradient6220" />      </defs>      <metadata         id="metadata5">        <rdf:RDF>          <cc:Work             rdf:about="">            <dc:format>image/svg+xml</dc:format>            <dc:type               rdf:resource="http://purl.org/dc/dcmitype/StillImage" />            <dc:title></dc:title>          </cc:Work>        </rdf:RDF>      </metadata>      <g         transform="translate(-145.96308,-65.048716)"         id="layer1">        <g           transform="matrix(0.5924443,0,0,0.5924443,92.396642,12.386798)"           id="g2236-7">          <g             transform="matrix(0.14989026,0,0,0.14989026,80.716176,303.45277)"             id="g6353-5-6-5-5-0-0">            <path               style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"               id="path6347-61-2-0-9-4-8" />            <path               id="path6349-1-1-9-8-4-1"               d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"               style="fill:url(#linearGradient12058);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />            <path               style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"               id="path6351-4-2-6-4-4-9" />          </g>          <g             transform="matrix(0.14989026,0,0,0.14989026,77.110598,305.53445)"             id="g6353-5-6-5-4">            <path               style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"               id="path6347-61-2-0-99" />            <path               id="path6349-1-1-9-4"               d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"               style="fill:url(#linearGradient12054);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />            <path               style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"               id="path6351-4-2-6-5" />          </g>          <g             transform="matrix(0.14989026,0,0,0.14989026,84.321754,305.53445)"             id="g6353-5-6-5-5-9">            <path               style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"               id="path6347-61-2-0-9-3" />            <path               id="path6349-1-1-9-8-5"               d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"               style="fill:url(#linearGradient12056);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />            <path               style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"               id="path6351-4-2-6-4-7" />          </g>          <g             transform="matrix(0.14989026,0,0,0.14989026,80.716176,307.61613)"             id="g6353-5-6-5-5-9-8">            <path               style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"               id="path6347-61-2-0-9-3-2" />            <path               id="path6349-1-1-9-8-5-5"               d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"               style="fill:url(#linearGradient12092);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />            <path               style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"               id="path6351-4-2-6-4-7-3" />          </g>          <g             transform="matrix(0.14989026,0,0,0.14989026,80.716176,298.81054)"             id="g6353-5-6-5-5-0-0-0">            <path               style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"               id="path6347-61-2-0-9-4-8-2" />            <path               id="path6349-1-1-9-8-4-1-0"               d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"               style="fill:url(#linearGradient12195);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />            <path               style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"               id="path6351-4-2-6-4-4-9-1" />          </g>          <g             transform="matrix(0.14989026,0,0,0.14989026,77.110596,300.89222)"             id="g6353-5-6-5-4-9">            <path               style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"               id="path6347-61-2-0-99-6" />            <path               id="path6349-1-1-9-4-2"               d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"               style="fill:url(#linearGradient12197);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />            <path               style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"               id="path6351-4-2-6-5-1" />          </g>          <g             transform="matrix(0.14989026,0,0,0.14989026,84.321746,300.89222)"             id="g6353-5-6-5-5-9-2">            <path               style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"               id="path6347-61-2-0-9-3-0" />            <path               id="path6349-1-1-9-8-5-7"               d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"               style="fill:url(#linearGradient12199);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />            <path               style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"               id="path6351-4-2-6-4-7-31" />          </g>          <g             transform="matrix(0.14989026,0,0,0.14989026,80.716176,302.97391)"             id="g6353-5-6-5-5-9-8-1">            <path               style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"               id="path6347-61-2-0-9-3-2-9" />            <path               id="path6349-1-1-9-8-5-5-0"               d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"               style="fill:url(#linearGradient12201);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />            <path               style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"               d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"               id="path6351-4-2-6-4-7-3-5" />          </g>        </g>      </g>    </svg>',       order: 2
    };
  });
});
