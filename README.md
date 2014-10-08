# [PROJECT NAME] [YEAR]

[SHORT DESCRIPTION]


---


## LINKS

* Code repository: [URL]
* Jira: [URL]
* Jenkins: [URL]
* Preview server: [URL]
* Design: [URL]
* IA: [URL]


---


## DEVELOPERS

* [NAME / SHORT NAME] [YEAR]


---


## SETUP

### Dependencies

* Node, NPM (preferably using [nvm](https://github.com/creationix/nvm)).
* Ruby and [bundler](http://bundler.io/) for Sass.

### Usage

Recommendation: Use nvm to allow for a standardized node environment:

```shell
nvm use
# if the specified version is not yet present: nvm install
```

Install node and bower dependencies:

```shell
npm install
bower install
# local version: node_modules/.bin/bower install
```

If "npm install" fails:

```shell
# Clean up
rm -rf node_modules
npm cache clean

# Temporarily remove npm-shrinkwrap.json
rm npm-shrinkwrap.json

# Install dependencies
npm install

# Re-add npm-shrinkwrap.json
git checkout npm-shrinkwrap.json
```

Install Sass:

```shell
bundle install
```

Start server

```shell
gulp --dev
# local version: node_modules/.bin/gulp --dev
# dev flag makes sure the server and watcher don't crash on error
```

Build

```shell
gulp build
# local version: node_modules/.bin/gulp build
```

Update bower dependencies

```shell
bower install
# local version: node_modules/.bin/bower install
```

Use sourcemaps

1. Open Chrome dev tools
2. Open "source" tab from dev tools
3. In the sources area (where you see the file-tree) right-mouse-click > "Add folder to workspace"
4. Choose your project folder
5. Accept the warning
6. Select one of the .scss files (because it is easy for the browser to guess to which file should be map) and right-mouse-click > "Map to file system ressource"
7. If the file has a unique name there will be 1 suggestion only. Simply press "Enter"
8. Select "Yes" in the alert window > the dev tools will reload

Now it is possible to edit values in the "source" tab from dev tools and save the changes directly from the dev tools. Gulp will take care of the rest.

Have a look at [https://me.unic.com/display/COPFE/Gulp%3A+Specific+tasks]() for a screencast.

---


## CODING GUIDELINES

### Remarks

* "Generally" is used when a rule is not meant to be absolute.

### Formatting

1. General
	* Encoding: UTF-8
	* Indentation: Tabs

2. HTML
	* Attributes wrapped with double quotes
	* Filenames with underscores, no dashes

3. CSS
	* Properties indented
	* One property per line
	* Generally one selector per line
	* Selectors in lowercase and with underscores, no dashes
	* Preprocessors: CamelCase for everything but selectors and placeholders

4. JS
	* Variables and function names in camelCase
	* Constants in UPPER_CASE (e.g. ANIMATION_DURATION)
	* Constructors and class names in PascalCase
	* References to jQuery objects start with $ (e.g. $carouselContainer)
	* Single quotes
	* Comments:  
		/\*!  
		 \* Not stripped when compressed  
		 \*/  
		/\**  
		 \* Stripped when compressed  
		 \*/

### Guidelines

1. Selectors
	* No use of IDs for styling, classes only
	* Prefixing of classes:
		* Layout: "layout\_", used for general page layout (e.g. "layout\_wrapper")
		* Module: "mod\_", used for independent blocks of markup (e.g. "mod\_teaser"). Generally no namespacing inside modules (e.g. use ".mod\_teaser .title" instead of ".mod\_teaser\_title").
		* Variant: "var\_", used as modifier or above elements (e.g. "var\_onecol")
		* State: "is\_", used as modifier or above elements (e.g. "is\_inactive")
	* JS hooks: Use data attributes instead of classes to target elements using JavaScript (e.g. data-teaser="init")
	* No use of overqualified selectors (e.g. "div.mod\_teaser")

2. Units
	* em or % for dimensions, generally no px

3. CSS preprocessors
	* Use mixins and placeholders for repeating styles
	* Define Colors globally
	* Nest your classes as little as possible

4. JS
	* Use unobtrusive JS

5. Vendor code
	* Use Bower --> bower.json
