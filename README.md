# angular-selection

AngularJS directives to select text within input fields

## Example

Automatically select all text in an input field when it is initially rendered:

```html
<input type="text" ng-model="foo" auto-select-all-text/>
```

Select all text upon focus:

```html
<input type="text" ng-model="foo" select-all-text/>
```

Automatically select characters three through five when initially rendered:

```html
<input type="text" ng-model="foo" auto-select-text="{begin: 2, end: 4}"/>
```

This is equivalent:

```html
<input type="text" ng-model="foo" auto-select-text begin="2" end="4"/>
```

When focused, select the character represented by numeric Scope variable `bar`, through the end of the value:

```html
<input type="text" ng-model="foo" select-text="{begin: bar}"/>
```

## Installation

```shell
$ npm install angular-selection
```

or

```shell
$ bower install angular-selection
```

**angular-selection** is a [UMD](https://github.com/umdjs/umd) module.

## API

This module exposes a `rangeSelectCtrl`.  This controller exposes the following function on its Scope:

### $rangeSelect(options) 

Select the text in an input node.  Defaults to select all text.

**Parameters**

- **options**: `Object` *optional*, Options
- **options.begin**: `number` *optional*, Character index where to begin the selection; defaults to `0`
- **options.end**: `number` *optional*, Character index where to end the selection; defaults to the `length` of the node's value.

## TODO

- Allow selections based on `RegExp` and `String` 

## Author

[Christopher Hiller](http://boneskull.github.io)

## License

MIT

