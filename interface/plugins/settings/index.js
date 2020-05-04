define(function (require, module, exports) {
  var _ = require('lodash');

  require('plugins/settings/styles/main.less');
  require('filters/start_from');

  require('routes')
  .when('/settings', {
    redirectTo: '/settings/indices'
  });

  require('ui/modules').get('apps/settings')
  .directive('kbnSettingsApp', function (Private, $route, timefilter) {
    return {
      restrict: 'E',
      template: require('text!plugins/settings/app.html'),
      transclude: true,
      scope: {
        sectionName: '@section'
      },
      link: function ($scope, $el) {
        timefilter.enabled = false;
        $scope.sections = require('plugins/settings/sections/index');
        $scope.section = _.find($scope.sections, { name: $scope.sectionName });

        $scope.sections.forEach(function (section) {
          section.class = (section === $scope.section) ? 'active' : void 0;
        });
      }
    };
  });

  var apps = require('ui/registry/apps');
  apps.register(function SettingsAppModule() {
    return {
      id: 'settings',
      name: 'Settings',
      icon:  `<svg
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:cc="http://creativecommons.org/ns#"
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
      width="0.71600527in"
      height="0.62992144in"
      viewBox="0 0 18.186534 16.000004"
      version="1.1"
      id="svg8"
      inkscape:version="0.92.3 (2405546, 2018-03-11)"
      sodipodi:docname="settings.svg">
      <defs
        id="defs2">
      <linearGradient
          id="linearGradient6220">
        <stop
            style="stop-color:#9745ba;stop-opacity:0.89411765"
            offset="0"
            id="stop6216" />
        <stop
            style="stop-color:#d473ff;stop-opacity:1"
            offset="1"
            id="stop6218" />
      </linearGradient>
      <linearGradient
          xlink:href="#linearGradient6220"
          id="linearGradient11723"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"
          x1="112.58333"
          y1="-1378"
          x2="95.262817"
          y2="-1388" />
      <linearGradient
          xlink:href="#linearGradient6220"
          id="linearGradient11826"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1935.5625)"
          x1="112.58333"
          y1="-1378"
          x2="95.262817"
          y2="-1388" />
      <linearGradient
          xlink:href="#linearGradient6220"
          id="linearGradient11828"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-0.4374999,-0.75777205,0.75777205,-0.4374999,1197.388,-1988.0626)"
          x1="112.58333"
          y1="-1378"
          x2="95.262817"
          y2="-1388" />
      <linearGradient
          inkscape:collect="always"
          xlink:href="#linearGradient6220"
          id="linearGradient842"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-0.4374999,-0.75777205,0.75777205,-0.4374999,1386.8319,-1966.1875)"
          x1="129.90404"
          y1="-1367.9998"
          x2="86.602585"
          y2="-1392.9999" />
      <linearGradient
          inkscape:collect="always"
          xlink:href="#linearGradient6220"
          id="linearGradient876"
          x1="346.41119"
          y1="-1505.5006"
          x2="346.41119"
          y2="-1470.5004"
          gradientUnits="userSpaceOnUse" />
      <linearGradient
          inkscape:collect="always"
          xlink:href="#linearGradient6220"
          id="linearGradient894"
          x1="101.65766"
          y1="116.51202"
          x2="101.13805"
          y2="118.01202"
          gradientUnits="userSpaceOnUse" />
      <linearGradient
          inkscape:collect="always"
          xlink:href="#linearGradient6220"
          id="linearGradient904"
          x1="93.863434"
          y1="117.41202"
          x2="93.863434"
          y2="119.81201"
          gradientUnits="userSpaceOnUse" />
      <linearGradient
          inkscape:collect="always"
          xlink:href="#linearGradient6220"
          id="linearGradient934"
          x1="93.343819"
          y1="120.71201"
          x2="93.343819"
          y2="123.11201"
          gradientUnits="userSpaceOnUse" />
      </defs>
      <sodipodi:namedview
        id="base"
        pagecolor="#ffffff"
        bordercolor="#666666"
        borderopacity="1.0"
        inkscape:pageopacity="0.0"
        inkscape:pageshadow="2"
        inkscape:zoom="5.6"
        inkscape:cx="71.043667"
        inkscape:cy="30.893678"
        inkscape:document-units="mm"
        inkscape:current-layer="g11824"
        showgrid="true"
        inkscape:window-width="1920"
        inkscape:window-height="1027"
        inkscape:window-x="-8"
        inkscape:window-y="-8"
        inkscape:window-maximized="1"
        units="in"
        fit-margin-top="0"
        fit-margin-left="0"
        fit-margin-right="0"
        fit-margin-bottom="0">
      <inkscape:grid
          type="axonomgrid"
          id="grid882"
          units="mm"
          empspacing="5"
          originx="-26.846789"
          originy="-270.49998" />
      </sodipodi:namedview>
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
        inkscape:label="Calque 1"
        inkscape:groupmode="layer"
        id="layer1"
        transform="translate(-26.846787,-10.500004)">
      <g
          id="layer1-1"
          transform="matrix(1.6666668,0,0,1.6666668,-232.85591,-115.6629)">
        <g
            id="g11824"
            transform="translate(64.036633,-38.114282)">
          <g
              id="g6353-5-6-1-3-5"
              transform="matrix(0.06857115,0,0,0.06857115,76.864618,216.74592)">
            <path
                inkscape:connector-curvature="0"
                id="path840"
                d="m 278.21135,-1422.3752 -15.15544,-8.75 60.62202,-35.0002 15.15551,8.7501 z"
                style="fill:url(#linearGradient842);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
            <path
                style="fill:#9b46bf;fill-opacity:0.99607843;stroke:none;stroke-width:2.31511331px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                d="m 263.05591,-1413.6252 v 26.2501 l -22.73326,13.1251 7.57775,13.125 22.73326,-13.125 7.57775,-21.8751 60.3691,-34.8541 7.83068,12.979 22.73325,-13.1251 7.57776,-21.875 -22.73326,13.125 v -26.2501 l 22.73326,-13.125 -7.57776,-13.1251 -22.73325,13.1251 -7.57776,21.875 -60.62202,35.0002 -15.1555,-8.7501 -22.73326,13.1251 -7.57775,21.8751 z"
                id="path844"
                inkscape:connector-curvature="0"
                sodipodi:nodetypes="ccccccccccccccccccccc" />
            <path
                style="fill:#7e409a;fill-opacity:1;stroke:none;stroke-width:2.31511331px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                d="m 338.83343,-1457.3754 7.57776,-21.875 -15.1555,-8.7501 -7.57776,21.8751 z"
                id="path862"
                inkscape:connector-curvature="0" />
            <path
                style="fill:#7e409a;fill-opacity:1;stroke:none;stroke-width:2.31511331px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                d="m 346.41119,-1418.0002 -7.57776,-13.1251 -7.57774,4.3751 z"
                id="path866"
                inkscape:connector-curvature="0" />
            <path
                style="fill:url(#linearGradient876);fill-opacity:1;stroke:none;stroke-width:2.31511331px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                d="m 331.25569,-1488.0005 22.73326,-13.125 15.15549,8.75 -22.73325,13.1251 z"
                id="path868"
                inkscape:connector-curvature="0" />
          </g>
          <path
              style="fill:url(#linearGradient894);fill-opacity:1;stroke:none;stroke-width:0.15874998px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 102.69689,117.11202 -1.03923,-0.6 -0.51961,0.3 v 1.2 z"
              id="path886"
              inkscape:connector-curvature="0" />
          <path
              style="fill:url(#linearGradient904);fill-opacity:1;stroke:none;stroke-width:0.15874998px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 94.902664,118.61202 -1.03923,-0.6 -1.558845,0.9 1.039229,0.6 z"
              id="path896"
              inkscape:connector-curvature="0" />
          <path
              style="fill:#7e409a;fill-opacity:1;stroke:none;stroke-width:0.15874998px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 93.343818,119.51202 -1.039229,-0.6 -0.519616,1.5 1.03923,0.6 z"
              id="path906"
              inkscape:connector-curvature="0"
              sodipodi:nodetypes="ccccc" />
          <path
              style="fill:#7e409a;fill-opacity:1;stroke:none;stroke-width:0.15874998px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 94.902664,121.61202 -1.03923,-0.6 v -0.6 l 1.03923,-0.6 z"
              id="path916"
              inkscape:connector-curvature="0" />
          <path
              style="fill:url(#linearGradient934);fill-opacity:1;stroke:none;stroke-width:0.15874998px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 93.863434,121.01202 -1.558846,0.9 1.039231,0.6 1.558845,-0.9 z"
              id="path926"
              inkscape:connector-curvature="0"
              sodipodi:nodetypes="ccccc" />
          <path
              style="fill:#7e409a;fill-opacity:1;stroke:none;stroke-width:0.15874998px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 93.863434,123.41202 -1.03923,-0.6 -0.519615,-0.9 1.039229,0.6 z"
              id="path952"
              inkscape:connector-curvature="0" />
        </g>
      </g>
      </g>
      </svg>`,
      order: 3
    };
  });
});
