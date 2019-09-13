# Frontend architecture

## Configure Estático JS

Estático offers an unprocessed (by Webpack) JS file that sets the global _**`estatico`**_ object in the _**`<head />`**_ of the document.

This option is dependant on a flag that has to be provided when executing gulp. Depending on the flag different configuration files can be loaded:

- _**`–-local`**_: it will load _**`/assets/js/configs/local.js`**_
- _**`--acceptance`**_: it will load _**`/assets/js/configs/local.js`**_

This split is useful when needing different configurations or data depending on the environment where the build will be hosted. For instance:

- We may want to work with a database or an specific set of configurations when developing locally, so we add the needed configuration in _**`/assets/js/configs/local.js`**_ and run _**`npm start -- --local`**_ to develop
- We may want to build static assets for a simple preview server, for which no configuration would be needed, so we run _**`npm run build`**_ to generate the build without any extra configuration
- Finally we want to build static assets for an "acceptance" server that will require of a different database or a different set of configurations, so we run _**`npm run build -- --acceptance`**_ to generate the build that will include the _**`/assets/js/configs/acceptance.js`**_ file.

To change or manage which file(s) can be loaded depending on a flag you can have a look at the [layout.hbs](http://latest.concorel.fe-preview.unic.com/layouts/layout.html)

## Fonts loading

Estático loads fonts using a deferred font loading logic: asynchronously and storing them in localStorage as caching mechanism to improve load times. The result is a single download of the needed fonts the first time the page is visited. Subsequent visits will use the cached fonts.

To achieve this, we encode the fonts in base64 and save them all in _**`/assets/css/fonts.css`**_. Then, with JS it is checked if the file has been cached or not, and finally loaded only if needed.

There is a validation mechanism in place to invalidate the cache: **the path and filename of the css**. We can add as many arguments the the filename as wanted to control this: so instead of requiring _**`/assets/css/fonts.css`**_ we can require _**`/assets/css/fonts.css?v=1`**_. Whenever we need to update fonts, we can update the _**`fonts.css`**_ file and update its call to _**`/assets/css/fonts.css?v=2`**_, which will invalidate the cache ind trigger a new download.

To specify the load path you can use a [configuration file](#configure-estatico-js)
