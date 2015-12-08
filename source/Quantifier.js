// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libUnderscore = require('underscore');
var libBigNumber = require('bignumber.js');

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

			ProcessedBins: [],

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

		// Setup the Math functions and other behaviors
		var initialize = function(pBin, pBinAmount)
		{
			if (!_Settings.MathMode.ArbitraryPrecision)
			{
				tmpNewQuantifierObject.addBin = addBinNativeMath;
			}
			else
			{
				// Configure libBigNumber with the number of decimal places and rounding mode
				// ERRORS is set to surpress the double int 15 significant digits issues
				libBigNumber.config({ ERRORS: false, DECIMAL_PLACES: _Settings.MathMode.BigNumber.DecimalPlaces, ROUNDING_MODE: _Settings.MathMode.BigNumber.RoundingMethod });
				tmpNewQuantifierObject.addBin = addBinArbitraryPrecisionMath;
			}
		};

		// This only gets called the first time we call addBin, to laziliy initialize the dynamic functionality
		var addBin = function(pBin, pBinAmount)
		{
			// Because the binning method hasn't been initialized yet, we need to init it now.
			initialize(pBin, pBinAmount);
			tmpNewQuantifierObject.addBin(pBin, pBinAmount);
		};

		// Update Various Statistics on a Bin Push Operation
		var updateLiveStatistics = function(pBin)
		{
			_Statistics.PushOperations++;

			if (!_Statistics.Minimum || (pBin < _Statistics.Minimum))
			{
				_Statistics.Minimum = pBin;
			}
			if (!_Statistics.Maximum || (pBin > _Statistics.Maximum))
			{
				_Statistics.Maximum = pBin;
			}
		};

		// Add to a Bin in the set using native Javascript math
		var addBinNativeMath = function(pBin, pBinAmount)
		{
			var tmpBin = false;

			// Branch on rounding method
			if (!_Settings.MathMode.Standard.Rounding)
			{
				// Don't round at all.  Naively parse the int
				tmpBin = parseInt(pBin);
			}
			else
			{
				// Use Math.round
				tmpBin = Math.round(pBin);
			}

			// Get the bin amount
			var tmpBinAmount = (typeof(pBinAmount) === 'number') ? pBinAmount : 1;

			// Initialize the bin
			if (_Bins[tmpBin] == null)
			{
				_Bins[tmpBin] = 0;
			}

			updateLiveStatistics(tmpBin);

			_Bins[tmpBin] += tmpBinAmount;

			return tmpNewQuantifierObject;
		}


		// Add to a Bin in the set using native Javascript math
		var addBinArbitraryPrecisionMath = function(pBin, pBinAmount)
		{
			// Bins are still integers, so round after loading
			var tmpBin = new libBigNumber(pBin).round().toNumber();

			// Get the bin amount
			var tmpBinAmount = (typeof(pBinAmount) === 'number') ? new libBigNumber(pBinAmount) : new libBigNumber(1);

			// Initialize the bin
			if (_Bins[tmpBin] == null)
			{
				_Bins[tmpBin] = new libBigNumber(0);
			}

			updateLiveStatistics(tmpBin);

			_Bins[tmpBin] = _Bins[tmpBin].plus(tmpBinAmount);

			return tmpNewQuantifierObject;
		}


		// Generates statistics about the entire set
		var generateStatistics = function()
		{
			console.log('  --> Processing Statistics');
			if (_Statistics.PushOperationsAtStatisticsGeneration >= _Statistics.PushOperations)
			{
				// The statistics cache is still valid, so keep using it.
				return tmpNewQuantifierObject;
			}

			// Set the cache to valid
			_Statistics.PushOperationsAtStatisticsGeneration = _Statistics.PushOperations;

			// Reset some statistics
			_Statistics.SetTotal = 0;
			_Statistics.Entries = 0;
			_Statistics.ProcessedBins = [];

			// Walk the bins, updating stat values
			for (var i = _Statistics.Minimum; i <= _Statistics.Maximum; i++)
			{
				// Add this to the processed bins (to deal with arbitrary precision)
				if (_Settings.MathMode.ArbitraryPrecision)
				{
					_Statistics.ProcessedBins[i] = _Bins[i].round().toNumber();
				}
				else
				{
					_Statistics.ProcessedBins[i] = _Bins[i];
				}

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
			initialize: initialize,

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
