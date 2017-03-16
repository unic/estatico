# SETUP

## Dependencies

* Node, npm (preferably using [nvm](https://github.com/creationix/nvm))
* [GraphicsMagick](http://www.graphicsmagick.org/) for resizing images using the `media:imageversions` tasks
* Optional: [Vagrant](https://www.vagrantup.com/)

## Install

Recommendation: Use nvm to allow for a standardized node environment:

```shell
nvm use
# if the specified version is not yet present: nvm install
```

Install dependencies:

```shell
npm install
# Shortcut: npm i
```

## Options

Use Vagrant:

```shell
# Start box (downloads it initially)
vagrant up

# Connect to box and move to project directory
vagrant ssh
cd /vagrant/

# Continue above (nvm is preinstalled in the box)
```


----


# USAGE

Use nvm in current bash session (if already used to install dependencies or using the Vagrant box):

```shell
nvm use
```

Start server. Access on http://localhost:9000 (or http://192.168.33.10:9000 when using Vagrant):

```shell
npm start
# This will run "gulp --dev"
# dev flag makes sure the server and watcher don't crash on error
```

Start server with an specific configuration, either `local` or `acceptance`:

```shell
npm start -- --local
```

Build:

```shell
npm run build

# Dev version:
npm run build -- --dev
```

Run specific tasks like `css`:

```shell
npm run gulp -- css
# Alternative: Install gulp globally and run "gulp css"

# Dev version
npm run gulp -- css --dev
# Alternative: Install gulp globally and run "gulp css --dev"
```

Install new npm dependency "foo" (used for client-side code, saved to `dependencies`):

```shell
npm install foo --save --save-exact
# Shortcut: npm i foo -S -E

npm shrinkwrap --dev
```

Install new npm dependency "bar" (used for the build environment, saved to  `devDependencies`):

```shell
npm install bar --save-dev --save-exact
# Shortcut: npm i bar -D -E

npm shrinkwrap --dev
```


----


# SPECIAL FEATURES

## Source Maps

Estático generates source maps for both CSS and JS. How to enable them in your browser:

* [Chrome](https://developer.chrome.com/devtools/docs/javascript-debugging#source-maps)
* [Firefox](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map)
* [IE](http://blogs.msdn.com/b/davrous/archive/2014/08/22/enhance-your-javascript-debugging-life-thanks-to-the-source-map-support-available-in-ie11-chrome-opera-amp-firefox.aspx)

----


# DEBUGGING

If "npm install" fails (e.g. ERR cb() never called):

```shell
# Update npm to latest version
npm install -g npm@latest

# Clean up
rm -rf node_modules
npm cache clean

# Try again
npm install
```

Log everything to get an idea of where it fails:

```shell
npm config set spin false
npm config set loglevel http

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

# Re-generate npm-shrinkwrap.json (including devDependencies)
npm shrinkwrap --dev

# Make sure the new npm-shrinkwrap.json works in the CI environment
```
