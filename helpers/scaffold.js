'use strict';

var path = require('path'),
	fs = require('fs'),
	changeCase = require('change-case'),
	util = require('gulp-util'),
	inquirer = require('inquirer'),
	_ = require('lodash'),
	glob = require('glob'),
	requireNew = require('require-new'),
	handlebars = require('handlebars'),
	errors = require('./errors');

/**
 * Check whether --interactive is set to "false
 * @return {Boolean}
 */
function isInteractive() {
	return (util.env.interactive !== 'false');
}

/**
 * Check if target with specified name already exists
 * @param {String} name
 * @param {String} dir
 * @return {Boolean}
 */
function targetExists(name, dir) {
	var targetPath = path.join(dir, name);

	return fs.existsSync(targetPath);
}

/**
 * Get targets in specified directory
 * @param {String} dir - Path
 * @return {Array<Object>}
 */
function getTargetsByPath(dir) {
	return glob.sync(dir + '*').filter(function(file) {
		return fs.statSync(file).isDirectory();
	}).map(function(dir) {
		var moduleName = path.basename(dir),
			moduleData;

		try {
			moduleData = requireNew(path.resolve(dir, moduleName + '.data.js'));
		} catch (err) {
			console.log(err);
			return {};
		};

		return {
			name: moduleName,
			src: dir,
			originalName: moduleData.meta.title || moduleName,
			className: moduleData.meta.className || moduleName,
			keyName: moduleData.meta.keyName || moduleName
		};
	});
}

/**
 * Prepare targets for use in inquirer prompt
 * @param {Array<Object>} targets
 * @param {Boolean} [allowRecursive] - Return additional option containing all targets
 * @return {Array<Object>}
 */
function getTargetInquirerOptions(targets, allowRecursive) {
	var options = targets.map(function(target) {
			return {
				name: target.name,
				value: target
			};
		});

	if (options.length > 0) {
		if (allowRecursive) {
			options = options.concat([{
				name: '* (all)',
				value: options.map(function(dir) {
					return dir.value;
				})
			}]);
		}
	} else {
		options = [{
			name: '(Nothing found)',
			value: false
		}];
	}

	return options;
}

/**
 * Get file-system-compatible name (snake case, by default without underscores).
 * Example: "Hello World" returns "helloworld" or "hello_world" (if allowUnderscores is true)
 * @param {String} name
 * @param {Boolean} allowUnderscores
 * @return {String}
 */
function getSanitizedName(name, allowUnderscores) {
	name = changeCase.snake(name);

	return (!allowUnderscores) ? name.replace(/_/g, '') : name;
}

/**
 * Get pascal-cased class name (pascal case, by default without underscores).
 * Example: "Hello World" returns "HelloWorld" or "Hello_World" (if allowUnderscores is true)
 * @param {String} name
 * @param {Boolean} allowUnderscores
 * @return {String}
 */
function getClassName(name, allowUnderscores) {
	name = changeCase.pascalCase(name);

	return (!allowUnderscores) ? name.replace(/_/g, '') : name;
}

/**
 * Get camel-cased key name (camel case, by default without underscores).
 * Example: "Hello World" returns "HelloWorld" or "Hello_World" (if allowUnderscores is true)
 * @param {String} name
 * @param {Boolean} allowUnderscores
 * @return {String}
 */
function getKeyName(name, allowUnderscores) {
	name = changeCase.camelCase(name);

	return (!allowUnderscores) ? name.replace(/_/g, '') : name;
}

