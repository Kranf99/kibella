define(function (require) {
  var _ = require('lodash');
  var $ = require('jquery');
  var angular = require('angular');
  var ConfigTemplate = require('utils/config_template');
  var kib = require('ui/modules').get('kibana');

  require('directives/config');
  require('components/courier/courier');
  require('components/config/config');
  require('components/notify/notify');
  require('components/typeahead/typeahead');

  require('./sections/create/index.js');
  require('./sections/manage/index.js');
  require('./sections/edit/index.js');
  require('./sections/insert/index.js');
  require('./sections/cache/index.js');

  require('./admin.less');

  var app = require('ui/modules').get('app/admin', [
    'elasticsearch',
    'ngRoute',
    'kibana/courier',
    'kibana/config',
    'kibana/notify',
    'kibana/typeahead'
  ]);

  app.factory("AdminOnly", function($location, $rootScope) {
    var adminOnly = {};

    adminOnly.check = function() {
      if($rootScope.user.is_admin !== "true" && $rootScope.user.is_admin !== "TRUE") {
        $location.path('/');
      }
    }

    return adminOnly;
  });

  app.directive('adminApp', function (Notifier, courier, AppState, $location, timefilter) {
    return {
      restrict: 'EA',
      template: require('./index.html'),
      transclude: true,
      scope: {
        sectionName: '@section'
      },
      link: function ($scope, $el) {

        // Use this for setting the 'active' class on buttons menu
        $scope.path = $location.$$path;
        
        timefilter.enabled = false;
        
        $scope.sections = require('./sections/index');
        $scope.section = _.find($scope.sections, { name: $scope.sectionName });
        $scope.sections.forEach(function (section) {
          section.class = (section === $scope.section) ? 'active' : void 0;
        });
      }
  }});

  require('routes').when('/admin', {
    redirectTo: '/admin/manage'
  });
  
  kib.run(function($http, kbnPath, $route) {
    $http.post(kbnPath + '/JSON_SQL_Bridge/users/actions/getMe.php').then(function(response) {
      if(response.data.is_admin === "true" || response.data.is_admin === "TRUE") {

        var apps = require('ui/registry/apps');
        apps.register(function AdminAppModule() {
          return {
            id: 'admin',
            name: 'Administration',
            icon: `<svg
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            id="svg8"
            version="1.1"
            viewBox="0 0 4.8182496 8.3454408"
            height="13.909068mm"
            width="8.0304165mm">
           <defs
              id="defs2">
             <linearGradient
                id="linearGradient6220">
               <stop
                  id="stop6216"
                  offset="0"
                  style="stop-color:#9745ba;stop-opacity:0.89411765" />
               <stop
                  id="stop6218"
                  offset="1"
                  style="stop-color:#d473ff;stop-opacity:1" />
             </linearGradient>
             <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="131.21202"
                x2="84.510361"
                y1="129.41202"
                x1="84.510361"
                id="linearGradient11382-4"
                xlink:href="#linearGradient6220"
                gradientTransform="matrix(1.5454586,0,0,1.5454586,-10.134262,-57.378502)" />
             <linearGradient
                y2="-1388"
                x2="95.262817"
                y1="-1378"
                x1="112.58333"
                gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"
                gradientUnits="userSpaceOnUse"
                id="linearGradient11673"
                xlink:href="#linearGradient6220" />
           </defs>
           <metadata
              id="metadata5">
             <rdf:RDF>
               <cc:Work
                  rdf:about="">
                 <dc:format>image/svg+xml</dc:format>
                 <dc:type
                    rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                 <dc:title></dc:title>
               </cc:Work>
             </rdf:RDF>
           </metadata>
           <g
              transform="translate(-118.06386,-139.84061)"
              id="layer1">
             <path
                id="path11368-76"
                d="m 120.47299,145.40423 v 2.78182 l 2.40912,-4.17272 z"
                style="fill:#9b46bf;fill-opacity:0.99607843;stroke:none;stroke-width:0.24534151px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <path
                id="path11372-8"
                d="m 120.47299,145.40423 -2.40913,-1.3909 2.40913,4.17272 z"
                style="fill:#7e409a;fill-opacity:1;stroke:none;stroke-width:0.24534151px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <path
                id="path11374-9"
                d="m 118.06386,144.01333 2.40913,1.3909 2.40912,-1.3909 -2.40912,-1.39091 z"
                style="fill:url(#linearGradient11382-4);fill-opacity:1;stroke:none;stroke-width:0.24534151px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <g
                id="g6353-5-6-1-0"
                transform="matrix(0.10597386,0,0,0.10597386,109.45985,288.257)">
               <path
                  id="path6347-61-2-07-6"
                  d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"
                  style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
               <path
                  style="fill:url(#linearGradient11673);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                  d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
                  id="path6349-1-1-5-8" />
               <path
                  id="path6351-4-2-8-7"
                  d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"
                  style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             </g>
           </g>
         </svg>
         `,
            order: 4
          };
        });
      }
    });
  });
});