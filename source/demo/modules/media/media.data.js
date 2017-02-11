'use strict';

var dataHelper = require('../../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: 'Demo: Media demo',
		jira: 'JIRA-3',
		code: dataHelper.getTemplateCode('media.hbs')
	}
});
