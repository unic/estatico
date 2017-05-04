'use strict';

var path = require('path'),
	glob = require('glob'),
	fs = require('fs'),
	Twig = require('twig');

Twig.cache(false);

module.exports = {
	render: function(template, data) {
		return Twig.twig({
			allowInlineIncludes: true,
			data: template,
			rethrow: true
		}).render(data);
	},

	registerIncludes: function(config, cache) {
		config.forEach(function(pattern) {
			glob.sync(pattern).forEach(function(file) {
				var id = path.relative('./source', file),
					changed = fs.statSync(file).mtime,
					content;

				// Skip registering if include has not changed since last time
				if (cache[id] && cache[id].getTime() === changed.getTime()) {
					return;
				}

				cache[id] = changed;

				content = fs.readFileSync(file, 'utf8').toString();

				Twig.twig({
					id: id,
					data: content
				});
			});
		});
	}
};
