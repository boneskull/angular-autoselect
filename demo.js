(function (angular) {
  'use strict';

  /**
   * Example data
   */
  var examples = [
    {
      id: 'auto-select-all-text',
      title: 'Auto-Select All Text',
      html: '<textarea ng-model="data.pomo_nonsense" auto-select></textarea>',
      description: 'This example auto-selects all text in a field upon model update.'
    },
    {
      id: 'auto-select-all-text-once',
      title: 'Auto-Select All Text (Once)',
      html: '<textarea ng-model="data.pomo_nonsense" auto-select="{once: true}"></textarea>',
      description: 'This example auto-selects all text in a field upon model update, but will only do this the first time the input field receives a value. Resetting will have no effect on the selection until the markup is removed and re-added to the DOM.'
    },
    {
      id: 'auto-select-range',
      title: 'Auto-Select Range',
      html: '<textarea ng-model="data.pomo_nonsense" auto-select="{start: 10, end: 20}">',
      description: 'This example shows how a portion of text can be selected based on character index.'
    },
    {
      id: 'auto-select-substring',
      title: 'Auto-Select Substring',
      html: '<textarea ng-model="data.pomo_nonsense" auto-select="{match: \'thematizes\'}">',
      description: 'This example shows how a substring can be selected.'
    },
    {
      id: 'auto-select-regexp',
      title: 'Auto-Select Regular Expression',
      html: '<textarea ng-model="data.pomo_nonsense" auto-select="{match: data.regex}">',
      description: 'This example shows how a <code>RegExp</code> can be used to perform a selection.  Note that you cannot declare a <code>RegExp</code> object within an AngularJS expression.',
      js: '$scope.data = {regex: /(of\\s.+\\sboundaries|eht)/};'
    }
  ];

  /**
   * Puts the templates into the template cache
   */
  var run = function run($templateCache) {
    angular.forEach(examples, function (example) {
      $templateCache.put(example.id + '-template', example.html);
      $templateCache.put(example.id + '-description', example.description);
    });
  };
  run.$inject = ['$templateCache'];

  /**
   * Controls a singular example
   */
  var ExampleCtrl = function ExampleCtrl($scope, $timeout) {
    var pomo_nonsense = 'The fallacy of disciplinary boundaries thematizes the figuralization of civil society.',
      regex = /(of\s.+\sboundaries|eht)/;

    $scope.reset = function reset() {
      delete $scope.data.pomo_nonsense;
      $timeout(function () {
        $scope.data.pomo_nonsense = pomo_nonsense;
      });
    };

    $scope.reverse = function reverse() {
      var arr = Array.prototype.slice.call($scope.data.pomo_nonsense);
      arr.reverse();
      $scope.data.pomo_nonsense = arr.join('');
    };

    $scope.data = {
      regex: regex,
      pomo_nonsense: pomo_nonsense
    };
  };

  /**
   * Controls the example navigation
   */
  var MainCtrl = function MainCtrl($scope, $location) {

    $scope.select = function select(id) {
      $scope.selected = $scope.selected === id ? null : id;
      $location.path('/' + id);
    };

    $scope.examples = examples;
    $scope.select($location.path().substring(1) || examples[0].id);

  };
  MainCtrl.$inject = ['$scope', '$location', '$anchorScroll'];

  /**
   * Renders source code with highlight.js
   * @example
   * $scope.foo = "var bar = 'baz';";
   * // <source ng-model="foo" lang="js"></source>
   */
  var code = function code($window) {
    return {
      restrict: 'E',
      require: '?ngModel',
      /**
       *
       * @param {$rootScope.Scope} scope Element Scope
       * @param {angular.element} element AngularJS element
       * @param {$compile.directive.Attributes} attrs AngularJS Attributes object
       * @param {NgModelController} ngModel ngModel controller object
       */
      link: function link(scope, element, attrs, ngModel) {
        var pre;
        if (!ngModel) {
          return;
        }

        pre = element.wrap('<pre></pre>');
        element.addClass(attrs.lang);

        ngModel.$render = function $render() {
          element.text(ngModel.$viewValue);
          $window.hljs.highlightBlock(pre[0]);
        };

      }
    };
  };
  code.$inject = ['$window'];

  angular.module('demo', ['badwing.autoselect', 'picardy.fontawesome'])
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .controller('ExampleCtrl', ExampleCtrl)
    .directive('code', code);

})(window.angular);
