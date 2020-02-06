define(function (require) {
  require('css!plugins/visualize/styles/main.css');

  require('plugins/visualize/editor/editor');
  require('plugins/visualize/wizard/wizard');

  require('routes')
  .when('/visualize', {
    redirectTo: '/visualize/step/1'
  });

  var apps = require('ui/registry/apps');
  apps.register(function VisualizeAppModule() {
    return {
      id: 'visualize',
      name: 'Visualize',
      icon: `<svg
      style="width: 25px;"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:cc="http://creativecommons.org/ns#"
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="9.8589878mm"
      height="11.384176mm"
      viewBox="0 0 5.9153923 6.8305057"
      version="1.1"
      id="svg8">
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
          id="linearGradient6252"
          gradientUnits="userSpaceOnUse"
          x1="112.58333"
          y1="-1378"
          x2="95.262817"
          y2="-1388"
          gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)" />
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
        id="layer1"
        transform="translate(-139.97663,-77.933117)">
        <g
          transform="matrix(0.19515731,0,0,0.19515731,122.65298,351.25093)"
          id="g6353-5-6">
          <path
            style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="m 103.92307,-1383 15.15545,-8.75 v 17.5 l -15.15545,8.75 z"
            id="path6347-61-2" />
          <path
            id="path6349-1-1"
            d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
            style="fill:url(#linearGradient6252);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
          <path
            style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="m 103.92307,-1383 v 17.5 l -15.155445,-8.75 1e-6,-17.5 z"
            id="path6351-4-2" />
        </g>
      </g>
    </svg>
      `,
      order: 1
    };
  });
});