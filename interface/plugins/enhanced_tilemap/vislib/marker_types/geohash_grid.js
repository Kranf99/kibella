'use strict';

define(function (require) {
  return function GeohashGridMarkerFactory(Private) {
    var _ = require('lodash');
    var L = require('leaflet');

    var BaseMarker = Private(require('./base_marker'));

    /**
     * Map overlay: rectangles that show the geohash grid bounds
     *
     * @param map {Leaflet Object}
     * @param geoJson {geoJson Object}
     * @param params {Object}
     */
    _(GeohashGridMarker).inherits(BaseMarker);
    function GeohashGridMarker(map, geoJson, params) {
      var self = this;
      GeohashGridMarker.Super.apply(this, arguments);

      // super min and max from all chart data
      var min = this.getMin();
      var max = this.geoJson.properties.allmax;

      this._createMarkerGroup({
        pointToLayer: function pointToLayer(feature, latlng) {
          var geohashRect = feature.properties.rectangle;
          // get bounds from northEast[3] and southWest[1]
          // corners in geohash rectangle
          var corners = [[geohashRect[3][0], geohashRect[3][1]], [geohashRect[1][0], geohashRect[1][1]]];
          return L.rectangle(corners);
        }
      });
    }

    return GeohashGridMarker;
  };
});
