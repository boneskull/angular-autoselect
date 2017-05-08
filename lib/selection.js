'use strict';

var $selection = function $selection($window, $document) {

  var element = angular.element,
    service = this,
    scope = {};

  Object.defineProperties(this, {
    value: {
      get: function getValue() {
        return this.selection.toString();
      }
    },
    selection: {
      get: function getSelection() {
        return $window.getSelection();
      }
    }
  });

  Object.defineProperties(scope, {

    head: {
      get: function getHead() {
        return element(service.selection.anchorNode).scope();
      }
    },
    tail: {
      get: function getTail() {
        return element(service.selection.focusNode).scope();
      }
    },
    enclosing: {
      get: function getEnclosing() {
        return element(service.selection.getRangeAt(0).commonAncestorContainer).scope();
      }
    }
  });


};
$selection.$inject = ['$window'];
