'use strict';

// Handlebars
var handlebars = require('handlebars'),
	errors = require('./errors.js'),
	_ = require('lodash');

// Make handlebars layout helpers available
require('handlebars-layouts')(handlebars);

// Make specific assemble helpers available
// See http://assemble.io/helpers/ for a documentation
//
// Example: Use the comparisons provided by the handlebars-helpers package
require('../node_modules/handlebars-helpers/lib/helpers/helpers-comparisons.js').register(handlebars);
//
// WARNING: For some helpers, grunt has to be installed (npm install grunt --save && npm shrinkwrap)
// This might be fixed at some point: https://github.com/assemble/handlebars-helpers/pull/157


// Custom Handlebars helpers

// Remove whitespace from string
handlebars.registerHelper('removeWhiteSpace', function(value) {
	return new handlebars.SafeString(
		value.replace(/\s+/g, '')
	);
});

// Output raw block (use: {{{{raw}}}} blabla {{title}} bla{{{{/raw}}}})
handlebars.registerHelper('raw', function(options) {
  return options.fn();
});

// Include partial with dynamic name
// Based on http://stackoverflow.com/a/21411521
// @param {String} name - Partial path, can contain placeholder as "{{key}}"
// @param {Object} partialData - Data to pass to the partial
// @param {Object} options.partialContext - Context to use for the placeholder replacement
handlebars.registerHelper('dynamicPartial', function(name, partialData, options) {
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

	template = handlebars.partials[name];

	if (template === undefined) {
		errors({
			task: 'helpers/handlebars',
			message: 'Dynamic template "'+ name +'" not found'
		});

		return '';
	}

	if (typeof template !== 'function') {
		template = handlebars.compile(template);
	}

	output = template(partialData).replace(/^\s+/, '');

	return new handlebars.SafeString(output);
});
