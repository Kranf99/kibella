define(function(require) {
  var $ = require('jquery');

  require('bootstrap');
  require('./lib/bootstrap-toc/bootstrap-toc.min.css');
  require('./lib/bootstrap-toc/bootstrap-toc.js');

  require('style-loader!css-loader!less-loader!./guide.less');

  var app = require("ui/modules").get("app/guide", [
    'elasticsearch',
    'ngRoute',
    'kibana/courier',
    'kibana/config',
    'kibana/notify',
    'kibana/typeahead'
  ]);

  app.directive('guideText', function ($location) {
    return {
      restrict: 'EA',
      template: require("text!./guide.html")
  }});

  require("routes").when("/guide", {
    controller: "guideController",
    template: require("text!./index.html")
  });

  app.controller("guideController", function($scope, $anchorScroll, $compile, $location) {

    var navSelector = "#toc";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
      offset: 10
    });
    $compile($myNav)($scope);
  
    $("#toc").affix({
      offset:{}
    });

    $scope.goto = function(id) {
        id = id.substr(1);
        $location.hash(id);

        $anchorScroll();
    };
    $scope.init = function() {
      $anchorScroll();
    }
  });

  var apps = require("ui/registry/apps");
  apps.register(function GuideAppModule() {
    return {
      id: "guide",
      name: "Guide",
      icon: `<svg
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:cc="http://creativecommons.org/ns#"
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      id="svg8"
      version="1.1"
      viewBox="0 0 5.1961534 10.200001"
      height="17.000002mm"
      width="8.6602564mm">
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
          y2="-1388"
          x2="95.262817"
          y1="-1378"
          x1="112.58333"
          gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"
          gradientUnits="userSpaceOnUse"
          id="linearGradient11723"
          xlink:href="#linearGradient6220" />
       <linearGradient
          y2="-1388"
          x2="95.262817"
          y1="-1378"
          x1="112.58333"
          gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1935.5625)"
          gradientUnits="userSpaceOnUse"
          id="linearGradient11826"
          xlink:href="#linearGradient6220" />
       <linearGradient
          y2="-1388"
          x2="95.262817"
          y1="-1378"
          x1="112.58333"
          gradientTransform="matrix(-0.4374999,-0.75777205,0.75777205,-0.4374999,1197.388,-1988.0626)"
          gradientUnits="userSpaceOnUse"
          id="linearGradient11828"
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
        transform="translate(-145.94891,-76.597733)"
        id="layer1">
       <g
          transform="translate(64.036633,-38.114282)"
          id="g11824">
         <g
            transform="matrix(0.06857115,0,0,0.06857115,76.86462,218.54592)"
            id="g6353-5-6-1-3">
           <path
              style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"
              id="path6347-61-2-07-3" />
           <path
              id="path6349-1-1-5-7"
              d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
              style="fill:url(#linearGradient11723);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
           <path
              style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"
              id="path6351-4-2-8-3" />
         </g>
         <g
            transform="matrix(0.06857115,0,0,0.06857115,76.864618,216.74592)"
            id="g6353-5-6-1-3-5">
           <path
              style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1400.5001 15.15545,-8.75 15.15556,-8.75 v -26.5828 -8.4173 l -30.31101,17.5 v 8.7501 l -15.155504,8.75 -3e-6,-26.2501 60.622017,-35.0002 v 70.0003 l -30.31106,17.5 v 17.5001 l -15.15545,8.75 z"
              id="path6347-61-2-07-3-2" />
           <path
              id="path6349-1-1-5-7-6"
              d="m 103.92307,-1400.5001 -15.15544,-8.75 30.31094,-17.5001 15.15551,8.7501 z"
              style="fill:url(#linearGradient11826);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
           <path
              style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1400.5001 v 35.0001 l -15.155445,-8.75 2e-6,-35.0001 z"
              id="path6351-4-2-8-3-5" />
           <path
              style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 134.23408,-1453.0003 v 35.0002 l -15.15546,-8.75 -5e-5,-17.5002 z"
              id="path6351-4-2-8-3-5-8" />
           <path
              style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 88.767543,-1444.2501 2.3e-5,26.25 -15.155457,-8.75 -6.9e-5,-26.2501 z"
              id="path6351-4-2-8-3-5-7" />
           <path
              id="path6349-1-1-5-7-6-4"
              d="m 88.767498,-1444.2503 -15.155436,-8.75 60.622018,-35.0002 15.15551,8.7501 z"
              style="fill:url(#linearGradient11828);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
         </g>
       </g>
     </g>
   </svg>
   `,
      order: 4
    };
  });
});
