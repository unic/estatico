## 1.1.0

Features:

* FROBOIL-20: Re-add skiplinks (thanks @"grzegorz.pawlowski")
* FROBOIL-31: Guidelines: Mention selector namespacing (or lack thereof)
* FROBOIL-38: Add QUnit tests (thanks @"rosmarie.wysseier")
* FROBOIL-39: JS: Insert license from LICENCE.txt into generated main.js
* FROBOIL-46: Gulp: Add routing for delaying requests (add ```?delay=2000``` to any URL to delay the response by 2s)
* FROBOIL-52: Styleguide: Improve index page (thanks @"matthias.meier")
* FROBOIL-65: Handlebars: Improve performance
* FROBOIL-70: Gulp: Add --nobuild flag to default task
* FROBOIL-72: Gulp: Media task: copy changed files only
* FROBOIL-73: Gulp: Show stack trace in case of errors
* FROBOIL-74: Handlebars: Add 'times' helper, improve error handling
* Push metadata.json to git build-* branch

Bugfixes:

* FROBOIL-37: Modernizr: Remove comments for every property from generated JS
* FROBOIL-45: Gulp: Module scaffolding task: Use different text cases where indicated
* FROBOIL-47: Handlebars: Save precompiled templates to Handlebars.partials
* FROBOIL-56: Handlebars: Fix pre-compiled partials paths on Windows
* FROBOIL-64: Bower: Handle packages including ".js" in the folder name
* FROBOIL-67: Gulp: Watch tmp and media files
* FROBOIL-68: NPM: Fix Git dependencies
* FROBOIL-71: Gulp: Fix callbacks in multi-step tasks
* FROBOIL-75: Gulp: Module scaffolding task: Throw error if module with same name exists

## 1.0.1

Bugfixes:

* FROBOIL-44: Media queries not working in IE (css content property not readable)
* npm-shrinkwrap.json updated

## 1.0.0

Features:

* Templating with Handlebars. Data stored in JSON files, smart inheritance of data from modules to pages. Precompiling step for use of partials in JavaScript.
* Tasks to generate base64 encoded dataurls of SVGs (with PNG fallback), icon fonts and PNG sprites.
* Basic styleguide included out-of-the-box. Colors imported from ColorSchemer export and used in SCSS, too.
* Scaffolding task for new modules.
* Errors as native system notifications, develop server still running.
* Linting of JavaScript code on every save.

Bugfixes:

* NOTHING, EVERYTHING WORKS!
