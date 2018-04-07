define(function (require) {
  var _ = require('lodash');
  var wrapRouteWithPrep = require('utils/routes/_wrap_route_with_prep');

  require('components/setup/setup');
  require('services/promises');

  function RouteManager() {
    var when = [];
    var defaults = [];
    var otherwise;

    return {
      when: function (path, route) {
        when.push([path, route]);
        return this;
      },
      // before attaching the routes to the routeProvider, test the RE
      // against the .when() path and add/override the resolves if there is a match
      defaults: function (RE, def) {
        defaults.push([RE, def]);
        return this;
      },
      otherwise: function (route) {
        otherwise = route;
        return this;
      },
      config: function ($routeProvider) {
        var resolver = {
          load: function(kbnPath, $q, $http, $location, $route) {
            var loginPath = kbnPath + '/public/users/login/index.php';
            var dashboard = false;
            
            if($route.current.$$route.originalPath === "/dashboard/:id")
              dashboard = true;
              
            var defer = $q.defer();

            $http.post(kbnPath + '/JSON_SQL_Bridge/users/actions/isLoggedIn.php').then(function(res) {
              if(!res.data) {
                if(dashboard) {
                  $http.post(kbnPath + '/JSON_SQL_Bridge/dashboard/actions/isShared.php', { id: $route.current.params.id }).then(function(_res) {
                    if(_res.data !== "1") {
                      window.location = loginPath;
                      defer.resolve(false);
                    } else {
                      defer.resolve(true);
                    }
                  });
                } else {
                  window.location = loginPath;
                  defer.resolve(false);
                }
              } else {
                defer.resolve(true);
              }
            });

            return defer.promise;
          }
        }


        when.forEach(function (args) {
          var path = args[0];
          var route = args[1] || {};

          if(!route.resolve)
            route.resolve = resolver;
          else
            route.resolve.load = resolver.load;
          

          // merge in any defaults
          defaults.forEach(function (args) {
            if (args[0].test(path)) {
              _.merge(route, args[1]);
            }
          });

          if (route.reloadOnSearch === void 0) {
            route.reloadOnSearch = false;
          }

          wrapRouteWithPrep(route);
          $routeProvider.when(path, route);
        });

        if (otherwise) {
          wrapRouteWithPrep(otherwise);
          $routeProvider.otherwise(otherwise);
        }
      },
      RouteManager: RouteManager
    };
  }

  return new RouteManager();
});
