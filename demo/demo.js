(function (angular) {
  'use strict';

  /**
   * Example data
   */
  var examples = [
    {
      id: 'auto-select-all-text',
      title: 'Auto-Select All Text',
      template: '<textarea ng-model="foo" auto-select></textarea>',
      description: 'This example auto-selects all text in a field.'
    },
    {
      id: 'auto-select-all-text-once',
      title: 'Auto-Select All Text (Once)',
      template: '<textarea ng-model="foo" auto-select="{once: true}"></textarea>',
      description: 'This example auto-selects all text in a field, but will only do this the first time the input field receives a value. Resetting will have no effect on the selection until the markup is removed and re-added to the DOM.'
    },
    {
      id: 'auto-select-range',
      title: 'Auto-Select Range',
      template: '<textarea ng-model="foo" auto-select="{start: 10, end: 20}">',
      description: 'This example shows how a portion of text can be selected based on character index.'
    },
    {
      id: 'auto-select-substring',
      title: 'Auto-Select Substring',
      template: '<textarea ng-model="foo" auto-select="{match: \'thematizes\'}">',
      description: 'This example shows how a substring can be selected.'
    },
    {
      id: 'auto-select-regexp',
      title: 'Auto-Select Regular Expression',
      template: '<textarea ng-model="foo" auto-select="{match: match}">',
      description: 'This example shows how a <code>RegExp</code> can be used to perform a selection.  Note that you cannot declare a <code>RegExp</code> object within an AngularJS expression.',
      js: '$scope.match = /of\\s.+\\sboundaries/;'
    }
  ];

  /**
   * Puts the templates into the template cache
   */
  var run = function run($templateCache) {
    angular.forEach(examples, function (example) {
      $templateCache.put(example.id + '-template', example.template);
      $templateCache.put(example.id + '-description', example.description);
    });
  };
  run.$inject = ['$templateCache'];

  /**
   * Controls a singular example
   */
  var ExampleCtrl = function ExampleCtrl($scope, $timeout) {
    var foo = 'The fallacy of disciplinary boundaries thematizes the figuralization of civil society.';

    $scope.reset = function reset() {
      delete $scope.foo;
      $timeout(function () {
        $scope.foo = foo;
        $scope.$digest();
      });
    };
    
    $scope.reverse = function reverse() {
      var arr = Array.prototype.slice.call($scope.foo);
      arr.reverse();
      $scope.foo = arr.join('');
    };

    $scope.match = /of\s.+\sboundaries/;
    
    $scope.foo = foo;
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
   * Highlights code once it enters the DOM
   */
  var highlight = function highlight($window) {
    return {
      link: function link(scope, element, attrs) {
        var code = scope.$eval(attrs.highlight);
        if (code) {
          element.children('code').text(code);
          $window.hljs.highlightBlock(element[0]);
        }
      }
    };
  };
  highlight.$inject = ['$window'];

  angular.module('demo', ['badwing.selection'])
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .controller('ExampleCtrl', ExampleCtrl)
    .directive('highlight', highlight);

})(window.angular);
