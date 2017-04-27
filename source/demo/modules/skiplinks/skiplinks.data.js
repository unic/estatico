'use strict';

var dataHelper = require('../../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: 'Demo: Skiplinks',
		jira: 'JIRA-5',
		code: dataHelper.getTemplateCode('skiplinks.hbs')
	},
	links: [
		{
			href: '#main',
			accesskey: 1,
			title: '[ALT + 1]',
			label: 'Skip to content'
		}
	]
});
