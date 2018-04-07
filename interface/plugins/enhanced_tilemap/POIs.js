'use strict';

var _markerIcon = require('plugins/enhanced_tilemap/vislib/markerIcon');

var _ = require('lodash');
var L = require('leaflet');


define(function (require) {
  return function POIsFactory(Private, savedSearches) {

    var SearchSource = Private(require('components/courier/data_source/search_source'));
    var queryFilter = Private(require('components/filter_bar/query_filter'));

    /**
     * Points of Interest
     *
     * Turns saved search results into easily consumible data for leaflet.
     */
    function POIs(params) {
      this.savedSearchId = params.savedSearchId;
      this.geoField = params.geoField;
      //remain backwards compatible
      if (!params.geoField && params.geoPointField) {
        this.geoField = params.geoPointField;
      }
      this.labelField = _.get(params, 'labelField', null);
      this.limit = _.get(params, 'limit', 100);
      this.syncFilters = _.get(params, 'syncFilters', false);
    }

    /**
     * @param {options} options: styling options
     * @param {Function} callback(layer)
          layer {ILayer}: Leaflet ILayer containing the results of the saved search
     */
    POIs.prototype.getLayer = function (options, callback) {
      var _this = this;

      var self = this;
      savedSearches.get(this.savedSearchId).then(function (savedSearch) {
        var geoType = savedSearch.searchSource._state.index.fields.byName[self.geoField].type;
        var searchSource = new SearchSource();
        if (_this.syncFilters) {
          searchSource.inherits(savedSearch.searchSource);
          searchSource.filter(queryFilter.getFilters());
        } else {
          //Do not filter POIs by time so can not inherit from rootSearchSource
          searchSource.inherits(false);
          searchSource.index(savedSearch.searchSource._state.index);
          searchSource.query(savedSearch.searchSource.get('query'));
          searchSource.filter(savedSearch.searchSource.get('filter'));
        }
        searchSource.size(_this.limit);
        searchSource.source(_.compact([_this.geoField, _this.labelField]));
        searchSource.fetch().then(function (searchResp) {
          callback(self._createLayer(searchResp.hits.hits, geoType, options));
        });
      });
    };

    POIs.prototype._createLayer = function (hits, geoType, options) {
      var _this2 = this;

      layer = null;
      if ('geo_point' === geoType) {
        var markers = _.map(hits, function (hit) {
          return _this2._createMarker(hit, options);
        });
        layer = new L.FeatureGroup(markers);
      } else if ('geo_shape' === geoType) {
        var shapes = _.map(hits, function (hit) {
          return {
            type: 'Feature',
            properties: {
              label: _.get(hit._source, _this2.labelField)
            },
            geometry: hit._source[_this2.geoField]
          };
        });
        layer = L.geoJson(shapes, {
          onEachFeature: function onEachFeature(feature, thisLayer) {
            if (feature.properties.label) {
              thisLayer.bindPopup('<div>' + feature.properties.label + '</div>');
              thisLayer.on('mouseover', function (e) {
                this.openPopup();
              });
              thisLayer.on('mouseout', function (e) {
                this.closePopup();
              });
            }
          },
          pointToLayer: function pointToLayer(feature, latlng) {
            return L.circleMarker(latlng, {
              radius: 6
            });
          },
          style: {
            color: options.color,
            weight: 1.5,
            opacity: 0.65
          }
        });
      } else {
        console.warn('Unexpected feature geo type: ' + geoType);
      }
      return layer;
    };

    POIs.prototype._createMarker = function (hit, options) {
      var feature = L.marker(extractLatLng(hit._source[this.geoField]), {
        icon: (0, _markerIcon.markerIcon)(options.color, options.size)
      });
      if (this.labelField) {
        feature.bindPopup('<div>' + hit._source[this.labelField] + '</div>');
        feature.on('mouseover', function (e) {
          this.openPopup();
        });
        feature.on('mouseout', function (e) {
          this.closePopup();
        });
      }
      return feature;
    };

    //Extract lat and lon from geo, geo can be an array, string, or object
    function extractLatLng(geo) {
      var lat = 0;
      var lon = 0;
      if (_.isArray(geo)) {
        lat = geo[1];
        lon = geo[0];
      } else if (isString(geo)) {
        var split = geo.split(',');
        lat = split[0];
        lon = split[1];
      } else if (_.has(geo, 'lat') && _.has(geo, 'lon')) {
        lat = geo.lat;
        lon = geo.lon;
      }
      return L.latLng(lat, lon);
    }

    function isString(myVar) {
      var isString = false;
      if (typeof myVar === 'string' || myVar instanceof String) {
        isString = true;
      }
      return isString;
    }

    return POIs;
  };
});
