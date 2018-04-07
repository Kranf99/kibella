'use strict';

define(function (require) {
  return function ScaledCircleMarkerFactory(Private) {
    var _ = require('lodash');
    var L = require('leaflet');

    var BaseMarker = Private(require('./base_marker'));

    /**
     * Map overlay: circle markers that are scaled to illustrate values
     *
     * @param map {Leaflet Object}
     * @param mapData {geoJson Object}
     * @param params {Object}
     */
    _(ScaledCircleMarker).inherits(BaseMarker);
    function ScaledCircleMarker(map, geoJson, params) {
      var self = this;
      ScaledCircleMarker.Super.apply(this, arguments);

      // Earth circumference in meters
      var earthCircumference = 40075017;
      var mapZoom = map.getZoom();
      var latitudeRadians = map.getCenter().lat * (Math.PI / 180);
      this._metersPerPixel = earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, mapZoom + 8);

      this._createMarkerGroup({
        pointToLayer: function pointToLayer(feature, latlng) {
          var scaledRadius = self._radiusScale(feature);
          return L.circleMarker(latlng).setRadius(2);
        }
      });
    }

    /**
     * _geohashMinDistance returns a min distance in meters for sizing
     * circle markers to fit within geohash grid rectangle
     *
     * @method _geohashMinDistance
     * @param feature {Object}
     * @return {Number}
     */
    ScaledCircleMarker.prototype._geohashMinDistance = function (feature) {
      var centerPoint = _.get(feature, 'properties.center');
      var geohashRect = _.get(feature, 'properties.rectangle');

      // centerPoint is an array of [lat, lng]
      // geohashRect is the 4 corners of the geoHash rectangle
      //   an array that starts at the southwest corner and proceeds
      //   clockwise, each value being an array of [lat, lng]

      // center lat and southeast lng
      var east = L.latLng([centerPoint[0], geohashRect[2][1]]);
      // southwest lat and center lng
      var north = L.latLng([geohashRect[3][0], centerPoint[1]]);

      // get latLng of geohash center point
      var center = L.latLng([centerPoint[0], centerPoint[1]]);

      // get smallest radius at center of geohash grid rectangle
      var eastRadius = Math.floor(center.distanceTo(east));
      var northRadius = Math.floor(center.distanceTo(north));
      return _.min([eastRadius, northRadius]);
    };

    /**
     * _radiusScale returns the radius (in pixels) of the feature based on its
     * value.  The radius fits within the geohash bounds of the feature to
     * avoid overlapping.
     *
     * @method _scaleValueBetween
     * @param feature {Object} - The feature
     * @return {Number}
     */
    ScaledCircleMarker.prototype._radiusScale = function (feature) {
      var radius = this._geohashMinDistance(feature);
      var orgMin = this.getMin();
      var orgMax = this.geoJson.properties.allmax;
      // Don't let the circle size get any smaller than one-third the max size
      var min = orgMax / 3;
      var max = orgMax;
      var value = this._scaleValueBetween(feature.properties.value, min, max, orgMin, orgMax);
      return radius * (value / max) / this._metersPerPixel;
    };

    /**
     * _scaleValueBetween returns the given value between the new min and max based
     * on the original scale
     *
     * @method _scaleValueBetween
     * @param value {Number} - The value to scale
     * @param min {Number} - The new minimum
     * @param max {Number} - The new maximum
     * @param orgMin {Number} - The original minimum
     * @param orgMax {Number} - The original maximum
     * @return {Number}
     */
    ScaledCircleMarker.prototype._scaleValueBetween = function (value, min, max, orgMin, orgMax) {
      return orgMin != orgMax ? (max - min) * (value - orgMin) / (orgMax - orgMin) + min : value;
    };

    return ScaledCircleMarker;
  };
});
