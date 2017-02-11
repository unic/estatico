'use strict';

var dataHelper = require('../../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: 'Demo: Teasers',
		jira: 'JIRA-1',
		feature: 'Feature X',
		code: dataHelper.getTemplateCode('teasers.hbs')
	},
	teasers: dataHelper.tools.map(['Teaser 1', 'Teaser 2', 'Teaser 3', 'Teaser 4'], function(value) {
		return dataHelper.tools.extend({}, require('../teaser/teaser.data.js'), {
			title: value
		});
	})
});
