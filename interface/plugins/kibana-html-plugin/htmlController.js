define(function (require) {
  window.CodeMirror = require('./codemirror/codemirror');
  require('./codemirror/codemirror.css');
  require('./codemirror/mode/htmlmixed');
  require('ui-codemirror');

  var module = require('ui/modules').get('kibana/kibana-html-plugin', ['kibana', 'ui.codemirror']);
  module.controller('KbnHtmlEditController', ['$scope', 'htmlFactory', function($scope, htmlFactory) {

    $scope.codemirrorLoaded = function(editor) {
      editor.focus();

      htmlFactory.html = editor.getValue();
      htmlFactory.setEditorText = function(){
        editor.setValue(htmlFactory.html);
      };

      editor.on("change", function(){
        htmlFactory.html = $scope.vis.params.html = editor.getValue();
      });
    }

    $scope.editorOptions = {
      onLoad: $scope.codemirrorLoaded,
      mode: "htmlmixed",
      startHeight: 50,
      indentUnit: 2,
      indentWithTabs: false,
      smartIndent: true,
      tabSize: 4,
      electricChars: true,
      inputStyle: "textarea",
      spellcheck: false,
      rtlMoveVisually: false,
      wholeLineUpdateBefore: true,
      lineWrapping: false,
      gutters: [],
      fixedGutter: true,
      coverGutterNextToScrollbar: false,
      scrollbarStyle: "native",
      lineNumbers: false,
      firstLineNumber: 1,
      showCursorWhenSelecting: false,
      resetSelectionOnContextMenu: true,
      lineWiseCopyCut: true,
      readOnly: false,
      disableInput: false,
      dragDrop: true,
      cursorBlinkRate: 530,
      cursorScrollMargin: 0,
      cursorHeight: 1,
      singleCursorHeightPerLine: true,
      workTime: 100,
      workDelay: 100,
      flattenSpans: true,
      addModeClass: false,
      pollInterval: 100,
      undoDepth: 200,
      historyEventDelay: 1250,
      viewportMargin: 10,
      maxHighlightLength: 10000
    };

    $scope.$parent.$parent.sidebar.section = "options";
  }]);
  
  module.factory('htmlFactory', function() {
    return {
      html: '',
      setEditorText: function() {} // inited by KbnHtmlEditController
    }
  });

  module.controller('KbnHtmlVisController', function ($scope, $sce, htmlFactory) {
    htmlFactory.html = $scope.vis.params.html || '';
    htmlFactory.setEditorText(htmlFactory.html);

    // On drawing (init or update), display the html inside the `html` param
    $scope.$watch('vis.params.html', function (html) {
      if (!html) return;
      $scope.html = $sce.trustAsHtml(html);
    });
  });
});
