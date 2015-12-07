// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Quantifier Default Settings Object
*/

module.exports = (
{
	// The hash for the histogram (useful for DOM referencing and such)
	Hash: 'Histogram',

	// The title
	Title: 'Default Histogram Title',
	// A description
	Description: false,

	// The minimum and maximum values
	Minimum: false,
	Maximum: false,

	// If this is set true, the rendering and quantization algorithms will 
	//   ignore values outside the fixed minimum and maximum values set here
	FixedRange: false,

	MathMode:
	{
		// If this is set to true, use the slower arbitrary-precision library for math operations.
		ArbitraryPrecision: false,

		// Configure the arbitrary configuration library
		BigNumber:
		{
			// Bignumber allows any of:
			//   ROUND_UP, ROUND_DOWN, ROUND_CEIL, ROUND_FLOOR, ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN, ROUND_HALF_CEIL, ROUND_HALF_FLOOR, EUCLID
			RoundingMethod: 'ROUND_HALF_UP',
			DecimalPlaces: 10
		},

		Standard:
		{
			// If this is set to true, we bin values using Math.round
			Rounding: false
		}
	},

	// Some parameters for rendering to the console.
	// This is only used if the API consumer calls the console rendering functions.
	ConsoleRendering:
	{
		RenderStream: false,

		Width: false,
		Height: false,

		Header: true,
		Footer: true
	}
});