# FAQ

## My CSS source maps are off after changing the CSS. WHY?

Livereload injects edited CSS into the page without a complete reload (which is very handy since it is pretty fast). However, the corresponding source map is not reloaded. In order to have an updated source map after changing the CSS, the page has to be reloaded manually.

## How to log to the console

Thanks to [@d-simon](https://github.com/unic/estatico/pull/3), Estático provides a fancy wrapper for `console.log` available in `estatico.helpers.log`. It takes an optional namespace argument.

```js
var log = estatico.helpers.log('YAY');
log('bla');

> YAY ☞ bla
```

When in `--dev` mode, [bows](https://github.com/latentflip/bows) is used to have colourful logging and be able to filter specific logs. To disable it, `assets/js/dev.js` has to be edited.

When **not** in `--dev` mode, logging is disabled by default. Run the following command in your console to enable it:

```js
localStorage.debug = true
```

To disable again:

```js
localStorage.removeItem('debug')
```
