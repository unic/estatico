/**
 * Module inspector, outlines Estatico modules
 *
 * Start inspection with ctrl+m (same to switch off module inspection)
 */

;(function(undefined) {
	'use strict';

	estatico.helpers.inspector = {
		mode: null,
		dataAttribute: 'bookmarkletlog',

		// Add some css to the document so we visually see which elemnt has focus
		init: function() {
			var mainColor = 'rgba(100,200,255,0.4)',
				mainBorderStyle = 'inset 0 0 0 4px '+mainColor,
				newCSS,
				tag;

			// Create the styles
			newCSS = '.estatico-bookmarklet{position:relative !important;box-shadow: '+mainBorderStyle+' !important;-webkit-box-shadow: '+mainBorderStyle+' !important;-moz-box-shadow: '+mainBorderStyle+' !important}';
			newCSS += '.estatico-bookmarklet::after{text-transform:capitalize !important;z-index:9999999 !important;position:absolute !important;top:-15px !important;left:0 !important;white-space:nowrap !important;background:'+mainColor+' !important;color:#000 !important;font-size:10px !important;content:attr(data-'+this.dataAttribute+') !important}';

			// Add all new styles to the document
			if ('\v' === 'v') {
				document.createStyleSheet().cssText = newCSS;
			} else {
				tag = document.createElement('style');
				tag.type = 'text/css';

				document.getElementsByTagName('head')[0].appendChild(tag);

				tag[(typeof document.body.style.WebkitAppearance === 'string') ? 'innerText' : 'innerHTML'] = newCSS;
			}

		},

		run: function() {
			// Set the mode we're in (1 = show modules, 0 = hide modules)
			if (this.mode === null) {
				this.mode = 1;

				this.init();
			} else {
				this.mode++;
			}

			// Run the current mode
			if (this.mode === 1) {
				this.showModules();
			} else {
				this.hideModules();
			}
		},

		// Add class to all modules
		showModules: function() {
			var nodeList,
				log,
				module,
				variations,
				i,
				j;

			nodeList = document.getElementsByTagName('*');

			for (i = 0; i < nodeList.length; i++) {
				log = '';
				module = '';
				variations = [];

				for (j = nodeList[i].classList.length - 1; j >= 0; j--) {
					if (nodeList[i].classList[j].substring(0, 4) === 'mod_') {
						module = nodeList[i].classList[j].substring(4).replace(/_/g, ' ');
					}

					if (nodeList[i].classList[j].substring(0, 4) === 'var_') {
						variations.push( nodeList[i].classList[j].substring(4).replace(/_/g, ' ') );
					}
				}

				if (module !== '') {
					log = module;
				}

				if (variations.length > 0) {
					log += ': ' + variations.join(', ');
				}

				if (log !== '') {
					console.log(nodeList[i], log);

					nodeList[i].classList.add('estatico-bookmarklet');
					nodeList[i].dataset[this.dataAttribute] = log;
				}
			}
		},

		// Remove class from modules
		hideModules: function() {
			var nodeList,
				i;

			nodeList = document.getElementsByTagName('*');

			for (i = 0; i < nodeList.length; i++) {
				nodeList[i].classList.remove('estatico-bookmarklet');
			}

			this.mode = 0;
		}
	};

})();
