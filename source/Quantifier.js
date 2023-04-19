const libQuantifierDefaultSettings = require('./Quantifier-DefaultSettings.js');
const libBigNumber = require('bignumber.js');

class Quantifier
{
	constructor(pSettings)
	{
		this.settings = {...{}, ...pSettings, ...libQuantifierDefaultSettings};

		this.bins = [];

		this.statistics = (
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
	}

	addBin(pBin, pBinAmount)
	{
		if (!this.settings.MathMode.ArbitraryPrecision)
		{
			this.addBinNativeMath(pBin, pBinAmount);;
		}
		else
		{
			// Configure libBigNumber with the number of decimal places and rounding mode
			// ERRORS is set to surpress the double int 15 significant digits issues
			//libBigNumber.config({ ERRORS: false, DECIMAL_PLACES: this.settings.MathMode.BigNumber.DecimalPlaces, ROUNDING_MODE: this.settings.MathMode.BigNumber.RoundingMethod });
			this.addBinArbitraryPrecisionMath(pBin, pBinAmount);
		}
	}

	updateBinStatistics(pBin)
	{
		this.statistics.PushOperations++;

		if (!this.statistics.SetMinimum || (pBin < this.statistics.SetMinimum))
		{
			this.statistics.SetMinimum = pBin;
		}
		if (!this.statistics.SetMaximum || (pBin > this.statistics.SetMaximum))
		{
			this.statistics.SetMaximum = pBin;
		}
	}

	addBinNativeMath(pBin, pBinAmount)
	{
		let tmpBin = false;

		// Branch on rounding method
		if (!this.settings.MathMode.Standard.Rounding)
		{
			// Don't round at all.  Naively parse the int
			tmpBin = parseInt(pBin, 10);
		}
		else
		{
			// Use Math.round
			tmpBin = Math.round(pBin, 10);
		}

		// Get the bin amount
		// This defaults to 1 if you pass in something that isn't parsable as a number
		let tmpBinAmount = (typeof(pBinAmount) === 'number') ? pBinAmount : 1;

		// Initialize the bin
		if (this.bins[tmpBin] == null)
		{
			this.bins[tmpBin] = 0;
		}

		this.updateBinStatistics(tmpBin);

		this.bins[tmpBin] += tmpBinAmount;

		return this;
	}


	addBinArbitraryPrecisionMath(pBin, pBinAmount)
	{
		// Bins are still integers, so round out the decimal places after loading
		let tmpBin = new libBigNumber(pBin).decimalPlaces(0).toNumber();

		// Get the bin amount
		let tmpBinAmount = (typeof(pBinAmount) === 'number') ? new libBigNumber(pBinAmount) : new libBigNumber(1);

		// Initialize the bin
		if (this.bins[tmpBin] == null)
		{
			this.bins[tmpBin] = new libBigNumber(0);
		}

		this.updateBinStatistics(tmpBin);

		this.bins[tmpBin] = this.bins[tmpBin].plus(tmpBinAmount);

		return this;
	}

	generateStatistics()
	{
		if (this.statistics.PushOperationsAtStatisticsGeneration >= this.statistics.PushOperations)
		{
			// The statistics cache is still valid, so keep using it.
			return this;
		}

		// Set the cache to valid
		this.statistics.PushOperationsAtStatisticsGeneration = this.statistics.PushOperations;

		// Reset some statistics
		this.statistics.Size = 0;
		this.statistics.SetTotal = 0;
		this.statistics.Entries = 0;
		this.statistics.ProcessedBins = [];

		if (this.settings.FixedRange)
		{
			// If the user set a fixed range for the histogram set scope, use that
			this.statistics.Minimum = this.settings.Minimum;
			this.statistics.Maximum = this.settings.Maximum;
		}
		else
		{
			// Otherwise, use the dynamically captured data
			this.statistics.Minimum = this.statistics.SetMinimum;
			this.statistics.Maximum = this.statistics.SetMaximum;
		}

		// Walk the bins, updating stat values
		for (var i = this.statistics.Minimum; i <= this.statistics.Maximum; i++)
		{
			// If this is out of scope, just put a 0 in.
			if ((this.bins[i] === undefined) || (this.bins[i] === null))
			{
				this.statistics.ProcessedBins[i] = 0;
				continue;
			}

			// Add this value to the processed bins
			if (this.settings.MathMode.ArbitraryPrecision)
			{
				this.statistics.ProcessedBins[i] = this.bins[i].decimalPlaces(0).toNumber();
			}
			else
			{
				this.statistics.ProcessedBins[i] = this.bins[i];
			}

			// Check the bin max/min
			if (!this.statistics.BinMinimum || (this.bins[i] < this.statistics.BinMinimum))
			{
				this.statistics.BinMinimum = this.bins[i];
			}
			if (!this.statistics.BinMaximum || (this.bins[i] > this.statistics.BinMaximum))
			{
				this.statistics.BinMaximum = this.bins[i];
			}

			// Add to the valid entry count
			this.statistics.Entries++;

			// Sum the set total (not currently using arbitrary precision)
			this.statistics.SetTotal += this.bins[i];

			// Compute the set size
			this.statistics.Size = this.statistics.Maximum - this.statistics.Minimum + 1
		}

		// First, reset the statistics.
		return this;
	}

	greatestCommonFactor(pDivisor, pDivisee)
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
	}

	quantize(pSetSize)
	{
		generateStatistics();

		// If the sizes match, return this histogram.
		if (pSetSize === this.statistics.Size)
		{
			return this;
		}

		// Create a histogram to stuff these values into
		// TODO: Should we pass the settings into here?
		var tmpNewHistogram = new Quantifier();

		var tmpSetMultiplier = pSetSize / this.statistics.Size;

		for (var i = this.statistics.Minimum; i <= this.statistics.Maximum; i++)
		{
			// TODO: Allow arbitrary precision for quantization as well
			tmpNewHistogram.addBin(Math.decimalPlaces(i*tmpSetMultiplier), this.statistics.ProcessedBins[i])
		}

		tmpNewHistogram.generateStatistics();

		return tmpNewHistogram;
	}

	quantizeLargestPossibleEvenSet(pSetMaxSize)
	{
		this.generateStatistics();

		//console.log('Quantizing a set with size '+this.statistics.Size+' to match '+pSetMaxSize);

		// IF THE MAX SIZE IS SMALLER THAN THE SET SIZE ... Take the current set size, and quantize it down to the greatest common factor with the current set.
		let tmpFactoredSize = this.greatestCommonFactor(pSetMaxSize, this.statistics.Size);

		//console.log('--> Factored to: '+tmpFactoredSize);

		// Now requantize the set into that size.
		return this.quantize(tmpFactoredSize);
	}
}

module.exports = Quantifier;