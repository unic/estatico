/**
 * Activate tree for viewport > small
 */

const activateTree = function() {
	if (document.documentElement.clientWidth <= 661) {
		document.getElementById('sg__tree_trigger').checked = false;
	}
};

// Reusing https://developer.mozilla.org/en-US/docs/Web/Events/resize
(function() {
	const throttle = function(type, name, env) {
		let running = false,
			environment = env || window,
			func = function() {
				if (!running) {
					running = true;
					requestAnimationFrame(function() {
						environment.dispatchEvent(new CustomEvent(name));
						running = false;
					});
				}
			};

		environment.addEventListener(type, func);
	};

	/* init - you can init any event */
	throttle('resize', 'optimizedResize');
})();

// handle event
window.addEventListener('optimizedResize', function() {
	activateTree();
});

activateTree();
