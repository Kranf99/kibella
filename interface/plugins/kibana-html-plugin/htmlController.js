define(function (require) {
  window.CodeMirror = require('./codemirror/codemirror');
  require('./codemirror/codemirror.css');
  require('./codemirror/mode/htmlmixed');
  require('ui-codemirror');

  var module = require('ui/modules').get('kibana/kibana-html-plugin', ['kibana', 'ui.codemirror']);
  module.controller('KbnHtmlEditController', ['$scope', 'htmlFactory', function($scope, htmlFactory) {
    $scope.editorOptions = {
        mode: 'htmlmixed',
        startHeight: 50
    };

    $scope.codemirrorLoaded = function(editor) {
      editor.focus();
      
      htmlFactory.html = editor.getValue();
      htmlFactory.setEditorText = function(text){
        editor.setValue(htmlFactory.html);
      };

      editor.on("change", function(){
        htmlFactory.html = editor.getValue();
        htmlFactory.notifyObservers();
      });
    }

    $scope.$parent.$parent.sidebar.section = "options";
  }]);
  
  module.factory('htmlFactory', function() {
    var observerCallbacks = [];
    
    return {
      html: '',
      default: '<i>italic</i> and <b>bold</b>',
      setEditorText: function() {},
      registerObserverCallback: function(callback){
        observerCallbacks.push(callback);
      },
      notifyObservers: function(){
        angular.forEach(observerCallbacks, function(callback){
          callback();
        });
      }
    }
  });

  module.controller('KbnHtmlVisController', function ($scope, $sce, htmlFactory) {
    htmlFactory.html = $scope.vis.params.html ? $scope.vis.params.html : htmlFactory.default;
    htmlFactory.setEditorText(htmlFactory.html);

    var update_html = function(){
      $scope.vis.params.html = htmlFactory.html;
      $scope.html = $sce.trustAsHtml($scope.vis.params.html);
    };

    update_html();

    htmlFactory.registerObserverCallback(update_html);

  });
});
