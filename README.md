# angular-selection

AngularJS directive(s) to automatically select text within input fields.

## [Demo](http://boneskull.github.io/angular-selection)
 
## Usage

Include this module:

```js
angular.module('myModule', ['badwing.selection']);
```

Use the `autoSelect` directive:

```html
<input type="text" ng-model="foo" auto-select="options"/>
```

Where `options` is an object with the following properties:

- **once** `{boolean}`: If true, only auto-select once.  Default `false`.
- **start** `{number}`: If set, begin the selection at this index within the input field's value.  Default `0`.
- **end** `{number}`: If set, end the selection at this index within the input field's value.  Default is the length of the value.
- **match** `{(string|RegExp)}`: If a `string`, select only the substring, if present.  If a `RegExp`, then select all the text matched by the regular expression.  If the directive cannot find the substring or the regular expression, it will not attempt to select text.

The `autoSelect` directive requires the `ngModel` directive.

> Note: Not all input fields are supported by all browsers.  [Read about support](https://html.spec.whatwg.org/multipage/forms.html#do-not-apply).

## Installation

```shell
$ npm install angular-selection
```

or

```shell
$ bower install angular-selection
```

**angular-selection** is a [UMD](https://github.com/umdjs/umd) module.

## Author

[Christopher Hiller](http://boneskull.github.io)

## License

MIT

