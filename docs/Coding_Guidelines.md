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
* One selector per line
* Selectors in lowercase and with underscores, no dashes
* Preprocessors: CamelCase for everything but selectors and placeholders

### 4. JS
* Variables and function names in camelCase
* Constants in UPPER_CASE (e.g. ```ANIMATION_DURATION```)
* Constructors and class names in PascalCase
* References to jQuery objects start with $ (e.g. ```$carouselContainer```)
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

Above rules and additional ones are automatically tested using [ESLint](http://eslint.org). The build task will fail if the linting task reports any errors.

It is highly recommended to integrate ESLint with your IDE. Instructions can be found here: http://eslint.org/docs/user-guide/integrations

## Guidelines

### 1. Selectors
* No use of IDs for styling, classes only
* Prefixing of classes:
	* Layout: ```layout_```, used for general page layout (e.g. ```.layout_wrapper```)
	* Module: ```mod_```, used for independent blocks of markup (e.g. ```.mod_teaser```). 
	* Variant: ```var_```, used as modifier or above elements (e.g. ```.mod_teasers.var_onecol```)
	* State: ```is_```, used as modifier or above elements (e.g. ```.mod_accordion.is_enabled```)
* No BEM-like approach, use nesting instead (e.g. ```.mod_teaser .title``` instead of ```.mod_teaser_title```). In case of "wrapper" modules like accordions: Use namespacing like ```.mod_accordion .accordion_title``` if necessary.
* JS hooks: Use data attributes instead of classes to target elements using JavaScript (e.g. ```data-teaser="init```)
* No use of overqualified selectors (e.g. ```.mod_teaser``` instead of ```div.mod_teaser```)

### 2. Units
* ```rem```, ```em``` or ```%``` for dimensions, generally no ```px```
* Prefer ```rem``` over ```em``` where reasonable, unless IE 8 has to be supported

### 3. CSS preprocessors
* Use mixins for repeating styles
* Define global variables/mixins/functions in the respective files in ```source/assets/css/globals/```
* Define colors in Color Schemer and export as HTML to ```source/assets/css/data/colors.html```. Use ```gulp css:colors``` to generate the corresponding SCSS.
* Nest your classes as little as possible
* Use the ```mq()``` mixin for media queries (see ```source/assets/css/globals/_mediaqueries.scss```):

```scss
.mod_test {
	color: green; // for anything smaller than a tablet

	@include mq($from: small, $to: medium) { // for tablets
		color: red;
	}

	@include mq($from: medium) { // for anything bigger than a tablet
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
$(document).on(estatico.events.throttledscroll, function(event, originalEvent) {
	console.log(originalEvent);
}.bind(this));

// Resize
$(document).on(estatico.events.debouncedresize, function(event, originalEvent) {
	console.log(originalEvent);
}.bind(this));
```

* Use custom events for media queries (see ```source/assets/js/helpers/mediaqueries.js```):

```js
// Listen to custom (debounced) event to react to viewport changes:
$document.on(estatico.events.mq, function(event, prevBreakpoint, currentBreakpoint) {
	console.log(prevBreakpoint); // { name: "small", value: "768px" }
	console.log(parseInt(prevBreakpoint.value)); // "768"
});

// Check the current breakpoint:
if (estatico.mq.currentBreakpoint.name === 'large') {
	this.destroySmall();
	this.initLarge();
}

// Check the current viewport against a specific breakpoint:
if (estatico.mq.query({ from: 'small' })) {
	this.destroySmall();
	this.initLarge();
}
```

### 5. Data/options handling, HTML/JS interaction

* `data` is content, `options` are configuration
* Save custom data and options specific to a module instance as data attribute on the module container:

```html
<div class="mod_slideshow" data-init="slideshow" data-slideshow-data='{"items": ["Item 1", "Item 2"]}' data-slideshow-options='{"animationDuration": "100"}'></div>
```

The module instance will have this merged into `this.data` and `this.options`, respectively, (and explicitly keep it as `this._metaData` and `this._metaOptions`, respectively).

Data and options provided this way have higher specificity than their global counterparts (see below) when merging (e.g. `animationDuration` provided here will overwrite the one provided below).

* Save global (non-instance-specific) custom data to global namespace, preferably using `helper.extend`:

```html
<script>
	estatico.helpers.extend(estatico.data, {
		slideshow: {
			i18n: {
				prev: 'Previous',
				next: 'Next'
			}
		}
	});

	estatico.helpers.extend(estatico.options, {
		slideshow: {
			animationDuration: 100
		}
	});
</script>
```

The module instance will have this merged into `this.data` and `this.options`, respectively, (and explicitly keep a reference in `this._globalData` and `this._globalOptions`, respectively).

### 6. Vendor code
* Use npm to manage dependencies (see `dependencies` in `package.json`).
* If a dependency is not published in the npm registry, fork the repo to our Github account and link this fork.
