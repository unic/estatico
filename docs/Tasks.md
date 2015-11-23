# TASKS

## Default task

### `gulp`
Create static webserver with livereload functionality, serve build directory on port 9000, watch source files.

* Prompts whether the `build` task should run in advance.
* For non-interactive mode: `gulp --interactive=false --skipBuild`

## Generic options

* Use `--dev` flag to continue on errors. Recommended with the default task due to the file watcher crashing otherwise.

## Specific tasks

### `gulp build`
Create build by running every HTML, CSS, JavaScript and media task.

### `gulp clean`
Remove build and temp folders.

### `gulp document`
Read task files and create a markdown files from their JSDoc documentation (using `gulp-jsdoc-to-markdown`).

### `gulp livereload`
Start livereload instance.

CSS is injected without page-reload. However, the corresponding source map is not.
In order to have an updated source map after changing the CSS, the page has to be reloaded manually.

### `gulp serve`
Serve build directory on port 9000 (using `connect`).

### `gulp watch`
Run specific tasks when specific files have changed. Uses the `gulp-watch` package since the native `gulp.watch` currently does not pick up new folders.

* Fall back to polling (e.g. in Vagrant): `gulp --pollWatch=true`

### `gulp css:colors`
Import colors from ColorSchemer HTML export and save to Sass file (based on Handlebars template).

Non-alphanumeric characters are removed from the name.
Works with JSON, too. Just replace the HTML file with a JSON one (containing "colorName": "#000000" pairs).

### `gulp css`
Compile Sass to CSS (using `LibSass`), run autoprefixer on the generated CSS.

### `gulp html`
Compile Handlebars templates to HTML. Use `.data.js` files for - surprise! - data.

### `gulp html:migrate`
Transform old `.json` data files to `.data.js`.

### `gulp js`
Generate `main.js` and `head.js` by concatenating their dependencies (using `gulp-resolve-dependencies`) and optionally minifying the result (using `uglifyJS`).

### `gulp js:lint`
Lint JavaScript files (using `JSHint`).

### `gulp js:lodash`
Generate customized lodash build.

### `gulp js:mocks`
Create static JSON data mocks

### `gulp js:modernizr`
Generate customized Modernizr build (using `Customizr`, crawling through files and gathering up references to Modernizr tests).

### `gulp js:qunit`
Run QUnit tests (using PhantomJS).

### `gulp js:templates`
Precompile handlebars templates.

### `gulp media:copy`
Copy specific media files to build directory.

### `gulp media:dataurls`
Generate Sass file with base64 encoded SVG data urls and PNG fallbacks.

### `gulp media:iconfont`
Generate icon font (using `gulp-iconfont`) and corresponding Sass file (based on Handlebars template).

### `gulp media:pngsprite`
Generate sprite image from input files (using `gulp.spritesmith`) and generate Sass file (based on Handlebars template).

### `gulp scaffold`
Scaffold new module or page, add references to module to `main.scss` and `main.js`.

* Prompts for type and details of new element.
* Non-interactive mode: `gulp scaffold --interactive=false type={Module|Page} name="My Module"`

### `gulp scaffold:delete`
Remove modules, pages or all demo files and delete references in `main.scss` and `main.js`.

* Prompts for type and name of element to be deleted.
* Non-interactive mode: `gulp scaffold:delete --interactive=false type={Module|Page} name=my_module`

