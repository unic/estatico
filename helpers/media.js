'use strict';

module.exports = {
	hasGraphicsMagick: function() {
		var spawn = require('child_process').spawnSync('gm', ['-version']);

		return !(spawn.error || spawn.stderr.toString());
	}
};
