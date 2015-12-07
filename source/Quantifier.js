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

		// The bins in the set
		var _Bins = [];

		// The statistics about this set
		var _Statistics = (
		{
			// The actual minimum and maximum for the set of bins
			Minimum: false,
			Maximum: false,
			// The size (length) of the set
			Size: false,

			// The total number of bins that have been touched (note that bins with value 0 are counted but null are not)
			Entries: false,

			// The sum of all bins values 
			SetTotal: false,

			// The total number of push operations which have been made to the set
			PushOperations: 0,
			// The number of push operations when the statistics were last generated (for cache validation)
			PushOperationsAtStatisticsGeneration: -1,

			// The smallest and largest bin values. (note that null is not counted as 0)
			BinMinimum: false,
			BinMaximum: false
		});

		// An empty object to cache report code in.
		// This allows the system to lazily load necessary reports, and consumers to add to/override default report behavior.
		var _Reports = {};

		// A set of consistent functions and tools for rendering to the console
		var _RenderingTools = false;


		// Add to a Bin in the set
		var addBin = function(pBin, pBinAmount)
		{
			var tmpBin = parseInt(pBin);
			var tmpBinAmount = (typeof(pBinAmount) === 'number') ? pBinAmount : 1;

			if (_Bins[tmpBin] == null)
			{
				_Bins[tmpBin] = 0;
			}

			if (!_Statistics.Minimum || (tmpBin < _Statistics.Minimum))
			{
				_Statistics.Minimum = tmpBin;
			}
			if (!_Statistics.Maximum || (tmpBin > _Statistics.Maximum))
			{
				_Statistics.Maximum = tmpBin;
			}

			_Statistics.PushOperations++;
			_Bins[tmpBin] += tmpBinAmount;

			return tmpNewQuantifierObject;
		}


		// Generates statistics about the entire set
		var generateStatistics = function()
		{
			if (_Statistics.PushOperationsAtStatisticsGeneration >= _Statistics.PushOperations)
			{
				// The statistics cache is still valid, so keep using it.
				return tmpNewQuantifierObject;
			}

			_Statistics.SetTotal = 0;
			_Statistics.Entries = 0;

			for (var i = _Statistics.Minimum; i < _Statistics.Maximum; i++)
			{
				if (_Bins[i] == null)
					continue;

				if (!_Statistics.BinMinimum || (_Bins[i] < _Statistics.BinMinimum))
				{
					_Statistics.BinMinimum = _Bins[i];
				}
				if (!_Statistics.BinMaximum || (_Bins[i] > _Statistics.BinMaximum))
				{
					_Statistics.BinMaximum = _Bins[i];
				}

				_Statistics.Entries++;
				_Statistics.SetTotal += _Bins[i];

			}
			// First, reset the statistics.
			return tmpNewQuantifierObject;
		};


		// Container Object for our Factory Pattern
		var tmpNewQuantifierObject = (
		{
			addBin: addBin,

			generateStatistics: generateStatistics,

			new: createNew
		});

		Object.defineProperty(tmpNewQuantifierObject, 'settings', { get: function() { return _Settings; } });
		Object.defineProperty(tmpNewQuantifierObject, 'bins', { get: function() { return _Bins; } });
		Object.defineProperty(tmpNewQuantifierObject, 'statistics', { get: function() { return _Statistics; } });

		Object.defineProperty(tmpNewQuantifierObject, 'reports', { get: function() { return _Reports; } });

		// Initialize the console rendering tools
		_RenderingTools = require(__dirname+'/Quantifier-RenderTools.js').New(tmpNewQuantifierObject)
		Object.defineProperty(tmpNewQuantifierObject, 'renderingTools', { get: function() { return _RenderingTools; } });
		Object.defineProperty(tmpNewQuantifierObject, 'renderReport', { get: function() { return _RenderingTools.renderReport; } });

		return tmpNewQuantifierObject;
	}

	return createNew();
};

module.exports = new Quantifier();
