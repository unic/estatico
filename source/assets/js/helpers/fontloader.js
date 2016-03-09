import Helper from './helper';

class FontLoader extends Helper {

	constructor() {
		super();

		// once cached, the css file is stored on the client forever unless
		// the URL below is changed. Any change will invalidate the cache
		this.cssHref = '/assets/css/fonts.css?v1';
		this.logger = this.log('FontLoader');

		// if we have the fonts in localStorage or if we've cached them using the native browser cache
		if ((window.localStorage && localStorage.fontCssCache) || document.cookie.indexOf('fontCssCache') > -1) {
			// just use the cached version
			this.logger('just use the cached version');

			this.injectFontsStylesheet();
		} else {
			// otherwise, don't block the loading of the page; wait until it's done.
			this.logger('download fonts');

			this.on(window, 'load', this.injectFontsStylesheet);
		}
	}

	// determine whether a css file has been cached locally
	fileIsCached(href) {
		return window.localStorage && localStorage.fontCssCache && (localStorage.fontCssCacheFile === href);
	}

	// this is the simple utility that injects the cached or loaded css text
	injectRawStyle(text) {
		var style = document.createElement('style');

		// cater for IE8 which doesn't support style.innerHTML
		style.setAttribute('type', 'text/css');

		if (style.styleSheet) {
			style.styleSheet.cssText = text;
		} else {
			style.innerHTML = text;
		}

		document.getElementsByTagName('head')[0].appendChild(style);
	}

	// get the actual css file
	injectFontsStylesheet() {
		var xhr,
			stylesheet;

		if (!window.localStorage || !window.XMLHttpRequest) {
			// if this is an older browser

			stylesheet = document.createElement('link');
			stylesheet.href = this.cssHref;
			stylesheet.rel = 'stylesheet';
			stylesheet.type = 'text/css';

			document.getElementsByTagName('head')[0].appendChild(stylesheet);

			// just use the native browser cache
			// this requires a good expires header on the server
			document.cookie = 'fontCssCache';

		} else {
			// if this isn't an old browser

			// use the cached version if we already have it
			if (this.fileIsCached(this.cssHref)) {
				this.injectRawStyle(localStorage.fontCssCache);
			} else {
				// otherwise, load it with ajax
				xhr = new XMLHttpRequest();
				xhr.open('GET', this.cssHref, true);

				// cater for IE8 which does not support addEventListener or attachEvent on XMLHttpRequest
				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4) {

						// once we have the content, quickly inject the css rules
						this.injectRawStyle(xhr.responseText);

						// and cache the text content for further use
						// notice that this overwrites anything that might have already been previously cached
						localStorage.fontCssCache = xhr.responseText;
						localStorage.fontCssCacheFile = this.cssHref;
					}

				};

				xhr.send();
			}
		}
	}
}

export default FontLoader;
