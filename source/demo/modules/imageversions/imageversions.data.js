'use strict';

var dataHelper = require('../../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: 'Demo: Image versions',
		code: dataHelper.getTemplateCode('imageversions.hbs'),
		documentation: dataHelper.getDocumentation('imageversions.md')
	}
});
