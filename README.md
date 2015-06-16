# Estático

Static site generator for frontend unicorns. 

Estático has been born as a result of a collective work of our frontend team. We use it in our daily work for rapid creation of clean, modern, maintainable static websites.

## See it in action

[![Screenshot from Screencast](http://img.youtube.com/vi/QlDc0zOyBDE/0.jpg)](https://www.youtube.com/watch?v=QlDc0zOyBDE)

## Features overview

- Static web server with livereload functionality and file watcher
- Modular architecture support:
	- [Preview](http://unic.github.io/estatico) of modules with demo, source code and documentation
	- Scaffolding for easy creation of empty modules and pages
	- Automated generation of production-ready CSS and JavaScript from your modules' sources (with minified versions and sourcemaps)
	- Templating engine provides more logic for modules and pages
	- Separate layer for data (to keep it away from code)
- Automatically generated [basic living styleguide](http://unic.github.io/estatico) for your project, which includes:
	- List of colors used in project (define your color palette via [ColorSchemer](https://www.colorschemer.com) or as JSON, CSS variables will be created automatically)
	- Fonts and typography overview
	- Form elements overview
	- Overview of atomic components, like images, lists, etc.
- Automated icon solutions:
	- Icon fonts generation
	- SVG data urls with PNG fallback
	- PNG sprites
- Convenient way of dealing with breakpoints (once configured in CSS they become available in both CSS and JavaScript)

## Getting started

```bash
git clone https://github.com/unic/estatico.git
cd estatico

# Install dependencies
npm install

# Install Gulp globally if not already present
npm install -g gulp

# Run
gulp --dev
```

## Documentation

### Setup / Usage

See [docs/Setup_and_Usage.md](docs/Setup_and_Usage.md)

### Tasks

See [docs/Tasks.md](docs/Tasks.md)

### Coding Guidelines

See [docs/Coding_Guidelines.md](docs/Coding_Guidelines.md)

## License

Apache 2.0.