module.exports = {
	/**
	 * Get type
	 * @param {Array<object>} Available types (see taskConfig)
	 * @param {Object} [options]
	 * @param {String} [options.prompt] - Message for interactive mode
	 * @param {String} [options.envKey] - Custom key for non-interactive mode
	 * @param {Function} [options.filter] - Filter targets
	 * @return {Promise} resolved with {Object}
	 */
	getType: function(types, options) {
		options = _.merge({
			envKey: 'type'
		}, options);

		var env = util.env[options.envKey],
			matchedType;

		return new Promise(function(resolve, reject) {
			if (isInteractive()) {
				inquirer.prompt([
					{
						type: 'list',
						name: 'type',
						message: options.prompt || 'Please select type',
						choices: _.map(types, function(type) {
							return {
								name: type.name,
								value: type
							};
						}).filter(options.filter || function() {
							return true;
						})
					}
				]).then(function(answers) {
					resolve(answers.type);
				});
			} else if (env) {
				matchedType = _.filter(types, 'name', env)[0];

				if (!matchedType) {
					reject(new Error('Argument "type" has to be of [' + _.map(types, 'name').join(', ') + ']'));
				} else {
					resolve(matchedType);
				}
			} else {
				reject(new Error('Argument "type" not specified'));
			}
		});
	},

	/**
	 * Get existing target
	 * @param {String} dir - Path
	 * @param {Boolean} [allowRecursive] - Return additional option containing all targets
	 * @return {Promise} resolved with {Object}
	 */
	getTarget: function(dir, allowRecursive) {
		var targets = getTargetsByPath(dir),
			env = util.env.name,
			matchedTarget;

		return new Promise(function(resolve, reject) {
			if (isInteractive()) {
				inquirer.prompt([
					{
						type: 'list',
						name: 'target',
						message: 'Which one?',
						choices: getTargetInquirerOptions(targets, allowRecursive)
					}
				]).then(function(answers) {
					resolve(answers.target);
				});
			} else if (!util.env.name) {
				reject(new Error('Argument "name" not specified'));
			} else {
				matchedTarget = _.filter(targets, 'name', env)[0];

				if (!matchedTarget) {
					reject(new Error('Target "' + env + '" not found'));
				} else {
					resolve(matchedTarget);
				}
			}
		});
	},

	/**
	 * Get target name
	 * @param {String} typeName
	 * @param {String} dest
	 * @param {Object} [options]
	 * @param {String} [options.prompt] - Message for interactive mode
	 * @param {Boolean} [options.allowUnderscores]
	 * @param {String} [options.envKey] - Custom key for non-interactive mode
	 * @return {Promise} resolved with {Object}
	 */
	getName: function(typeName, dest, options) {
		options = _.merge({
			envKey: 'name'
		}, options);

		var env = util.env[options.envKey],
			name,
			className,
			keyName,
			exists;

		return new Promise(function(resolve, reject) {
			if (isInteractive()) {
				inquirer.prompt([
					{
						type: 'input',
						name: 'name',
						message: options.prompt || 'What is the name of your ' + typeName + '?',
						validate: function(value) {
							if (value) {
								name = getSanitizedName(value, options.allowUnderscores);

								exists = targetExists(name, dest);

								return exists ? (typeName + ' named "' + name + '" already exists') : true;
							} else {
								return 'Please enter a name';
							}
						}
					}
				]).then(function(answers) {
					name = getSanitizedName(answers.name, options.allowUnderscores);
					className = getClassName(answers.name, options.allowUnderscores);
					keyName = getKeyName(answers.name, options.allowUnderscores);

					resolve({
						original: answers.name,
						className: className,
						keyName: keyName,
						sanitized: name
					});
				});
			} else if (env && env !== true) {
				name = getSanitizedName(env, options.allowUnderscores);
				className = getClassName(env, options.allowUnderscores);
				keyName = getKeyName(answers.name, options.allowUnderscores);
				exists = targetExists(name, dest);

				if (exists) {
					reject(new Error(typeName + ' named "' + name + '" already exists'));
				} else {
					resolve({
						original: env,
						className: className,
						keyName: keyName,
						sanitized: name
					});
				}
			} else {
				reject(new Error('Argument "name" not specified'));
			}
		});
	},

	/**
	 * Assess whether to create CSS and JS file
	 * @return {Promise} resolved with {Object}
	 */
	getAssetsToCreate: function() {
		return new Promise(function(resolve) {
			if (isInteractive()) {
				inquirer.prompt([
					{
						type: 'confirm',
						name: 'script',
						message: 'Do you want me to create and register a JavaScript file?',
						default: true
					},
					{
						type: 'confirm',
						name: 'styles',
						message: 'Do you want me to create and register a SCSS file?',
						default: true
					}
				]).then(function(answers) {
					resolve(answers);
				});
			} else {
				resolve({
					script: (util.env.createScript !== 'false'),
					styles: (util.env.createStyles !== 'false')
				});
			}
		});
	},

	/**
	 * Add module reference to CSS or JS file
	 * @param {Object} file - Vinyl file
	 * @param {String} modulePath
	 * @param {Object} options
	 * @return {Buffer} - New file content
	 */
	addModule: function(file, modulePath, options) {
		var content = file.contents.toString(),
			relPath = path.relative(path.dirname(file.path), modulePath),
			insertion,
			importInsertion,
			insertionPoint;

		if (options.insertionTemplate) {
			insertion = handlebars.compile(options.insertionTemplate)({
					className: options.className,
					keyName: options.keyName
				}) + options.insertionPoint;
			importInsertion = handlebars.compile(options.importInsertionTemplate)({
					modulePath: relPath,
					className: options.className
				}) + options.importInsertionPoint;

			// add js import statement
			insertionPoint = options.importInsertionPoint.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
			content = content.replace(new RegExp(insertionPoint), importInsertion);
		} else {
			insertion = options.insertionPrefix + relPath + options.insertionSuffix + options.insertionPoint;
		}

		// add a regular include (css or js)
		insertionPoint = options.insertionPoint.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
		content = content.replace(new RegExp(insertionPoint), insertion);

		return Buffer.from(content);
	},

	/**
	 * Remove module reference from CSS or JS file
	 * @param {Object} file - Vinyl file
	 * @param {String} modulePath
	 * @param {Object} options
	 * @return {Buffer} - New file content
	 */
	removeModule: function(file, modulePath, options) {
		var content = file.contents.toString(),
			relPath = path.relative(path.dirname(file.path), modulePath),
			reference,
			importReference;

		if (options.insertionTemplate) {
			reference = handlebars.compile(options.insertionTemplate)({
					className: options.className,
					keyName: options.keyName
				});
			importReference = handlebars.compile(options.importInsertionTemplate)({
				modulePath: relPath,
				className: options.className
			});

			content = content.replace(importReference, '');
		} else {
			reference = options.insertionPrefix + relPath + options.insertionSuffix;
		}

		content = content.replace(reference, '');

		return Buffer.from(content);
	}
};
