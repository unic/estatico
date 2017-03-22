'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: 02 Page (custom teasers)'
		},
		title: 'Page (custom teasers)',
		text: 'This page demonstrates the inclusion of a module with custom data.',
		modules: {
			skiplinks: requireNew('../../modules/skiplinks/skiplinks.data.js'),
			teasers: {
				teasers: _.map(['Custom Teaser 1', 'Custom Teaser 2', 'Custom Teaser 3'], function(value) {
					return {
						title: value,
						text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
					};
				})
			}
		}
	});

module.exports = data;
