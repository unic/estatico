;(function(undefined) {
	'use strict';

	estatico.helpers.fontsLoader = (function() {

		// once cached, the css file is stored on the client forever unless
		// the URL below is changed. Any change will invalidate the cache
		var cssHref = '/assets/css/fonts.css?v1',

		// determine whether a css file has been cached locally
			fileIsCached = function(href) {
				return window.localStorage && localStorage.fontCssCache && (localStorage.fontCssCacheFile === href);
			},

			// this is the simple utility that injects the cached or loaded css text
			injectRawStyle = function(text) {
				var style = document.createElement('style');

				// cater for IE8 which doesn't support style.innerHTML
				style.setAttribute('type', 'text/css');
				if (style.styleSheet) {
					style.styleSheet.cssText = text;
				} else {
					style.innerHTML = text;
				}

				document.getElementsByTagName('head')[0].appendChild(style);
			},

		// get the actual css file
			injectFontsStylesheet = function() {
				var xhr,
					stylesheet;

				if (!window.localStorage || !window.XMLHttpRequest) {
					// if this is an older browser

					stylesheet = document.createElement('link');
					stylesheet.href = cssHref;
					stylesheet.rel = 'stylesheet';
					stylesheet.type = 'text/css';
					document.getElementsByTagName('head')[0].appendChild(stylesheet);

					// just use the native browser cache
					// this requires a good expires header on the server
					document.cookie = 'fontCssCache';

				} else {
					// if this isn't an old browser

					// use the cached version if we already have it
					if (fileIsCached(cssHref)) {
						injectRawStyle(localStorage.fontCssCache);
					} else {
						// otherwise, load it with ajax
						xhr = new XMLHttpRequest();
						xhr.open('GET', cssHref, true);

						// cater for IE8 which does not support addEventListener or attachEvent on XMLHttpRequest
						xhr.onreadystatechange = function() {
							if (xhr.readyState === 4) {

								// once we have the content, quickly inject the css rules
								injectRawStyle(xhr.responseText);

								// and cache the text content for further use
								// notice that this overwrites anything that might have already been previously cached
								localStorage.fontCssCache = xhr.responseText;
								localStorage.fontCssCacheFile = cssHref;
							}

						};

						xhr.send();
					}
				}
			};

		return {
			init: function() {
				// if we have the fonts in localStorage or if we've cached them using the native browser cache
				if ((window.localStorage && localStorage.fontCssCache) || document.cookie.indexOf('fontCssCache') > -1) {

					// just use the cached version
					console.log('just use the cached version');
					injectFontsStylesheet();
				} else {

					// otherwise, don't block the loading of the page; wait until it's done.
					console.log('download fonts');
					estatico.helpers.on(window, 'load', injectFontsStylesheet);
				}
			}
		};

	})();

})();
