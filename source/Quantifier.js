// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libUnderscore = require('underscore');
var libBigNumber = require('bignumber.js');
var libQuantifierSettings = require('./Quantifier-DefaultSettings.js');

/**
* Quantifier Histogram Parsing Library
*
* @class Quantifier
*/
var Quantifier = function()
{
	function createNew(pSettings)
	{
		var _Settings = libUnderscore.extend({}, pSettings, libQuantifierSettings.construct());

		// The bins in the set
		var _Bins = [];

		// The statistics about this set
		var _Statistics = libUnderscore.extend({},
			{
				// The actual minimum and maximum for the set of bins
				SetMinimum: false,
				SetMaximum: false,

				// The defined minimum and maximum for the set of bins
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

			if (!_Statistics.SetMinimum || (pBin < _Statistics.SetMinimum))
			{
				_Statistics.SetMinimum = pBin;
			}
			if (!_Statistics.SetMaximum || (pBin > _Statistics.SetMaximum))
			{
				_Statistics.SetMaximum = pBin;
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
			if (_Statistics.PushOperationsAtStatisticsGeneration >= _Statistics.PushOperations)
			{
				// The statistics cache is still valid, so keep using it.
				return tmpNewQuantifierObject;
			}

			// Set the cache to valid
			_Statistics.PushOperationsAtStatisticsGeneration = _Statistics.PushOperations;

			// Reset some statistics
			_Statistics.Size = 0;
			_Statistics.SetTotal = 0;
			_Statistics.Entries = 0;
			_Statistics.ProcessedBins = [];

			if (_Settings.FixedRange)
			{
				// If the user set a fixed range for the histogram set scope, use that
				_Statistics.Minimum = _Settings.Minimum;
				_Statistics.Maximum = _Settings.Maximum;
			}
			else
			{
				// Otherwise, use the dynamically captured data
				_Statistics.Minimum = _Statistics.SetMinimum;
				_Statistics.Maximum = _Statistics.SetMaximum;
			}

			// Walk the bins, updating stat values
			for (var i = _Statistics.Minimum; i <= _Statistics.Maximum; i++)
			{
				// If this is out of scope, just put a 0 in.
				if ((_Bins[i] == undefined) || (_Bins[i] == null))
				{
					_Statistics.ProcessedBins[i] = 0;
					continue;					
				}

				// Add this value to the processed bins
				if (_Settings.MathMode.ArbitraryPrecision)
				{
					_Statistics.ProcessedBins[i] = _Bins[i].round().toNumber();
				}
				else
				{
					_Statistics.ProcessedBins[i] = _Bins[i];
				}

				// Check the bin max/min
				if (!_Statistics.BinMinimum || (_Bins[i] < _Statistics.BinMinimum))
				{
					_Statistics.BinMinimum = _Bins[i];
				}
				if (!_Statistics.BinMaximum || (_Bins[i] > _Statistics.BinMaximum))
				{
					_Statistics.BinMaximum = _Bins[i];
				}

				// Add to the valid entry count
				_Statistics.Entries++;

				// Sum the set total (not currently using arbitrary precision)
				_Statistics.SetTotal += _Bins[i];

				// Compute the set size
				_Statistics.Size = _Statistics.Maximum - _Statistics.Minimum + 1
			}

			// First, reset the statistics.
			return tmpNewQuantifierObject;
		};


		// Recursive Greatest Common Factor
		function greatestCommonFactor(pDivisor, pDivisee)
		{
			if (pDivisee)
			{
				return greatestCommonFactor(pDivisee, pDivisor % pDivisee);
			}
			else
			{
				//console.log(' --> Greatest Common Factor: '+Math.abs(pDivisor));
				return Math.abs(pDivisor);
			}
		};


		// Quantize the current histogram into a new histogram of a different size.
		function quantize(pSetSize)
		{
			generateStatistics();

			// If the sizes match, return this histogram.
			if (pSetSize == _Statistics.Size)
				return tmpNewQuantifierObject;

			// Create a histogram to stuff these values into
			var tmpNewHistogram = createNew();

			var tmpSetMultiplier = pSetSize / _Statistics.Size;

			for (var i = _Statistics.Minimum; i <= _Statistics.Maximum; i++)
			{
				// TODO: Allow arbitrary precision for quantizatino as well
				tmpNewHistogram.addBin(Math.round(i*tmpSetMultiplier), _Statistics.ProcessedBins[i])
			}

			tmpNewHistogram.generateStatistics();

			return tmpNewHistogram;
		};


		function quantizeLargestPossibleEvenSet(pSetMaxSize)
		{
			generateStatistics();

			//console.log('Quantizing a set with size '+_Statistics.Size+' to match '+pSetMaxSize);

			// IF THE MAX SIZE IS SMALLER THAN THE SET SIZE ... Take the current set size, and quantize it down to the greatest common factor with the current set.
			var tmpFactoredSize = greatestCommonFactor(pSetMaxSize, _Statistics.Size);

			//console.log('--> Factored to: '+tmpFactoredSize);

			// Now requantize the set into that size.
			return quantize(tmpFactoredSize);
		};


		// Container Object for our Factory Pattern
		var tmpNewQuantifierObject = (
		{
			initialize: initialize,

			addBin: addBin,

			generateStatistics: generateStatistics,

			quantize: quantize,
			quantizeLargestPossibleEvenSet: quantizeLargestPossibleEvenSet,

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
