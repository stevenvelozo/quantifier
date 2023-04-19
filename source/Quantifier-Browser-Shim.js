/**
* Simple browser shim loader - assign the npm module to a window global automatically
*
* @license MIT
* @author <steven@velozo.com>
*/
var libNPMModuleWrapper = require('./Quantifier.js');

if ((typeof(window) === 'object') && !window.hasOwnProperty('Quantifier'))
{
	window.Quantifier = libNPMModuleWrapper;
}

module.exports = libNPMModuleWrapper;