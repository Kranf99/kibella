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
            name: 'Admin',
            icon: `<svg
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            id="svg8"
            version="1.1"
            viewBox="0 0 7.5032302 8.2484779"
            height="13.747463mm"
            width="12.505384mm">
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
                id="linearGradient11382-1"
                xlink:href="#linearGradient6220"
                gradientTransform="matrix(1.1399995,0,0,1.1399995,44.002418,-0.62289562)" />
             <linearGradient
                y2="-1388"
                x2="95.262817"
                y1="-1378"
                x1="112.58333"
                gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"
                gradientUnits="userSpaceOnUse"
                id="linearGradient11508"
                xlink:href="#linearGradient6220" />
             <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="131.21202"
                x2="84.510361"
                y1="129.41202"
                x1="84.510361"
                id="linearGradient11382-1-2"
                xlink:href="#linearGradient6220"
                gradientTransform="matrix(1.1399995,0,0,1.1399995,45.976952,-2.7153996)" />
             <linearGradient
                y2="-1388"
                x2="95.262817"
                y1="-1378"
                x1="112.58333"
                gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"
                gradientUnits="userSpaceOnUse"
                id="linearGradient11563"
                xlink:href="#linearGradient6220" />
             <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="131.21202"
                x2="84.510361"
                y1="129.41202"
                x1="84.510361"
                id="linearGradient11382-1-2-2"
                xlink:href="#linearGradient6220"
                gradientTransform="matrix(1.1399995,0,0,1.1399995,42.027893,-2.7154046)" />
             <linearGradient
                y2="-1388"
                x2="95.262817"
                y1="-1378"
                x1="112.58333"
                gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"
                gradientUnits="userSpaceOnUse"
                id="linearGradient11618"
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
              transform="translate(-136.59257,-142.76225)"
              id="layer1">
             <path
                id="path11368-7-6"
                d="m 142.31872,146.86624 v 2.052 l 1.77708,-3.078 z"
                style="fill:#9b46bf;fill-opacity:0.99607843;stroke:none;stroke-width:0.1809749px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <path
                id="path11372-4-4"
                d="m 142.31872,146.86624 -1.77709,-1.026 1.77709,3.078 z"
                style="fill:#7e409a;fill-opacity:1;stroke:none;stroke-width:0.1809749px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <path
                id="path11374-3-1"
                d="m 140.54163,145.84024 1.77709,1.026 1.77708,-1.026 -1.77708,-1.02598 z"
                style="fill:url(#linearGradient11382-1-2);fill-opacity:1;stroke:none;stroke-width:0.1809749px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <path
                id="path11368-7"
                d="m 140.34418,148.95874 v 2.05199 l 1.77708,-3.07799 z"
                style="fill:#9b46bf;fill-opacity:0.99607843;stroke:none;stroke-width:0.1809749px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <g
                id="g6353-5-6-1-1-2"
                transform="matrix(0.07817108,0,0,0.07817108,134.19493,252.24085)">
               <path
                  id="path6347-61-2-07-4-8"
                  d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"
                  style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
               <path
                  style="fill:url(#linearGradient11563);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                  d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
                  id="path6349-1-1-5-6-8" />
               <path
                  id="path6351-4-2-8-9-9"
                  d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"
                  style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             </g>
             <path
                id="path11368-7-6-8"
                d="m 138.36966,146.86624 v 2.052 l 1.77708,-3.078 z"
                style="fill:#9b46bf;fill-opacity:0.99607843;stroke:none;stroke-width:0.1809749px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <path
                id="path11372-4-4-6"
                d="m 138.36966,146.86624 -1.77709,-1.026 1.77709,3.078 z"
                style="fill:#7e409a;fill-opacity:1;stroke:none;stroke-width:0.1809749px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <path
                id="path11374-3-1-8"
                d="m 136.59257,145.84024 1.77709,1.026 1.77708,-1.026 -1.77708,-1.02598 z"
                style="fill:url(#linearGradient11382-1-2-2);fill-opacity:1;stroke:none;stroke-width:0.1809749px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <g
                id="g6353-5-6-1-1-2-3"
                transform="matrix(0.07817108,0,0,0.07817108,130.24587,252.24085)">
               <path
                  id="path6347-61-2-07-4-8-8"
                  d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"
                  style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
               <path
                  style="fill:url(#linearGradient11618);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                  d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
                  id="path6349-1-1-5-6-8-3" />
               <path
                  id="path6351-4-2-8-9-9-3"
                  d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"
                  style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             </g>
             <path
                id="path11372-4"
                d="m 140.34418,148.95874 -1.77708,-1.026 1.77708,3.07799 z"
                style="fill:#7e409a;fill-opacity:1;stroke:none;stroke-width:0.1809749px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <path
                id="path11374-3"
                d="m 138.5671,147.93274 1.77708,1.026 1.77708,-1.026 -1.77708,-1.02599 z"
                style="fill:url(#linearGradient11382-1);fill-opacity:1;stroke:none;stroke-width:0.1809749px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             <g
                id="g6353-5-6-1-1"
                transform="matrix(0.07817108,0,0,0.07817108,132.2204,254.33335)">
               <path
                  id="path6347-61-2-07-4"
                  d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"
                  style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
               <path
                  style="fill:url(#linearGradient11508);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                  d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
                  id="path6349-1-1-5-6" />
               <path
                  id="path6351-4-2-8-9"
                  d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"
                  style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
             </g>
           </g>
         </svg>`,
            order: 4
          };
        });
      }
    });
  });
});