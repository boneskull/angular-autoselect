# angular-fontawesome [![Build Status](https://travis-ci.org/picardy/angular-fontawesome.svg?branch=master)](https://travis-ci.org/picardy/angular-fontawesome)

A simple directive for [FontAwesome](http://fontawesome.io/) icons. Avoid writing a massive `ngStyle` declaration for your FontAwesome integration, and use the power of Angular to make interactive icon-based widgets.

### Usage

1. Include the module in your own app.

```javascript
angular.module('myApp', ['picardy.fontawesome'])
```

2. Use the directive on any page which bootstraps your app.

```html
<fa name="loading" spin ng-style="{'color': checkColor}"></fa>
<!-- $scope.checkColor = 'blue' -->
<!-- rendered -->
<i class="fa fa-loading fa-spin" style="color:blue;"></i>
```

### Attributes

The `fa` directive's attributes map to the [classes used by FontAwesome\.

```html
<fa name="ICON-NAME"
    size="1-5|large"
    flip="horizontal|vertical"
    rotate="90|180|270"
    spin
    border
    list
></fa>
```

##### name
The icon's [name](http://fontawesome.io/icons/), such as `fa-loading` or `fa-square`.
```html
<fa name="github"></fa>
<!-- rendered -->
<i class="fa fa-github"></i>
```

##### size
The icon's font size, either defined by a multiplier (1-5), or by the string `"large"`.
```html
<fa name="square" size="{{ currentSize }}"></fa>
<!-- $scope.currentSize = 3 -->
<!-- rendered -->
<i class="fa fa-square fa-3x"></i>
```

##### flip
Flip the icon `horizontal` or `vertical`.
```html
<fa name="pencil" flip="vertical"></fa>
<!-- rendered -->
<i class="fa fa-pencil fa-flip-vertical"></i>
```

##### rotate
Rotate the icon `90`, `180`, or `270` degrees.
```html
<fa name="floppy-o" rotate="90"></fa>
<!-- rendered -->
<i class="fa fa-floppy-o fa-rotate-90"></i>
```

##### spin
Animate the icon to spin. You don't need to provide true to use the boolean attributes:
```html
<fa name="loading" spin></fa>
<!-- rendered -->
<i class="fa fa-loading fa-spin"></i>
```
You can pass in `true` or `false` to the attribute as well, allowing the spin class to be be easily toggleable.
```html
<fa name="{{ isLoading ? 'loading' : 'check' }}" spin="{{ isLoading }}"></fa>
<!-- rendered -->
<i class="fa fa-loading fa-spin"></i>
```

##### border
```html
<fa name="envelope" border></fa>
<!-- rendered -->
<i class="fa fa-envelope fa-border"></i> 
```

##### fixed width
```html
<fa name="book" fw></fa>
<!-- rendered -->
<i class="fa fa-book fa-fw"></i>
```

##### inverse
```html
<fa name="home" inverse></fa>
<!-- rendered -->
<i class="fa fa-home fa-inverse"></i>
```

##### list
This directive autodetects if you're setup to do `fa-li` and then takes care of it for you.
```html
<ul class="fa-ul">
  <li>
    <fa name="square"></fa>
    Text here
    <fa class="check"></fa>
  </li>
</ul>
<!-- rendered -->
<ul class="fa-ul">
  <li>
    <i class="fa fa-li fa-square"></i>
    Text here
    <!-- <fa>s that aren't the first <fa> in the <li> do not automatically get the fa-li class -->
    <i class="fa fa-check"></i>
  </li>
</ul>
```

##### stack
coming soon


### TODO
 * `fa-stack` support
 * `pull="left"`, `pull="right"`
 * demos on Github pages


### License
MIT Licensed by [Picardy](http://beta.picardylearning.com).
