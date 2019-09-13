'use strict';

var _ = require('lodash'),
	path = require('path'),
	util = require('gulp-util'),
	error = require('./errors');

module.exports = {
	getEntries: function(src, srcBase, transformKey) {
		var entries = _.keyBy(src, function(file) {
				var key = path.relative(srcBase, file).replace(path.extname(file), '');

				if (transformKey) {
					key = transformKey(key, srcBase, file);
				}

				return key;
			});

		return entries;
	},

	log: function(err, stats, taskName) {
		if (err) {
			return error({
				task: taskName,
				err: err.message
			});
		}

		util.log(taskName, stats.toString({
			colors: util.colors.supportsColor,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false,
			modules: false,
			children: true,
			version: true,
			cached: false,
			cachedAssets: false,
			reasons: false,
			source: false,
			errorDetails: false,
			assetsSort: 'name'
		}));

		if (stats.compilation.errors.length) {
			error({
				task: taskName,
				err: 'Webpack error (see details above)'
			});
		}
	}
};
