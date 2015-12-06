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

		var _Values = [];

		var _Statistics = (
		{
			// The total number of bins that have been touched
			Entries: false,

			// The total amount of the set of all values
			SetTotal: false,

			// The total number of push operations which have been made to the set
			PushOperations: 0,

			// The actual minimum and maximum for the set
			Minimum: false,
			Maximum: false,

			// The smallest and largest buckets.  (note that 0 bukcets are counted but null are not)
			BucketMinimum: false,
			BucketMaximum: false
		});

		// Add to a Value in the set
		var addValue = function(pValue, pValueAmount)
		{
			var tmpValueAmount = (typeof(pValueAmount) === 'number') ? pValueAmount : 1;

			if (_Values[pValue] == null)
			{
				_Values[pValue] = 0;
			}

			if (!_Statistics.Minimum || (pValue < _Statistics.Minimum))
			{
				_Statistics.Minimum = pValue;
			}
			if (!_Statistics.Maximum || (pValue > _Statistics.Maximum))
			{
				_Statistics.Maximum = pValue;
			}

			_Statistics.PushOperations++;
			_Values[pValue] += tmpValueAmount;

			return tmpNewQuantifierObject;
		}

		var generateStatistics = function()
		{
			_Statistics.SetTotal = 0;
			_Statistics.Entries = 0;

			for (var i = _Statistics.Minimum; i < _Statistics.Maximum; i++)
			{
				if (_Values[i] == null)
					continue;

				if (!_Statistics.BucketMinimum || (_Values[i] < _Statistics.BucketMinimum))
				{
					_Statistics.BucketMinimum = _Values[i];
				}
				if (!_Statistics.BucketMaximum || (_Values[i] > _Statistics.BucketMaximum))
				{
					_Statistics.BucketMaximum = _Values[i];
				}

				_Statistics.Entries++;
				_Statistics.SetTotal += _Values[i];

			}
			// First, reset the statistics.
			return tmpNewQuantifierObject;
		}

		var _BarGraphicCache = '';
		var generateBar = function(pValue, pAmount, pMax, pWidth)
		{
			if (pAmount == 0)
				return tmpBar = ('       '+pValue).slice(-6)+' |';

			return tmpBar = ('       '+pValue).slice(-6)+' |'+_BarGraphicCache.slice(-pAmount)+' <<--'+pAmount;
		};
		var renderConsoleHorizontalBar = function()
		{
			var tmpStream = process.stderr;

			var tmpWidth = 80;
			/*
			if (tmpStream.columns < _Statistics.BucketMaximum)
			{
				// Gone are the days
				tmpWidth = tmpStream.columns;
			}
			*/

			_BarGraphicCache = "#".repeat(tmpWidth);

			console.log(_Settings.Title);
			console.log('------------------------------')
			console.log('');
			console.log(' Histogram '+_Settings.Hash);
			console.log('');
			console.log(_Settings.Description);
			console.log('');

			for (var i = _Statistics.Minimum; i <= _Statistics.Maximum; i++)
			{
				var tmpAmount = 0;
				if (_Values[i] == null)
					console.log(generateBar(i, 0, _Statistics.BucketMaximum, tmpWidth));
				else
					console.log(generateBar(i, _Values[i], _Statistics.BucketMaximum, tmpWidth));
			}
		};

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewQuantifierObject = (
		{
			addValue: addValue,

			generateStatistics: generateStatistics,

			renderConsoleHorizontalBar: renderConsoleHorizontalBar,

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
