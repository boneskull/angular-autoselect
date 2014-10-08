angular.module('picardy.fontawesome', [])
	.directive('fa', function () {
		return {
			restrict: 'E',
			template: '<i class="fa"></i>',
			replace: true,
			link: function (scope, element, attrs) {
				
				/*** STRING ATTRS ***/
				// keep a state of the current attrs so that when they change,
				// we can remove the old attrs before adding the new ones.
				var currentClasses = {};

				// generic function to bind string attrs
				function _observeStringAttr (attr, baseClass) {
					attrs.$observe(attr, function () {
						baseClass = baseClass || 'fa-' + attr;
						element.removeClass(currentClasses[attr]);
						if (attrs[attr]) {
							var className = [baseClass, attrs[attr]].join('-');
							element.addClass(className);
							currentClasses[attr] = className;
						}
					});
				}

				_observeStringAttr('name', 'fa');
				_observeStringAttr('rotate');
				_observeStringAttr('flip');

				/**
				 * size can be passed "large" or an integer
				 */
				attrs.$observe('size', function () {
					var className;
					element.removeClass(currentClasses.size);

					if (attrs.size === 'large') {
						className = 'fa-lg';
					} else if (!isNaN(parseInt(attrs.size, 10))) {
						className = 'fa-' + attrs.size + 'x';
					}

					element.addClass(className);
					currentClasses.size = className;
				});

				/*** BOOLEAN ATTRS ***/
				// generic function to bind boolean attrs
				function _observeBooleanAttr (attr, className) {
					attrs.$observe(attr, function () {
						className = className || 'fa-' + attr;
						var value = attr in attrs && attrs[attr] !== 'false' && attrs[attr] !== false;
						element.toggleClass(className, value);
					});
				}

				_observeBooleanAttr('border');
				_observeBooleanAttr('fw');
				_observeBooleanAttr('inverse');
				_observeBooleanAttr('spin');

				/*** CONDITIONAL ATTRS ***/
				// automatically populate fa-li if DOM structure indicates
				element.toggleClass('fa-li', (
					element.parent() &&
					element.parent().parent() &&
					element.parent().parent().hasClass('fa-ul') &&
					element.parent().children()[0] === element[0]) &&
					attrs.list !== 'false' &&
					attrs.list !== false
				);
			}
		};
	});