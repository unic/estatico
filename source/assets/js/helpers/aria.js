/*

Aria Helper
-----------

Start the debugging with ctrl+a (same to switch to next mode)

*/

estatico.helpers.aria = function() {

	'use strict';

	var mode = 0,
		dataAttribute = 'bookmarkletlog';

	document.onkeydown = function(e) {
		e = e || window.event;

		if (e.keyCode === 65 && e.ctrlKey){ // ctrl+a
			console.log('aria debugging started');
			app();
		}

	};

	function app(){

		// Set the mode we're in (1 = active element, 2 = all aria elements):

		if (!mode){
			mode = 1;
		} else {
			mode++;
		}

		// Add some css to the document so we visually see which elemnt has focus:

		var mainColor = 'rgba(0,100,255,0.2)',
			activeColor = 'rgba(255,0,0,0.2)',
			mainBorderStyle = 'inset 0 0 0 4px '+mainColor,
			activeBorderStyle = 'inset 0 0 0 4px '+activeColor,
			newCSS,
			tag;

		// Create the styles:
		
		newCSS = '.aria-debugging-bookmarklet{position:relative !important;box-shadow: '+mainBorderStyle+' !important;-webkit-box-shadow: '+mainBorderStyle+' !important;-moz-box-shadow: '+mainBorderStyle+' !important}';
		newCSS += '.aria-debugging-bookmarklet::after{z-index:9999999 !important;position:absolute !important;top:-15px !important;left:0 !important;white-space:nowrap !important;background:'+mainColor+' !important;color:#000 !important;font-size:10px !important;content:attr(data-'+dataAttribute+') !important}';
		newCSS += '.aria-debugging-active-bookmarklet{z-index:9999999 !important;box-shadow: '+activeBorderStyle+' !important;-webkit-box-shadow: '+activeBorderStyle+' !important;-moz-box-shadow: '+activeBorderStyle+' !important}';

		// Add all new styles to the document:

		if ('\v' === 'v'){
			document.createStyleSheet().cssText = newCSS;
		} else {
			tag = document.createElement('style');
			tag.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(tag);
			tag[ (typeof document.body.style.WebkitAppearance === 'string') ? 'innerText' : 'innerHTML' ] = newCSS;
		}

		// Do the magic! ;-)

		if (mode === 1){

			// Add class to the active element: 
			
			addActiveElement();

		} else if (mode === 2) {

			removeActiveElement();

			addClassToAriaElements();
			
		} else {

			removeClassFromAriaElements();

		}

	}

	function addActiveElement(){

		// Add class to the active element: 

		var activeEl = null;

		window._activeElInterval = setInterval(function() {

			window._currentActiveEl = document.activeElement;

			if (window._currentActiveEl !== activeEl) {

				if (activeEl !== null){
					activeEl.classList.remove('aria-debugging-active-bookmarklet');
				}

				activeEl = window._currentActiveEl;
				console.log(activeEl);

				window._currentActiveEl.classList.add('aria-debugging-active-bookmarklet');

			}

		}, 200);

	}

	function removeActiveElement(){

		// Remove active element:

		clearInterval(window._activeElInterval);
		window._currentActiveEl.classList.remove('aria-debugging-active-bookmarklet');

		delete window._activeElInterval;
		delete window._currentActiveEl;

	}

	function addClassToAriaElements(){

		var nodeList,
			log,
			i,
			j;

		// Add class to all aria elements:
		
		nodeList = document.getElementsByTagName('*');

		for (i = 0; i < nodeList.length; i++) {

			log = '';

			for (j = nodeList[i].attributes.length - 1; j >= 0; j--){
				if (nodeList[i].attributes[j].name === 'role' || nodeList[i].attributes[j].name.substring(0, 5) === 'aria-'){
					log += '['+nodeList[i].attributes[j].name+'='+nodeList[i].attributes[j].value+']';
				}
			}

			if (log !== ''){
				console.log(nodeList[i], log);
				nodeList[i].classList.add('aria-debugging-bookmarklet');
				nodeList[i].dataset[dataAttribute] = log;
			}

		}

	}

	function removeClassFromAriaElements(){

		var nodeList,
			i;

		// Remove aria elements:

		nodeList = document.getElementsByTagName('*');

		for (i = 0; i < nodeList.length; i++) {
			nodeList[i].classList.remove('aria-debugging-bookmarklet');
		}

		mode = 0;

	}
	
};