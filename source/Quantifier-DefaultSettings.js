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