# SETUP

## Dependencies

* Node, [yarn](https://yarnpkg.com/) (preferably using [nvm](https://github.com/creationix/nvm))
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
yarn
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
yarn start
# This will run "gulp --dev"
# dev flag makes sure the server and watcher don't crash on error
```

Build:

```shell
yarn run build

# Dev version:
yarn run build -- --dev
```

Run specific tasks like `css`:

```shell
yarn run gulp -- css
# Alternative: Install gulp globally and run "gulp css"

# Dev version
yarn run gulp -- css --dev
# Alternative: Install gulp globally and run "gulp css --dev"
```

Install new npm dependency "foo" (used for client-side code, saved to `dependencies`):

```shell
yarn add foo --exact
```

Install new npm dependency "bar" (used for the build environment, saved to  `devDependencies`):

```shell
yarn add bar --dev --exact
```


----


# SPECIAL FEATURES

## Source Maps

Estático generates source maps for both CSS and JS. How to enable them in your browser:

* [Chrome](https://developer.chrome.com/devtools/docs/javascript-debugging#source-maps)
* [Firefox](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map)
* [IE](http://blogs.msdn.com/b/davrous/archive/2014/08/22/enhance-your-javascript-debugging-life-thanks-to-the-source-map-support-available-in-ie11-chrome-opera-amp-firefox.aspx)
