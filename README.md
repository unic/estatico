# [PROJECT NAME] [YEAR]

[SHORT DESCRIPTION]


---


## LINKS

* Code repository: [URL]
* Jira: [URL]
* Jenkins: [URL]
* Preview server: [URL]


---


## DEVELOPERS

* [NAME / SHORT NAME] [YEAR]


---


## SETUP

### Dependencies

Node, NPM.

### Usage

1. Install node and bower dependencies:

```shell
npm install
bower install
# local version: node_modules/.bin/bower install
```

2. Start server

```shell
gulp
# local version: node_modules/.bin/gulp
```

3. Build

```shell
gulp build
# local version: node_modules/.bin/gulp build
```

4. Update bower dependencies

```shell
bower install
# local version: node_modules/.bin/bower install
```


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
