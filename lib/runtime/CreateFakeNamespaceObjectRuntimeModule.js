/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const Template = require("../Template");
const HelperRuntimeModule = require("./HelperRuntimeModule");

class CreateFakeNamespaceObjectRuntimeModule extends HelperRuntimeModule {
	constructor() {
		super("create fake namespace object");
	}

	/**
	 * @returns {string} runtime code
	 */
	generate() {
		const fn = RuntimeGlobals.createFakeNamespaceObject;
		return Template.asString([
			"// create a fake namespace object",
			"// mode & 1: value is a module id, require it",
			"// mode & 2: merge all properties of value into the ns",
			"// mode & 4: return value when already ns object",
			"// mode & 8|1: behave like require",
			`${fn} = function(value, mode) {`,
			Template.indent([
				`if(mode & 1) value = __webpack_require__(value);`,
				`if(mode & 8) return value;`,
				"if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;",
				"var ns = Object.create(null);",
				`${RuntimeGlobals.makeNamespaceObject}(ns);`,
				"Object.defineProperty(ns, 'default', { enumerable: true, value: value });",
				"if(mode & 2 && typeof value != 'string') for(var key in value) " +
					`${RuntimeGlobals.definePropertyGetter}(ns, key, function(key) { ` +
					"return value[key]; " +
					"}.bind(null, key));",
				"return ns;"
			]),
			"};"
		]);
	}
}

module.exports = CreateFakeNamespaceObjectRuntimeModule;