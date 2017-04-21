'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../../data/default.data.js'),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Media demo',
			jira: 'JIRA-3'
		}
	});

module.exports = data;
