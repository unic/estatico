'use strict';

var handlebars = require('handlebars');


// Remove whitespace from string
handlebars.registerHelper('removeWhiteSpace', function(value) {

	return new handlebars.SafeString(
		value.replace(/\s+/g, '')
	);
});
