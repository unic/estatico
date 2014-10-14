# CODING GUIDELINES

## Remarks

* "Generally" is used when a rule is not meant to be absolute.


## Formatting

### 1. General
* Encoding: UTF-8
* Indentation: Tabs

### 2. HTML
* Attributes wrapped with double quotes
* Filenames with underscores, no dashes

### 3. CSS
* Properties indented
* One property per line
* Generally one selector per line
* Selectors in lowercase and with underscores, no dashes
* Preprocessors: CamelCase for everything but selectors and placeholders

### 4. JS
* Variables and function names in camelCase
* Constants in UPPER_CASE (e.g. ANIMATION_DURATION)
* Constructors and class names in PascalCase
* References to jQuery objects start with $ (e.g. $carouselContainer)
* Single quotes
* Comments:

```js
/*!
 * Not stripped when compressed
 */

/**
 * Not stripped when compressed
 * @license XY
 */

/**
 * Stripped when compressed  
 */
```


## Guidelines

### 1. Selectors
* No use of IDs for styling, classes only
* Prefixing of classes:
	* Layout: "layout\_", used for general page layout (e.g. "layout\_wrapper")
	* Module: "mod\_", used for independent blocks of markup (e.g. "mod\_teaser"). Generally no namespacing inside modules (e.g. use ".mod\_teaser .title" instead of ".mod\_teaser\_title").
	* Variant: "var\_", used as modifier or above elements (e.g. "var\_onecol")
	* State: "is\_", used as modifier or above elements (e.g. "is\_inactive")
* JS hooks: Use data attributes instead of classes to target elements using JavaScript (e.g. data-teaser="init")
* No use of overqualified selectors (e.g. "div.mod\_teaser")

### 2. Units
* em or % for dimensions, generally no px

### 3. CSS preprocessors
* Use mixins for repeating styles
* Define global variables/mixins/functions in the respective files in ```source/assets/css/globals/```
* Define colors in Color Schemer and export as HTML to ```source/assets/css/data/colors.html```. Use ```gulp css:colors``` to generate the corresponding SCSS.
* Nest your classes as little as possible
* Use the ```mq()``` mixin for media queries (see ```source/assets/css/globals/_mediaqueries.scss```):

```scss
.mod_test {
	color: green;

	@include mq($from: small, $to: medium) {
		color: red;
	}

	@include mq($to: small) {
		color: blue;
	}
}
```

### 4. JS
* Use unobtrusive JS
* Use our jQuery module factory (see ```source/modules/.scaffold/module.js```)
* Use custom (debounced) events for scroll and resize listener (see ```source/assets/js/helpers/events.js```):

```js
// Scroll
$(document).on(Unic.events.scroll, _.bind(function(event, originalEvent) {
	console.log(originalEvent);
}, this));

// Resize
$(document).on(Unic.events.resize, _.bind(function(event, originalEvent) {
	console.log(originalEvent);
}, this));
```

* Use custom events for media queries (see ```source/assets/js/helpers/mediaqueries.js```):

```js
// Listen to events so that your module can react to viewport changes. They are debounced already (using Unic.events.resize):
$document.on(Unic.events.mq, function(event, prevBreakpoint, currentBreakpoint) {
	console.log(prevBreakpoint); // {small: "768px"}
	console.log(prevBreakpoint.name); // "small". Get previous breakpoint name.
	console.log(prevBreakpoint.value); // "768px". Get previous breakpoint size as string.
	console.log(parseInt(prevBreakpoint.value)); // "768". Get previous breakpoint size as number.
});

// Check the current breakpoint:
if (Unic.mq.currentBreakpoint.name === 'large') {
	this.destroySmall();
	this.initLarge();
}

// Check the current viewport against a specific breakpoint:
if (parseInt(Unic.mq.currentBreakpoint.value) > parseInt(Unic.mq.breakpoints.small)) {
	this.destroySmall();
	this.initLarge();
}
```

### 5. Vendor code
* Use [Bower](http://bower.io) to manage dependencies (see ```bower.json```).
