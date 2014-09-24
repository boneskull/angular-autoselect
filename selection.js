(function (root, factory) {
  'use strict';

  var angular;

  // if AMD or CommonJS module, return a module.
  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'), global);
    // otherwise, attach to global `angular` object.
  } else {
    angular = root.angular;
    angular.extend(angular, factory(angular, root));
  }
})(this, function (angular) {
  'use strict';

  /**
   *
   * @typedef {Object} SelectionOptions
   * @property {number} begin Where to begin the range selection
   * @property {number} end Where to end the range selection
   */

  var selectTextDirective,
    autoSelectTextDirective,
    selectAllTextDirective,
    autoSelectAllTextDirective,
    selectionParseOptions,
    selectionSelectCtrl;

  /**
   * Parses directive options from attributes
   * @param {angular.Scope} scope AngularJS Scope
   * @param {$compile.directive.Attributes} attrs AngularJS Attributes object
   * @returns {SelectionOptions}
   */
  selectionParseOptions = function selectionParseOptions(scope, attrs) {
    var options = scope.$eval(attrs.selectText) || {};
    if (!angular.isObject(options)) {
      options = {};
    }
    options.begin = scope.$eval(attrs.begin) || options.begin;
    options.end = scope.$eval(attrs.end) || options.end;
    return options;
  };

  /**
   * Common controller used by the directives.
   * @param {angular.Scope} $scope AngularJS Scope
   * @param {angular.element} $element jqLite/jQuery Element
   */
  selectionSelectCtrl = function selectionSelectCtrl($scope, $element) {

    /**
     * The node name of a <textarea> element
     * @const
     * @type {string}
     */
    var TEXTAREA = 'TEXTAREA';

      /**
       * Select the text in an input node.  Defaults to select all text.
       * @param {SelectionOptions} [options] Options
       * @todo Evaluate completely loosening restrictions on nodes
       */
    $scope.$rangeSelect = function $rangeSelect(options) {
      var node = $element[0],
          length,
          start,
          end;

      options = options || {};

      length = $element.val().length;
      start = options.start || 0;
      end = options.end || length;
      if (angular.isDefined(node.selectionStart)) {
        node.selectionStart = start;
        node.selectionEnd = end;
      }

    };
  };
  selectionSelectCtrl.$inject = ['$scope', '$element', '$attrs'];

  autoSelectAllTextDirective = function autoSelectAllTextDirective() {
    return {
      controller: 'selectionSelectCtrl',
      require: 'ngModel',
      compile: function compile(tElm) {
        tElm.focus();
        return function link(scope, el, attrs, ngModel) {
          var render = ngModel.$render;
          ngModel.$render = function $render() {
            if (ngModel.$isEmpty(ngModel.$viewValue)) {
              el.val('');
            } else {
              el.val(ngModel.$viewValue);
              scope.$rangeSelect();
              ngModel.$render = render;
            }
          };
        };
      }
    };
  };
  autoSelectAllTextDirective.$name = 'autoSelectAllText';

  selectAllTextDirective = function selectAllTextDirective() {
    return {
      controller: 'selectionSelectCtrl',
      link: function link(scope, el) {
        el.bind('focus', angular.bind(scope, scope.$rangeSelect));

        scope.$on('$destroy', function () {
          el.unbind('focus');
        });
      }
    };
  };
  selectAllTextDirective.$name = 'selectAllText';

  autoSelectTextDirective = function autoSelectTextDirective(rangeParseOptions) {
    return {
      controller: 'selectionSelectCtrl',
      require: 'ngModel',
      compile: function compile(tElm) {
        tElm.focus();
        return function link(scope, el, attrs, ngModel) {
          var render = ngModel.$render;
          ngModel.$render = function $render() {
            if (ngModel.$isEmpty(ngModel.$viewValue)) {
              el.val('');
            } else {
              el.val(ngModel.$viewValue);
              scope.$rangeSelect(rangeParseOptions(scope, attrs));
              ngModel.$render = render;
            }
          };
        };
      }
    };
  };
  autoSelectTextDirective.$inject = ['selectionParseOptions'];
  autoSelectTextDirective.$name = 'autoSelectText';

  selectTextDirective = function selectText(rangeParseOptions) {
    return {
      controller: 'selectionSelectCtrl',
      link: function link(scope, el, attrs) {
        el.bind('focus', function () {
          scope.$rangeSelect(rangeParseOptions(scope, attrs));
        });

        scope.$on('$destroy', function () {
          el.unbind('focus');
        });
      }
    };
  };
  selectTextDirective.$inject = ['selectionParseOptions'];
  selectTextDirective.$name = 'selectText';

  angular.module('badwing.selection', [])
    .value('selectionParseOptions', selectionParseOptions)
    .controller('selectionSelectCtrl', selectionSelectCtrl)
    .directive(autoSelectAllTextDirective.$name, autoSelectAllTextDirective)
    .directive(autoSelectTextDirective.$name, autoSelectTextDirective)
    .directive(selectAllTextDirective.$name, selectAllTextDirective)
    .directive(selectTextDirective.$name, selectTextDirective);
});
