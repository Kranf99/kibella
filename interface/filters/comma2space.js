// Format number replacing comma with spaces
define(function (require) {
  require('ui/modules')
    .get('kibana')
    .filter('comma2space', function () {
      return function (value) {
        return value?value.toString().split(',').join(' '):null;
      };
    });
});
