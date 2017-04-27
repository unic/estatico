'use strict';

var dataHelper = require('../../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: 'Demo: SVG icons',
		jira: 'ESTATICO-212',
		code: dataHelper.getTemplateCode('svgsprite.hbs'),
		documentation: dataHelper.getDocumentation('svgsprite.md')
	},
	svgSprites: JSON.stringify(JSON.parse(dataHelper.getDefaultData().svgSprites || '[]').concat([
		'/assets/media/svg/demo.svg'
	])),
	preview: dataHelper.getSVGSprites()
});
