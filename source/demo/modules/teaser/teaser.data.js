'use strict';

var dataHelper = require('../../../../helpers/data.js'),
	data = dataHelper.getExtendedData({
		meta: {
			title: 'Demo: Teaser with module variants',
			code: dataHelper.getTemplateCode('teaser.hbs')
		},
		title: 'Teaser title',
		text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
		variant: null
	});

data.variants = {
	noText: {
		meta: {
			title: 'No text',
			desc: 'Used when there are no words.'
		},
		title: 'Teaser title'
	},
	inverted: {
		meta: {
			title: 'Inverted',
			desc: 'Used at night. Set `variant` to `var_inverted`.'
		},
		title: 'Teaser title',
		text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
		variant: 'var_inverted'
	}
};

module.exports = data;
