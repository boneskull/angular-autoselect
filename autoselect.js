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
   * Options for autoSelect directive.
   * @typedef {Object} AutoSelectOptions
   * @property {number} start Where to start the range selection
   * @property {number} end Where to end the range selection
   * @property {boolean} once Perform the selection only once
   * @property {(string|RegExp)} match String or RegExp to match within the field value
   */

  /**
   * Provides various ways to automatically select text.
   * @returns {{require: string, compile: Function}}
   */
  var autoSelectDirective = function autoSelectDirective($log) {

    /**
     * Determines if a value is a `RegExp` object.
     * @param {*} [value]
     * @returns {boolean}
     */
    var isRegExp = function isRegExp(value) {
      return Object.prototype.toString.call(value) === '[object RegExp]';
    };

    /**
     * Performs the text selection.
     * @param {angular.element} element Element to perform selection on
     * @param {AutoSelectOptions} [options={}] Any options
     */
    var select = function select(element, options) {
        var value = element.val(),
          length = value.length,
          node = element[0],
          match,
          matched,
          start,
          end;

        options = options || {};

        match = options.match;
        if (match) {
          if (isRegExp(match) && (matched = value.match(match))) {
            start = matched.index;
            end = start + matched[0].length;
            /*jshint -W052 */
          } else if (angular.isString(match) && ~(start = value.indexOf(match))) {
            end = start + match.length;
          } else {
            return;
          }
        } else {
          start = options.start || 0;
          end = options.end || length;
        }

        if (~start) {
          node.setSelectionRange(start, end);
        }
      },

      /**
       * Parses directive options from attributes
       * @param {angular.Scope} scope AngularJS Scope
       * @param {string} attr Raw attribute value
       * @returns {AutoSelectOptions}
       */
      parseOptions = function parseOptions(scope, attr) {
        var options = {},
          attr_options;

        attr_options = scope.$eval(attr) || {};

        if (angular.isString(attr_options) || isRegExp(attr_options)) {
          options.match = attr_options;
          delete options.start;
          delete options.end;
          delete options.once;
        } else if (angular.isObject(attr_options)) {
          angular.extend(options, attr_options);
        }

        return options;
      };


    return {
      require: 'ngModel',
      compile: function compile(tElement, tAttrs) {
        var link;
        try {
          tElement[0].selectionStart;
          link = function link(scope, element, attrs, ngModel) {
            var render = ngModel.$render;
            ngModel.$render = function $render() {
              var options;
              if (ngModel.$isEmpty(ngModel.$viewValue)) {
                element.val('');
              } else {
                options = parseOptions(scope, attrs.autoSelect);
                element.val(ngModel.$viewValue);
                select(element, options);
                if (options.once) {
                  ngModel.$render = render;
                }
              }
            };
          };
        } catch (ignored) {
          $log.warn('Element type "%s" is not supported.  For a list of supported types, see:\nhttps://html.spec.whatwg.org/multipage/forms.html#do-not-apply', tAttrs.type);
          link = angular.noop;
        }
        return link;
      }
    };
  };
  autoSelectDirective.$inject = ['$log'];
  autoSelectDirective.$name = 'autoSelect';

  angular.module('badwing.autoselect', [])
    .directive(autoSelectDirective.$name, autoSelectDirective);
});
