/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var QUnit = __webpack_require__(1),
		$ = __webpack_require__(2);

	var moduleName = 'slideshow',
		$node = $('.mod_' + moduleName).eq(0),
		instance;

	// Setup QUnit module
	QUnit.module('slideshow', {
		beforeEach: function() {
			instance = $node.data(moduleName + '-instance');
		},

		afterEach: function() {
			instance.destroy();
			estatico.helpers.initModule(moduleName, $node);
		}
	});

	QUnit.test('Test correct plugin registration', function(assert) {
		assert.expect(1);

		assert.equal(typeof instance, 'object', 'Plugin instance is an object');
	});

	QUnit.test('Test correct plugin init', function(assert) {
		assert.expect(7);

		var $buttons = $node.find('button[data-' + moduleName + ']'),
			events = $._data($node.get(0), 'events') || {},
			clickEvents = $.grep(events.click || [], function(event) {
				return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
			}),

			docEvents = $._data(document, 'events'),
			resizeEvent = $.grep(docEvents[estatico.events.resize.split('.')[0]] || [], function(event) {
				return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
			}),

			scrollEvent = $.grep(docEvents[estatico.events.scroll.split('.')[0]] || [], function(event) {
				return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
			}),

			mqEvent = $.grep(docEvents[estatico.events.mq.split('.')[0]] || [], function(event) {
				return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
			});

		assert.equal($buttons.length, 2, 'Two buttons found');

		assert.equal(clickEvents.length, 2, 'Two click events attached to slideshow');

		assert.equal(events.click[0].selector.toLowerCase(), '[data-' + moduleName + '="prev"]', 'Prev button event reporting correct selector');
		assert.equal(events.click[1].selector.toLowerCase(), '[data-' + moduleName + '="next"]', 'Next button event reporting correct selector');

		assert.equal(resizeEvent.length, 1, 'Resize event set');
		assert.equal(scrollEvent.length, 1, 'Scroll event set');
		assert.equal(mqEvent.length, 1, 'Media-query event set');
	});

	QUnit.test('Test correct plugin destroy', function(assert) {
		assert.expect(5);

		instance.destroy();

		var $buttons = $node.find('button[data-' + moduleName + ']'),
			events = $._data($node.get(0), 'events') || {},
			clickEvents = $.grep(events.click || [], function(event) {
				return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
			}),

			docEvents = $._data(document, 'events'),
			resizeEvent = $.grep(docEvents[estatico.events.resize.split('.')[0]] || [], function(event) {
				return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
			}),

			scrollEvent = $.grep(docEvents[estatico.events.scroll.split('.')[0]] || [], function(event) {
				return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
			}),

			mqEvent = $.grep(docEvents[estatico.events.mq.split('.')[0]] || [], function(event) {
				return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
			});

		assert.equal($buttons.length, 0, 'No more button found');

		assert.equal(clickEvents.length, 0, 'No more click events attached to slideshow');

		assert.equal(resizeEvent.length, 0, 'Resize event unset');
		assert.equal(scrollEvent.length, 0, 'Scroll event unset');
		assert.equal(mqEvent.length, 0, 'Media-query event unset');
	});

	QUnit.test('Test whether clicking prev button updates "currentItem" property', function(assert) {
		assert.expect(1);

		var $button = $node.find('button.next');

		$button.trigger('click');

		assert.equal(instance.currentItem, 1, 'currentItem is 1');
	});

	QUnit.test('Test whether "show" method updates "currentItem" property', function(assert) {
		assert.expect(1);

		instance.show(2);

		assert.equal(instance.currentItem, 2, 'currentItem is 2');
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = QUnit;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ }
/******/ ]);