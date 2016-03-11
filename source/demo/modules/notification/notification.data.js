'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Notification',
			className: 'Notification',
			jira: 'ESTATICO-137',
			code: dataHelper.getTemplateCode('notification.hbs'),
			documentation: dataHelper.getDocumentation('notification.md')
		}
	});

module.exports = data;
