'use strict';

// Handlebars
var handlebars = require('handlebars');

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
handlebars.registerHelper('dynamicPartial', function(name, context) {
	var template = handlebars.partials[name],
		output;

	if (typeof template !== 'function') {
		template = handlebars.compile(template);
	}

	output = template(context).replace(/^\s+/, '');

	return new handlebars.SafeString(output);
});
