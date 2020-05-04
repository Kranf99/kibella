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
      icon: `<svg
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:cc="http://creativecommons.org/ns#"
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      id="svg8"
      version="1.1"
      viewBox="-0.6 0 6.4630595 8.8705318"
      height="14.78422mm"
      width="10.771767mm">
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
          id="linearGradient11862"
          xlink:href="#linearGradient6220" />
       <linearGradient
          y2="-1388"
          x2="95.262817"
          y1="-1378"
          x1="112.58333"
          gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"
          gradientUnits="userSpaceOnUse"
          id="linearGradient11901"
          xlink:href="#linearGradient6220" />
       <linearGradient
          y2="-1388"
          x2="95.262817"
          y1="-1378"
          x1="112.58333"
          gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"
          gradientUnits="userSpaceOnUse"
          id="linearGradient11935"
          xlink:href="#linearGradient6220" />
       <linearGradient
          y2="-1388"
          x2="95.262817"
          y1="-1378"
          x1="112.58333"
          gradientTransform="matrix(-0.4374999,-0.75777206,0.75777206,-0.4374999,1197.3881,-1918.0624)"
          gradientUnits="userSpaceOnUse"
          id="linearGradient11969"
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
        transform="translate(-141.63232,-85.270295)"
        id="layer1">
       <g
          id="g6353-5-6-8"
          transform="matrix(0.21207,0,0,0.21207,122.2424,382.27433)">
         <g
            id="g11867-7-3-1"
            transform="translate(-2.5293308e-6,20.771118)">
           <path
              style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 15.15545,-8.75 -0.16517,3.5572 -15.15545,8.75 z"
              id="path6347-61-2-7-9-0-5" />
           <path
              id="path6349-1-1-0-3-1-4"
              d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
              style="fill:url(#linearGradient11969);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
           <path
              style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 -0.16517,3.5572 -15.155445,-8.75 0.165171,-3.5572 z"
              id="path6351-4-2-86-9-7-9" />
         </g>
         <g
            id="g11867-7-3"
            transform="translate(-2.5293308e-6,13.847403)">
           <path
              style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 15.15545,-8.75 -0.16517,3.5572 -15.15545,8.75 z"
              id="path6347-61-2-7-9-0" />
           <path
              id="path6349-1-1-0-3-1"
              d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
              style="fill:url(#linearGradient11935);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
           <path
              style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 -0.16517,3.5572 -15.155445,-8.75 0.165171,-3.5572 z"
              id="path6351-4-2-86-9-7" />
         </g>
         <g
            id="g11867-7"
            transform="translate(-2.5293281e-6,6.9236879)">
           <path
              style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 15.15545,-8.75 -0.16517,3.5572 -15.15545,8.75 z"
              id="path6347-61-2-7-9" />
           <path
              id="path6349-1-1-0-3"
              d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
              style="fill:url(#linearGradient11901);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
           <path
              style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 -0.16517,3.5572 -15.155445,-8.75 0.165171,-3.5572 z"
              id="path6351-4-2-86-9" />
         </g>
         <g
            id="g11867">
           <path
              style="fill:#9b47bf;fill-opacity:0.99607843;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 15.15545,-8.75 -0.16517,3.5572 -15.15545,8.75 z"
              id="path6347-61-2-7" />
           <path
              id="path6349-1-1-0"
              d="m 103.92307,-1383 -15.155443,-8.75 15.155443,-8.75 15.15544,8.75 z"
              style="fill:url(#linearGradient11862);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
           <path
              style="fill:#7e409a;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.23151036px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              d="m 103.92307,-1383 -0.16517,3.5572 -15.155445,-8.75 0.165171,-3.5572 z"
              id="path6351-4-2-86" />
         </g>
       </g>
     </g>
   </svg>
   
   `,
      order: 0
    };
  });
});
