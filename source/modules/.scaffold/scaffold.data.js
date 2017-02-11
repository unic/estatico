'use strict';

var dataHelper = require('../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: '{{originalName}}',
		className: '{{className}}',
		keyName: '{{keyName}}',
		code: dataHelper.getTemplateCode('{{name}}.hbs'),
		documentation: dataHelper.getDocumentation('{{name}}.md')
	}
});
