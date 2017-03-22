'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js'),
	teaserData = requireNew('../teaser/teaser.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Teasers',
			jira: 'JIRA-1',
			feature: 'Feature X',
			code: dataHelper.getTemplateCode('teasers.hbs')
		},
		teasers: _.map(['Teaser 1', 'Teaser 2', 'Teaser 3', 'Teaser 4'], function(value) {
			return _.merge({}, teaserData, {
				title: value
			});
		})
	});

module.exports = data;
