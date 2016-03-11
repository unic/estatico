'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Media demo',
			jira: null,
			code: dataHelper.getTemplateCode('media.hbs')
		}
	});

module.exports = data;
