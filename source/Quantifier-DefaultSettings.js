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
			// 		ROUND_UP	0	Rounds away from zero
			// 		ROUND_DOWN	1	Rounds towards zero
			// 		ROUND_CEIL	2	Rounds towards Infinity
			// 		ROUND_FLOOR	3	Rounds towards -Infinity
			// 		ROUND_HALF_UP	4	Rounds towards nearest neighbour.  -- If equidistant, rounds away from zero
			// 		ROUND_HALF_DOWN	5	Rounds towards nearest neighbour. -- If equidistant, rounds towards zero
			// 		ROUND_HALF_EVEN	6	Rounds towards nearest neighbour. -- If equidistant, rounds towards even neighbour
			// 		ROUND_HALF_CEIL	7	Rounds towards nearest neighbour. -- If equidistant, rounds towards Infinity
			// 		ROUND_HALF_FLOOR	8	Rounds towards nearest neighbour. --If equidistant, rounds towards -Infinity
			RoundingMethod: 4,
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