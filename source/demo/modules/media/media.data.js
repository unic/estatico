'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Media demo',
			jira: 'JIRA-3',
			code: dataHelper.getTemplateCode('media.hbs')
		}
	});

module.exports = data;
