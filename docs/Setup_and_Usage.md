# SETUP

## Dependencies

* Node, NPM (preferably using [nvm](https://github.com/creationix/nvm)).
* Ruby and [bundler](http://bundler.io/) for Sass.

## General setup

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

# see debugging steps below
```

Install Sass:

```shell
bundle install
```


----


# USAGE

Use nvm in current bash session (if already used to install dependencies):

```shell
nvm use
```

Start server:

```shell
gulp --dev
# local version: node_modules/.bin/gulp --dev
# dev flag makes sure the server and watcher don't crash on error
```

Build:

```shell
gulp build
# local version: node_modules/.bin/gulp build
```

Install new bower dependency "xy":

```shell
bower install xy --save
# local version: node_modules/.bin/bower install xy --save
```


----


# SPECIAL FEATURES

## Sourcemaps

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

## Add new module

Create module "accordion" based on ```source/modules/.scaffold/```.

```shell
gulp mod -n accordion
# local version: node_modules/.bin/gulp mod -n accordion
# flags: --nojs to skip creation of accordion.js, --nocss to skip creation of accordion.scss
```

The generated JS and SCSS files are automagically added to ```main.js``` and ```main.scss```, respectively.


----


# DEBUGGING

If "npm install" fails (e.g. ERR cb() never called):

```shell
# Update npm to at least 2.1.2
npm install -g npm@2.1.2

# Clean up
rm -rf node_modules
npm cache clean

# Try again
npm install
```

If "npm install" still fails:

```shell
# Remove npm-shrinkwrap.json
rm npm-shrinkwrap.json

# Clean up
rm -rf node_modules
npm cache clean

# Try again
npm install

# Re-generate npm-shrinkwrap.json
npm shrinkwrap

# Make sure the new npm-shrinkwrap.json works on Jenkins
```

If "npm install" prompts for username/password but mangles the input:

```shell
npm config set spin false
npm config set loglevel http
```

