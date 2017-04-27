'use strict';

var _ = require('lodash'),
	errors = require('./errors.js'),
	glob = require('glob'),
	path = require('path'),
	callsite = require('callsite'),
	cheerioParse = require('cheerio').load,
	requireNew = require('require-new'),
	fs = require('fs'),
	Highlight = require('highlight.js'),
	marked = require('marked'),
	defaultData = requireNew('../source/data/default.data.js'),
	fileCache = {},
	getFile = function(requirePath) {
		var cache = fileCache[requirePath],
			mtime = fs.statSync(requirePath).mtime,
			content;

		// Only read file if modified since last time
		if (!cache || (cache.mtime.getTime() !== mtime.getTime())) {
			content = fs.readFileSync(requirePath).toString();

			cache = {
				mtime: mtime,
				content: content
			};

			fileCache[requirePath] = cache;
		}

		return cache.content;
	};

marked.setOptions({
	highlight: function(code) {
		return Highlight.highlightAuto(code).value;
	}
});

module.exports = {
	getDataGlob: function(fileGlob, dataTransform) {
		var data = {},
			paths = glob.sync(fileGlob);

		_.each(paths, function(filePath) {
			var requirePath = path.resolve(filePath),
				fileName = path.basename(filePath).replace('.data.js', ''),
				fileData = requireNew(requirePath);

			// Optional data transformation
			if (dataTransform) {
				fileData = dataTransform(fileData, filePath);
			}

			data[fileName] = fileData;
		});

		return data;
	},

	getTestScriptPath: function(filePath) {
		var stack = callsite(),
			requester = stack[1].getFileName(),
			requirePath = path.resolve(path.dirname(requester), filePath),
			scriptPath = path.join('/test/', path.relative('./', requirePath));

		// Fix path on windows
		scriptPath = scriptPath.replace(new RegExp('\\' + path.sep, 'g'), '/');

		return scriptPath;
	},

	getTemplateCode: function(filePath) {
		var stack = callsite(),
			requester = stack[1].getFileName(),
			requirePath = path.resolve(path.dirname(requester), filePath),
			content = getFile(requirePath),
			highlighted = Highlight.highlight('html', content).value;

		// Link the used sub modules (excludes partials starting with underscore)
		return highlighted.replace(/({{&gt;[\s"]*)(([\/]?[!a-z][a-z0-9-_]+)+)([\s"}]+)/g, '$1<a href="/$2.html">$2</a>$4');
	},

	getDataMock: function(filePath) {
		var stack = callsite(),
			requester = stack[1].getFileName(),
			requirePath = path.resolve(path.dirname(requester), filePath),
			content = requireNew(requirePath);

		content = JSON.stringify(content, null, '\t');

		return Highlight.highlight('json', content).value;
	},

	getDocumentation: function(filePath) {
		var stack = callsite(),
			requester = stack[1].getFileName(),
			requirePath = path.resolve(path.dirname(requester), filePath),
			content = getFile(requirePath);

		return marked(content);
	},

	getColors: function(filePath) {
		var stack = callsite(),
			requester = stack[1].getFileName(),
			requirePath = path.resolve(path.dirname(requester), filePath),
			colors = [],
			content,
			$;

		try {
			content = fs.readFileSync(requirePath).toString();

			if (path.extname(requirePath) === '.html') {
				// Parse HTML export from ColorSchemer
				$ = cheerioParse(content);

				$.root().find('.caption').each(function() {
					var $color = $(this),
						$name = $color.contents().eq(0),
						$hex = $color.contents().eq(1);

					if ($name.length && $hex.length) {
						colors.push({
							name: $name.text(),
							color: $hex.text().split(' ')[1]
						});
					}
				});
			} else {
				colors = _.map(JSON.parse(content), function(value, key) {
					return {
						name: key,
						color: value
					};
				});
			}

			colors = _.map(colors, function(color) {
				// Remove non-aphanumeric characters
				color.name = color.name.replace(/\W/g, '');

				return color;
			});
		} catch (err) {
			errors(err);
		}

		return colors;
	},
	getSVGSprites() {
		var spriteTask = require('../gulp/media/svgsprite.js');

		return _.mapValues(spriteTask.taskConfig.src, function(globs) {
			var files = [];

			globs.forEach(function(item) {

				var paths = glob.sync(item);

				paths = paths.map(function(file) {
					return path.basename(file, path.extname(file));
				});

				files = files.concat(paths);
			});

			return files;
		});
	},
	getDefaultData() {
		return defaultData;
	},
	getExtendedData(data) {
		return _.extend({}, defaultData, data);
	},
	tools: {
		requireNew: requireNew,
		map: _.map,
		extend: _.extend
	}
};
