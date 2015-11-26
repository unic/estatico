/*

Aria Helper
-----------

Start the debugging with ctrl+a (same to switch to next mode)

*/

'use strict';

estatico.helpers.aria = {

	mode: null,
	dataAttribute: 'bookmarkletlog',

	init: function(){

		// Add some css to the document so we visually see which elemnt has focus:

		var mainColor = 'rgba(0,100,255,0.2)',
			activeColor = 'rgba(255,0,0,0.2)',
			mainBorderStyle = 'inset 0 0 0 4px '+mainColor,
			activeBorderStyle = 'inset 0 0 0 4px '+activeColor,
			newCSS,
			tag;

		// Create the styles:
		
		newCSS = '.aria-debugging-bookmarklet{position:relative !important;box-shadow: '+mainBorderStyle+' !important;-webkit-box-shadow: '+mainBorderStyle+' !important;-moz-box-shadow: '+mainBorderStyle+' !important}';
		newCSS += '.aria-debugging-bookmarklet::after{z-index:9999999 !important;position:absolute !important;top:-15px !important;left:0 !important;white-space:nowrap !important;background:'+mainColor+' !important;color:#000 !important;font-size:10px !important;content:attr(data-'+this.dataAttribute+') !important}';
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

	},

	run: function(){

		// Set the mode we're in (1 = active element, 2 = all aria elements):

		if (this.mode === null){
			this.mode = 1;
			this.init();
		} else {
			this.mode++;
		}

		// Run the current mode:

		if (this.mode === 1){
			
			this.addActiveElement();

		} else if (this.mode === 2) {

			this.removeActiveElement();

			this.addClassToAriaElements();
			
		} else {

			this.removeClassFromAriaElements();

		}

	},

	addActiveElement: function(){

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

	},

	removeActiveElement: function(){

		// Remove active element:

		clearInterval(window._activeElInterval);
		window._currentActiveEl.classList.remove('aria-debugging-active-bookmarklet');

		delete window._activeElInterval;
		delete window._currentActiveEl;

	},

	addClassToAriaElements: function(){

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
				nodeList[i].dataset[this.dataAttribute] = log;
			}

		}

	},

	removeClassFromAriaElements: function(){

		var nodeList,
			i;

		// Remove aria elements:

		nodeList = document.getElementsByTagName('*');

		for (i = 0; i < nodeList.length; i++) {
			nodeList[i].classList.remove('aria-debugging-bookmarklet');
		}

		this.mode = 0;

	}
	
};