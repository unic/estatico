'use strict';

// Handlebars
var Handlebars = require('handlebars'),
	handlebarsLayouts = require('handlebars-layouts'),
	assembleHelpers = require('handlebars-helpers'),
	errors = require('./errors'),
	_ = require('lodash'),
	helpers = {};

// Make handlebars layout helpers available
_.merge(helpers, handlebarsLayouts(Handlebars));

// Make specific assemble helpers available
// See http://assemble.io/helpers/ for a documentation
// Example: Use the comparisons provided by the handlebars-helpers package
helpers.comparison = assembleHelpers.comparison();


// Custom Handlebars helpers

// Capitalize string
helpers.capitalize = function(value) {
	return new Handlebars.SafeString(
		value.charAt(0).toUpperCase() + value.substr(1)
	);
};

// Output raw block (use: {{{{raw}}}} blabla {{title}} bla{{{{/raw}}}})
helpers.raw = function(options) {
	return options.fn();
};

// Repeat something X times
helpers.times = function(n, block) {
	var output = '';

	for (var i = 0; i < n; i++) {
		output += block.fn(i);
	}

	return output;
};

// Include partial with dynamic name
// Based on http://stackoverflow.com/a/21411521
// @param {String} name - Partial path, can contain placeholder as "{{key}}"
// @param {Object} partialData - Data to pass to the partial
// @param {Object} options.replacementContext - Context to use for the placeholder replacement
helpers.dynamicPartial = function(name, partialData, options) {
	if (name === undefined) {
		errors({
			task: 'helpers/handlebars.js',
			message: 'Name for dynamicPartial undefined'
		});

		return '';
	}

	var placeholders = name.match(/{{(.*?)}}/g),
		replacementContext = options ? (options.hash.replacementContext ? options.hash.replacementContext : options.data.root) : partialData.data.root,
		template,
		output;

	_.each(placeholders, function(placeholder) {
		var key = placeholder.replace(/({|})/g, ''),
			value = replacementContext[key];

		if (value) {
			name = name.replace(placeholder, value);
		}
	});

	template = Handlebars.partials[name];

	if (template === undefined) {
		errors({
			task: 'helpers/handlebars.js',
			message: 'Dynamic template "' + name + '" not found'
		});

		return '';
	}

	if (typeof template !== 'function') {
		template = Handlebars.compile(template);
	}

	output = template(partialData).replace(/^\s+/, '');

	return new Handlebars.SafeString(output);
};

// Module preview
/*helpers.hasVariants = function(variants, options) {
	if (Object.keys(variants).length > 1) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
};*/

// Register helpers
Handlebars.registerHelper(helpers);

module.exports = {
	Handlebars: Handlebars,
	helpers: helpers
};
