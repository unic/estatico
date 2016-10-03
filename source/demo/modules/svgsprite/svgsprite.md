## Description

List of all icons used in SVG sprites. SVG's are grouped in folders based on their usage. `base` group is added on all subpages by default.

## How to re-use this pattern

To be able to use SVG sprites, follow the steps below.

* Add `media:svgsprite` gulp task to your project. Remember to configure paths to your SVG assets.
* Add `svgsprites_loader.js` helper to `source/assets/js/helpers`.
* Include a `data-svgsprites-options` attribute in the `body` tag that contains the list of path to SVG sprites you want to use.


## Icon usage

To use an icon from SVG sprite:

1. Make sure the group that contains this icon is listed in the `data-svgsprites-options` attribute of `body` element. If not, add a path to the group.

	```html
		<body data-svgsprites-options="['../../assets/media/svg/base.svg',{{path to needed group}}]">
	```

2. Add the html snippet below to the module or page. Replace `icon` with the name of the icon you want to use and `class` with whatever CSS class you need.

	```html
		<svg class="{{class}}" focusable="false">
			<use xlink:href="#{{icon}}" />
		</svg>
	```


## Alternative: Simplified approach without JavaScript

Instead of defining sprites in the `data-svgsprites-options` of the body, using `svgsprites_loader.js` and referencing the icons relatively, they can be referenced explicitly:

	```html
		<svg class="{{class}}" focusable="false">
			<use xlink:href="/assets/media/svg/base.svg#{{icon}}" />
		</svg>
	```

This simplifies the setup a lot, however, the backend would need to update the `xlink:href` attribute whenever an icon is moved between sprites, e.g.
