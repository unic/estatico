'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../../data/default.data.js'),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Skiplinks',
			jira: 'JIRA-5'
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

module.exports = data;
