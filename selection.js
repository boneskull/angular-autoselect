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
   * @typedef {Object} RangeOptions
   * @property {number} begin Where to begin the range selection
   * @property {number} end Where to end the range selection
   */

  /**
   * Parses directive options from attributes
   * @param {angular.Scope} scope AngularJS Scope
   * @param {$compile.directive.Attributes} attrs AngularJS Attributes object
   * @returns {RangeOptions}
   */
  var rangeParseOptions = function rangeParseOptions(scope, attrs) {
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
  var rangeSelectCtrl = function rangeSelectCtrl($scope, $element) {

    /**
     * The node name of a <textarea> element
     * @const
     * @type {string}
     */
    var TEXTAREA = 'TEXTAREA';

      /**
       * Select the text in an editable node.  Defaults to select all text.
       * @param {RangeOptions} [options] Options
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
  rangeSelectCtrl.$inject = ['$scope', '$element', '$attrs'];

  /**
   * Directive to automatically select all text within a node upon link
   * @returns {Object} DDO
   * @see https://docs.angularjs.org/api/ng/service/$compile
   */
  var autoSelectAllTextDirective = function autoSelectAllTextDirective() {
    return {
      controller: 'rangeSelectCtrl',
      require: 'ngModel',
      compile: function compile(tElm) {
        tElm.focus();
        return function link(scope, el, attrs, ngModel) {
          ngModel.$render = function render() {
            if (ngModel.$isEmpty(ngModel.$viewValue)) {
              el.val('');
            } else {
              el.val(ngModel.$viewValue);
              scope.$rangeSelect();
            }
          };
        };
      }
    };
  };
  autoSelectAllTextDirective.$name = 'autoSelectAllText';

  /**
   * Directive to select all text within a node upon focus
   * @returns {Object} DDO
   * @see https://docs.angularjs.org/api/ng/service/$compile
   */
  var selectAllTextDirective = function selectAllTextDirective() {
    return {
      controller: 'rangeSelectCtrl',
      link: function link(scope, el) {
        el.bind('focus', angular.bind(scope, scope.$rangeSelect));

        scope.$on('$destroy', function () {
          el.unbind('focus');
        });
      }
    };
  };
  selectAllTextDirective.$name = 'selectAllText';

  /**
   * Directive to automatically select arbitrary range within node when linked
   * @returns {Object} DDO
   * @see https://docs.angularjs.org/api/ng/service/$compile
   */
  var autoSelectTextDirective = function autoSelectTextDirective(rangeParseOptions) {
    return {
      controller: 'rangeSelectCtrl',
      require: 'ngModel',
      compile: function compile(tElm) {
        tElm.focus();
        return function link(scope, el, attrs, ngModel) {
          ngModel.$render = function render() {
            if (ngModel.$isEmpty(ngModel.$viewValue)) {
              el.val('');
            } else {
              el.val(ngModel.$viewValue);
              scope.$rangeSelect(rangeParseOptions(scope, attrs));
            }
          };
        };
      }
    };
  };
  autoSelectTextDirective.$inject = ['rangeParseOptions'];
  autoSelectTextDirective.$name = 'autoSelectText';

  /**
   * Directive to select arbitrary text within a node upon focus
   * @returns {Object} DDO
   * @see https://docs.angularjs.org/api/ng/service/$compile
   */
  var selectTextDirective = function selectText(rangeParseOptions) {
    return {
      controller: 'rangeSelectCtrl',
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
  selectTextDirective.$inject = ['rangeParseOptions'];
  selectTextDirective.$name = 'selectText';

  angular.module('decipher.range', [])
    .value('rangeParseOptions', rangeParseOptions)
    .controller('rangeSelectCtrl', rangeSelectCtrl)
    .directive(autoSelectAllTextDirective.$name, autoSelectAllTextDirective)
    .directive(autoSelectTextDirective.$name, autoSelectTextDirective)
    .directive(selectAllTextDirective.$name, selectAllTextDirective)
    .directive(selectTextDirective.$name, selectTextDirective);
});
