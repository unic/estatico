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
// @param {String} name - Partial path, can contain placeholder as "{{key}}" where "key" is a property of the context data
// @param {Object} data - Data to pass to compile function
handlebars.registerHelper('dynamicPartial', function(name, data, context) {
	var placeholders = name.match(/{{(.*?)}}/g),
		template,
		output;

	_.each(placeholders, function(placeholder) {
		var key = placeholder.replace(/({|})/g, ''),
			value = data[key] || (context ? context.data.root[key] : data.data.root[key]);

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

	output = template(data || context).replace(/^\s+/, '');

	return new handlebars.SafeString(output);
});
