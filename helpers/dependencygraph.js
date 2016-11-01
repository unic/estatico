'use strict';

/**
 * Very basic, flat dependency graph
 * Smarter one would probably make use of https://www.npmjs.com/package/dependency-graph
 */

var fs = require('fs'),
	_ = require('lodash');

function Graph(filePath, options) {
	this.options = _.merge({
		pattern: null,
		resolvePath: function(filePath) {
			return filePath;
		}
	}, options);

	this.cache = {};

	this.graph = [];

	this.extend(filePath);
}

Graph.prototype._getFileContent = function(filePath) {
	if (!fs.existsSync(filePath)) {
		return null;
	}

	var timestamp = fs.statSync(filePath).mtime.getTime(),
		content;

	if (this.cache[filePath] && this.cache[filePath].timestamp === timestamp) {
		return this.cache[filePath].content;
	}

	content = fs.readFileSync(filePath).toString();

	this.cache[filePath] = {
		content: content,
		timestamp: timestamp
	};

	return content;
};

Graph.prototype.extend = function(filePath) {
	if (!this.options.pattern) {
		console.log('Please provide a "pattern" option to create the dependency graph');

		return;
	}

	var content = this._getFileContent(filePath),
		matches = [],
		match,
		matchedFilePath;

	// Skip missing files
	if (!content) {
		return;
	}

	this.graph.push(filePath);

	// Find matches
	while (match = this.options.pattern.exec(content)) {
		matchedFilePath = this.options.resolvePath(match[1], filePath);

		if (this.graph.indexOf(matchedFilePath) === -1) {
			matches.push(matchedFilePath);
		}
	}

	// Add matches to graph
	matches.forEach(function(matchedFilePath) {
		this.extend(matchedFilePath, this.options);
	}.bind(this));
};

Graph.prototype.contains = function(filePath) {
	return this.graph.indexOf(filePath) > -1;
};

Graph.prototype.add = function(filePath) {
	if (!fs.existsSync(filePath) || this.graph.indexOf(filePath) !== -1) {
		return;
	}

	this.graph.push(filePath);
};

Graph.prototype.combine = function(graph) {
	this.graph = this.graph.concat(graph.graph);
};

module.exports = Graph;
