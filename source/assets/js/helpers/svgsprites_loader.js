/* global ActiveXObject: false */

/*!
 * SVG Icon Sprite Loader
 *
 * @author Unic AG
 * @copyright Unic AG
 */

'use strict';

var loadSvgSprites = function() {

	var id = 'mod_svgsprites',
		oReq,
		spritesToLoad = JSON.parse(document.body.getAttribute('data-svgsprites-options')) || [],
		spritesAmount = spritesToLoad.length,
		spriteContainer = document.createElement('div');

	// If sprite was already added, do not execute further
	if (document.getElementById(id) !== null) {
		return false;
	}

	/**
	 * Check if we can send a XMLHttpRequest
	 * @returns {*}
	 */
	function getXMLHttpRequest() {
		if (window.XMLHttpRequest) {
			return new window.XMLHttpRequest();
		} else {
			try {
				return new ActiveXObject('MSXML2.XMLHTTP.3.0');
			} catch (e) {
				return null;
			}
		}
	}

	/**
	 * RequestSVG
	 * @param url -> string holding the url to the svg file
	 * @constructor
	 */
	function RequestSVG(url) {
		var oReq = getXMLHttpRequest(),
			$container = document.getElementById(id),
			handler = function() {
				if (oReq.readyState === 4) { // complete
					if (oReq.status === 200) {
						$container.innerHTML = $container.innerHTML + oReq.responseText;
					}
				}
			};

		oReq.open('GET', url, true);
		oReq.onreadystatechange = handler;
		oReq.send();
	}

	/**
	 * Send getXMLHttpRequest for each SVG sprite reference
	 * found in the data-icon-sets attribute on the body tag
	 */
	if (spritesAmount > 0 && (document.getElementById(id) === null)) {
		var i = spritesAmount,
			html = document.getElementsByTagName('html')[0];

		oReq = getXMLHttpRequest();

		if (oReq !== null) {
			spriteContainer.setAttribute('id', id);
			spriteContainer.setAttribute('data-svgsprites', 'wrapper'); // for potential later usage within JavaScript
			spriteContainer.setAttribute('style', 'display: none');

			document.body.appendChild(spriteContainer);
			while (i--) {
				var request = new RequestSVG(spritesToLoad[i]); // jshint ignore:line
			}

			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(function() {
					html.setAttribute('class', html.getAttribute('class') + ' svgSpritesLoaded');
				});
			}

		}
	}
};

/**
 * In some rare cases DOMContentLoaded already happend before we end up here.
 * To make sure that the icons are getting loaded we add the second call as well
 */
document.addEventListener('DOMContentLoaded', loadSvgSprites);
loadSvgSprites();
