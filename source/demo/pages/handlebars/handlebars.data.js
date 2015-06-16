'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
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
			skiplinks: requireNew('../../modules/skiplinks/skiplinks.data.js'),
			slideshow: requireNew('../../modules/slideshow/slideshow.data.js')
		}
	});

module.exports = data;
