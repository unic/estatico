# FAQ

## My CSS source maps are off after changing the CSS. WHY?

Livereload injects edited CSS into the page without a complete reload (which is very handy since it is pretty fast). However, the corresponding source map is not reloaded. In order to have an updated source map after changing the CSS, the page has to be reloaded manually.
