## 4.0.0

We're terribly sorry, but some of the changes may be **slightly** backwards incompatible.

Features:

* **ESTATICO-153: JSCS code style check has been added to js:lint gulp task.**
* [Pull request #5](https://github
.com/unic/estatico/pull/5): A built-in comparison function for media queries in JavaScript (courtesy of @d-simon).
* ESTATICO-103: Modules can now have variants - different implementations of modules, based on same Handlebars
markup, but different sets of data. Module preview page is now able to preview all variants.
* ESTATICO-30: Magic colorful console logging (as proposed by @d-simon in [Pull request #3](https://github.com/unic/estatico/pull/3)), based on
[Bows](https://github.com/latentflip/bows).
* ESTATICO-42: Added scaffold:copy task to copy demo module to source folder structure.
* ESTATICO-180: Added scaffold:rename task for renaming modules.
* ESTATICO-102: Stylish code highlighting in module markdown docs.
* ESTATICO-191: Highlighting modules when pressing CTRL+M in a browser.
* ESTATICO-192: Highlighting elements with aria attributes when pressing CTRL+A in a browser.
* ESTATICO-54: Asynchronous font loading with base64 encoding and localStorage caching (inspired by [localFont](https://github.com/jaicab/localFont/blob/gh-pages/core.js)).
* ESTATICO-201: New subtle styling of preview and index pages
* ESTATICO-69: media:imageversions gulp task to automatically generate different size versions of your placeholder cat images.

Changes:

* **ESTATICO-187: npm is used instead of bower**
* ESTATICO-181: gulp-sass and node-sass have been updated to the latest versions, which are still able to work with
sorcemaps (gulp-sass -> 2.0.3, node-sass -> 3.3.3)
* ESTATICO-186: QUnit updated to version 1.20.0
* ESTATICO-178: JQuery updated to version 2.1.3
* ESTATICO-178: native JavaScript methods are used instead of jQuery ones (e.g. bind instead of proxy)
* sourcemaps are now generated after livereload
* ESTATICO-196: Moved colors.scss to the top of main.scss, so that colors can be used in globals/variables.scss file

Bugfixes:

* [Pull request #6](https://github
.com/unic/estatico/pull/6): Wrong variable names have been corrected in mq mixin (thanks to @matthiasmeier)
* ESTATICO-4: Scaffolding task used to generate javascript file even if user said NO explicitly. As a special Christmas gift it doesn't do it anymore.
* ESTATICO-202: Moved styles from body to html to allow for rem sizing

## 3.0.1

Bugfixes:

* ESTATICO-177: Update gulp-raster to fix issue on Windows
* FROBOIL-155: Fix QUnit path handling to work on Windows
* FROBOIL-155: Fix npm script paths to work on Windows

## 3.0.0

Features:

* Improve documentation
* FROBOIL-49: Optimize JavaScript architecture and data/options handling
* FROBOIL-114: Improve testing of Gulp task
* FROBOIL-150: Make color import task more generic
* FROBOIL-152: Run "bower install" as npm postinstall
* FROBOIL-153: Make paths in built HTML relative

Changes:

* FROBOIL-140: Move content of ci/ to Teamcity configuration

Bugfixes:

* FROBOIL-144: Fix handlebars layouts registering
* FROBOIL-145: Make globs more explicit to fix file watcher issue on Windows
* FROBOIL-147: Fix cmd arguments of some tasks

## 2.1.0

Features:

* FROBOIL-137: Add data mocking example and documentation

Changes:

* Update node to 0.12.2
* Bump npm dependencies to latest versions
* FROBOIL-137: Improve code documentation highlighting
* FROBOIL-139: gulp:dataurls: Remove ImageMagick/GraphicsMagick

Bugfixes:

* FROBOIL-142: setup.sh: Only install npm 2.7.6 if current version is lower
* FROBOIL-143: media:dataurls: Use 'primary' instead of 'default' as color default

## 2.0.0

Features:

* FROBOIL-62: Improve data handling:
** Use JavaScript to define data and remove logic from templates and templating task
** Add html:migrate task to transform *.json files into *.data.js
** Add interactive scaffold and scaffold:delete tasks to add/delete modules, pages and demos
* FROBOIL-22: Use LibSass over Ruby version
* FROBOIL-51: Add sourcemaps (both minified and unminified assets)
* FROBOIL-117: Add module documenation using Markdown
* FROBOIL-130: Make default task interactive
* FROBOIL-116: Optimize path handling in tasks
* FROBOIL-57: Make build script work on Teamcity
* FROBOIL-11: Add Vagrant configuration

Changes:

* FROBOIL-90: Move demo pages and modules to source/demo, add folder for each page
* FROBOIL-129: Rename default tasks (remove :default suffix)
* FROBOIL-124: Rename jenkins to ci
* FROBOIL-125: Rename source/styleguide to source/preview (and source/styleguide/sections to source/preview/styleguide)
* FROBOIL-62: Rename styleguide data property to meta and move testScripts there
* FROBOIL-126; media:dataurls: Move icon data transformation from plugin to task
* FROBOIL-77: Update npm dependencies and npm itself
* FROBOIL-127: Handlebars: Use existing plugins over custom one (gulp-hb for compiling and gulp-handlebars for precompiling)
* FROBOIL-23: Move private npm dependencies to GitHub (gulp-svg-dimensions and gulp-colorize-svgs)
* FROBOIL-128: Improve setup.sh: Simplify use of nvm, disable cloning of empty git repo, bump npm to 2.7.6

Bugfixes:

* FROBOIL-100: Fix Jenkins build script to use local credential store file
* FROBOIL-123: JSHint: Add globals used in Gulp tasks
* FROBOIL-27: js:modernizr: Use official npm package, remove unnecessary uglify step
* FROBOIL-120: Improve task loading performance
* FROBOIL-132: Fix watch task to work with new modules/pages
* FROBOIL-133: Improve js:lodash task to be idempotent
* FROBOIL-134: Fix QUnit tests on Windows

## 1.2.0

Features:

* FROBOIL-11: Vagrant setup finalized and documented
* FROBOIL-91: Index: Add feature option for modules / pages
* FROBOIL-92: Add setup script

Bugfixes:

* FROBOIL-76: Bower: Use --config.interactive=false
* FROBOIL-94: Media tasks: Make them work in case there are no input files

## 1.1.0

Features:

* FROBOIL-20: Re-add skiplinks
* FROBOIL-31: Guidelines: Mention selector namespacing (or lack thereof)
* FROBOIL-38: Add QUnit tests
* FROBOIL-39: JS: Insert license from LICENCE.txt into generated main.js
* FROBOIL-46: Gulp: Add routing for delaying requests (add ```?delay=2000``` to any URL to delay the response by 2s)
* FROBOIL-52: Styleguide: Improve index page
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
