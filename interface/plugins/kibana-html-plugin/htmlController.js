define(function (require) {
  window.CodeMirror = require('./codemirror/codemirror');
  require('./codemirror/codemirror.css');
  require('./codemirror/mode/htmlmixed');
  require('ui-codemirror');

  var queryFilter = null;

  const variables = [
    html_widget_variable ("user_login", "Login of the current user", function($rootScope) {
      return  $rootScope.user.email || '';
    }),
    html_widget_variable ("drilldowns", "A JSON array of current drilldowns", function($rootScope) {
      var filters = queryFilter.getFilters();

      filters.map(function(filter, i) {
        Object.keys(filter).map(function(key) {
          if(key[0] === '$') delete filters[i][key];
        })
      })

      return JSON.stringify(filters);
    }),
  ]

  var module = require('ui/modules').get('kibana/kibana-html-plugin', ['kibana', 'ui.codemirror'], function($compileProvider) {
    // Configure new 'compile' directive by passing a directive
    // factory function. The factory function injects '$compile'.
    $compileProvider.directive('compile', function($compile) {
      // The directive factory creates a link function.
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
            // Watch the 'compile' expression for changes.
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // When the 'compile' expression changes
            // assign it into the current DOM.
            element.html(value);

            // Compile the new DOM and link it to the current scope.
            // NOTE: we only compile '.childNodes' so that we
            // don't get into an infinite loop compiling ourselves.
            $compile(element.contents())(scope);
          }
        );
      };
    });
  });

  module.controller('KbnHtmlEditController', ['$scope', '$sce', 'htmlFactory', '$compile', 'Private', function($scope, $sce, htmlFactory, $compile, Private) {
    $scope.selected_variable = null;
    $scope.variables = variables;

    $scope.codemirrorLoaded = function(editor) {
      editor.focus();
      
      htmlFactory.html = editor.getValue();
      htmlFactory.setEditorText = function(){
        editor.setValue(htmlFactory.html);
      };

      $scope.$watch('selected_variable', function (selected_variable) {
        if(!selected_variable) return;
        var doc = editor.getDoc();
        doc.replaceSelection('{{'+selected_variable+'}}');
        $scope.selected_variable = null;
      });

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

  function html_widget_variable (name, desc, get) {
    return {
      name: name,
      desc: desc || "",
      value: null,
      get: get || function get_variable_value () {
        return ""
      },
    }
  } 

  module.controller('KbnHtmlVisController', function ($scope, $sce, htmlFactory, $compile, kbnPath, $http, $rootScope, Private) {
    queryFilter = Private(require('components/filter_bar/query_filter'));
    htmlFactory.html = $scope.vis.params.html || '';
    htmlFactory.setEditorText(htmlFactory.html);

    $scope.variables = variables;

    function retrieveVariables(variables) {
      variables.map(function(variable) {
        $scope.variables[variable.name] = variable.get($rootScope)
      })
    }

    retrieveVariables($scope.variables)

    function update(html) {
      html = html || $scope.vis.params.html;
      if (!html) return;
      
      var processed_html = html.replace(/(\{\{[a-zA-Z_-].*?\}\})/g, function(match, num) {
        var varname = match.slice(2,match.length-2);
        var variable = variables.reduce(function(acc, v) {
          return acc !== null ? acc : (v.name === varname ? v : acc);
        }, null)
        
        return variable !== null ? variable.get($rootScope) : '';
      })

      $scope.html = $sce.trustAsHtml(processed_html);
    }

    // On drawing (init or update), display the html inside the `html` param
    $scope.$watch('vis.params.html', update);
    $scope.$watch('esResponse', function(resp) {
      update();
    });
  });
});
