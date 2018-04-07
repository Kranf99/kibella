define(function (require) {
  var $ = require('jquery');
  var html = require('text!components/clipboard/clipboard.html');
  var module = require('ui/modules').get('kibana');

  module.directive('kbnClipboard', function ($compile, $timeout) {
    return {
      restrict: 'E',
      template: html,
      replace: true,
      transclude: true,
      scope: {
        copy: '='
      },
      link: function ($scope, $el, attr) {
        // debugger;
        // var clipboard = new Clipboard($el[0].children[0]);
        // console.log(attr.copy);

        $scope.tipPlacement = attr.tipPlacement || 'top';
        $scope.tipText = attr.tipText || 'Copy to clipboard';
        $scope.tipConfirm = attr.tipConfirm = 'Copied!';

        $scope.textToCopy = attr.copy.slice(1, attr.copy.length - 1);

        // $scope.shownText = $scope.tipText;

        $el.on('click', function () {
          // $scope.textToCopy = attr.copy.slice(1, attr.copy.length - 1);
        console.log($scope.textToCopy);
          $scope.shownText = $scope.tipConfirm;
          // Reposition tooltip to account for text length change
          $('a', $el).mouseenter();
        });

        $el.on('mouseleave', function () {
          $scope.shownText = $scope.tipText;
        });

        $scope.$on('$destroy', function () {
          $el.off('click');
          $el.off('mouseleave');
        });
      }
    };
  });
});