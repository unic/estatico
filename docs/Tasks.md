# TASKS

## Default task

### `gulp`
Create static webserver with livereload functionality, serve build directory on port 9000, watch source files.

* Prompts whether the `build` task should run in advance (default: yes).
* For non-interactive mode: `gulp --interactive=false --skipBuild`

## Generic options

* Use `--dev` flag to continue on errors. Recommended with the default task due to the file watcher crashing otherwise.

## Specific tasks

### `gulp build`
Create build by running every HTML, CSS, JavaScript and media task.

* Prompts whether the `js:test` task should run in the end (default: yes).
* For non-interactive mode: `gulp --interactive=false --skipTests`

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
Import colors from JSON and save to Sass file (based on Handlebars template). Optionally it can import colors from ColorSchemer HTML export.

Non-alphanumeric characters are removed from the name.
Works with JSON, too. Just replace the HTML file with a JSON one (containing "colorName": "#000000" pairs).

### `gulp css`
Compile Sass to CSS (using `LibSass`), run autoprefixer on the generated CSS.
By default, a very basic dependency graph makes sure that only the necessary files are rebuilt on changes. Add the `--skipCssDependencyGraph` flag to disable this behavior and just build everything all the time.

### `gulp css:fonts`
Encode *.otf or *.ttf or *.woff fonts to base64 data

### `gulp html`
Compile Handlebars templates to HTML. Use `.data.js` files for - surprise! - data.
By default, a very basic dependency graph makes sure that only the necessary files are rebuilt on changes. Add the `--skipHtmlDependencyGraph` flag to disable this behavior and just build everything all the time.

### `gulp html:hbs:copy`
Copy the handlebars files to the assets folder. Note: this task is disabled by default. You need to enable this in build.js

### `gulp html:migrate`
Transform old `.json` data files to `.data.js`.

### `gulp js`
Use Webpack to transpile and bundle JavaScript sources. By default, Webpack's built-in, faster file watcher is used while developing. Add the `--skipWebpackWatch` flag to fall back to a simple gulp watcher.

### `gulp js:lint`
Lint JavaScript files (using `ESLint`).

### `gulp js:mocks`
Create static JSON data mocks

### `gulp js:modernizr`
Generate customized Modernizr build (using `Customizr`, crawling through files and gathering up references to Modernizr tests).

### `gulp js:test`
Open built HTML files in headless Chrome, report console errors and run QUnit tests.

### `gulp media:copy`
Copy specific media files to build directory.

### `gulp media:dataurls`
Generate Sass file with base64 encoded SVG data urls and PNG fallbacks.

### `gulp media:iconfont`
Generate icon font (using `gulp-iconfont`) and corresponding Sass file (based on Handlebars template).

### `gulp media:imageversions`
Creates versions of images, based on configuration, located in imageversions.js file in the same folder as original image. See /source/demo/modules/imageversions module for more details and further documentation.
Depends on GraphicsMagick being installed.

### `gulp media:pngsprite`
Generate sprite image from input files (using `gulp.spritesmith`) and generate Sass file (based on Handlebars template).

### `gulp media:svgsprite`
Fetches multiple svg files and creates a svg sprite which can later be referenced to from within the html code as described in this article
https://css-tricks.com/svg-symbol-good-choice-icons/

### `gulp scaffold:copy`
Copy module or page

* Prompts for type and name of module to be copied as well as the new name.
* Non-interactive mode: `gulp scaffold:copy --interactive=false --type={Module|Page|Demo Module|Demo Page} --newType={Module|Page|Demo Module|Demo Page} --name=helloworld --newName=helloworld2`

### `gulp scaffold`
Scaffold new module or page, add references to module to `main.scss` and `main.js` unless specified otherwise.

* Prompts for type and details of new element.
* Non-interactive mode: `gulp scaffold --interactive=false --type={Module|Page|Demo Module|Demo Page} --name="Hello World" --createScript={true|false} --createStyles={true|false}`

### `gulp scaffold:delete`
Remove module or page and delete references in `main.scss` and `main.js`.

* Prompts for type and name of element to be deleted.
* Non-interactive mode: `gulp scaffold:delete --interactive=false --type={Module|Page|Demo Module|Demo Page} --name=bla`

### `gulp scaffold:rename`
Rename module or page

* Prompts for type and name of module to be copied as well as the new name.
* Non-interactive mode: `gulp scaffold:rename --interactive=false --type={Module|Page|Demo Module|Demo Page} --name=helloworld --newName=helloworld2`

