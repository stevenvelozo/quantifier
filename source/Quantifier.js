// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libUnderscore = require('underscore');

/**
* Quantifier Histogram Parsing Library
*
* @class Quantifier
*/
var Quantifier = function()
{
	function createNew(pSettings)
	{
		var _Settings = libUnderscore.extend({}, pSettings, require('./Quantifier-DefaultSettings.js'));

		var _Values = {};

		var _Statistics = (
		{
			Entries: 0,

			ActiveBins: 0,

			PushOperations: 0
		});

		var addValue = function(pValue, pValueAmount)
		{
			var tmpValueAmount = (typeof(pValueAmount) === 'number') ? pValueAmount : 1;

			if (!_Values.hasOwnProperty(pValue))
			{
				_Values[pValue] = 0;
				_Statistics.ActiveBins++;
			}

			_Values[pValue] += tmpValueAmount;

			_Statistics.PushOperations++;

			return tmpNewQuantifierObject;
		}

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewQuantifierObject = (
		{
			addValue: addValue,

			new: createNew
		});

		Object.defineProperty(tmpNewQuantifierObject, 'settings', { get: function() { return _Settings; } });
		Object.defineProperty(tmpNewQuantifierObject, 'values', { get: function() { return _Values; } });
		Object.defineProperty(tmpNewQuantifierObject, 'statistics', { get: function() { return _Statistics; } });



		return tmpNewQuantifierObject;
	}

	return createNew();
};

module.exports = new Quantifier();
