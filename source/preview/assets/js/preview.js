/**
 * Activate tree for viewport > small
 */

const deactivateTree = function() {
		if (document.documentElement.clientWidth < 661) {
			document.getElementById('sg__tree_trigger').checked = false;
		}
	},

	// Reusing https://developer.mozilla.org/en-US/docs/Web/Events/resize
	throttle = function(type, name, target) {
		let running = false,
			eventTarget = target || window,
			listener = function() {
				if (!running) {
					running = true;
					requestAnimationFrame(function() {
						eventTarget.dispatchEvent(new CustomEvent(name));
						running = false;
					});
				}
			};

		eventTarget.addEventListener(type, listener);
	};

// init - you can init any event
throttle('resize', 'optimizedResize');

// toggle tree if needed at the beginning
deactivateTree();

// handle event
window.addEventListener('optimizedResize', function() {
	deactivateTree();
});

