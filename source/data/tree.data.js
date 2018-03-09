'use strict';

var _ = require('lodash'),
	dataHelper = require('../../helpers/data.js'),
	path = require('path'),

	transform = function(data, filePath) {
		const previewUrl = '/' + path.relative('./source/', filePath).replace('.data.js', '.html');

		return _.merge(data, {
			meta: {
				previewUrl: previewUrl,
				documentation: dataHelper.getDocumentation('../index.md')
			}
		});
	},

	data = {
		pages: dataHelper.getDataGlob('./source/pages/**/*.data.js', transform),
		demoPages: dataHelper.getDataGlob('./source/demo/pages/**/*.data.js', transform),
		modules: dataHelper.getDataGlob('./source/modules/**/*.data.js', transform),
		demoModules: dataHelper.getDataGlob('./source/demo/modules/**/*.data.js', transform),
		styleguide: dataHelper.getDataGlob('./source/preview/styleguide/*.data.js', transform)
	};

// console.log('pages =>', data.pages);


data.pages = _.sortBy(data.pages, function(item) {
	return item.meta.title;
}).concat(_.sortBy(data.demoPages, function(item) {
	return item.meta.title;
}));

data.modules = _.sortBy(data.modules, function(item) {
	return item.meta.title;
}).concat(_.sortBy(data.demoModules, function(item) {
	return item.meta.title;
}));

data.styleguide = _.sortBy(data.styleguide, function(item) {
	return item.meta.title;
});

module.exports = data;
