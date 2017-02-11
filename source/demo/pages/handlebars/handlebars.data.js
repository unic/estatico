'use strict';

var dataHelper = require('../../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: 'Demo: 04 Handlebars helpers'
	},
	title: 'Handlebars helpers',
	text: 'This page demonstrates the use of a some handlebars helpers (see helpers/handlebars.js).',
	warning: 'WARNING: Use them with caution, they currently won\'t work on the client-side when precompiling templates.',
	partial: 'demo/modules/slideshow/slideshow',
	partialPlaceholder: 'slideshow',
	partials: [
		{
			placeholder: 'slideshow'
		}
	],
	testString: 'hello world',
	subString: 'hello',
	testString2: 'hello world',
	modules: {
		skiplinks: dataHelper.tools.requireNew('../../modules/skiplinks/skiplinks.data.js'),
		slideshow: dataHelper.tools.requireNew('../../modules/slideshow/slideshow.data.js')
	}
});
