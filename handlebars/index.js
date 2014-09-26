'use strict';

// Handlebars
var handlebars = require('handlebars');

// Make handlebars layout helpers available
require('handlebars-layouts')(handlebars);

// Make specific assemble helpers available
// Example: Use the comparisons provided by the handlebars-helpers package
//require('./node_modules/handlebars-helpers/lib/helpers/helpers-comparisons.js').register(handlebars);


// Custom Handlebars Helper

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
