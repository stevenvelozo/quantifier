/**
* @license MIT
* @author <steven@velozo.com>
*/
var libStream = require('stream');
var libUnderscore = require('underscore');

/**
* Quantifier Console Rendering Tools
*
* @class QuantifierRenderTools
*/
var QuantifierRenderTools = function()
{
	function createNew(pQuantifier)
	{
		var _Quantifier = pQuantifier;
		var _RenderSettings = _Quantifier.settings.ConsoleRendering;

		// Prepare the render stream for writing to
		var prepareRenderStream = function()
		{
			// Test if the object in _Quantifier.settings.RenderStream is a writable stream
			if ((_RenderSettings.RenderStream instanceof libStream.Stream) &&
				(typeof (_RenderSettings.RenderStream._write === 'function')) &&
				(typeof (_RenderSettings.RenderStream._readableState === 'object')))
			{
				// This is a already a writable streem
			}
			else
			{
				// Set the render stream to stdout
				_RenderSettings.RenderStream = process.stdout;
			}

			// Now use the stream to determine the width of the renderable area
			if (!_RenderSettings.CustomSize && !_RenderSettings.Width || _RenderSettings.Width > _RenderSettings.RenderStream.columns)
			{
				_RenderSettings.Width = _RenderSettings.RenderStream.columns;
			}

			// Now use the stream to determine the width of the renderable area
			if (!_RenderSettings.CustomSize && !_RenderSettings.Height || _RenderSettings.Height > _RenderSettings.RenderStream.rows)
			{
				_RenderSettings.Height = _RenderSettings.RenderStream.rows;
			}
			//console.log('RenderSettings: '+_RenderSettings.Width+'x'+_RenderSettings.Height)
		};


		// Hard-define the render size
		var setRenderSize = function(pWidth, pHeight)
		{
			// TODO: Validate width and height
			_RenderSettings.Height = parseInt(pHeight,10);
			_RenderSettings.Width = parseInt(pWidth,10);

			_RenderSettings.CustomSize = true;
		};


		// Render a report
		var renderReport = function(pReportHash)
		{
			// Before loading the report, make sure the render stream is ready to go.
			prepareRenderStream();

			if (_Quantifier.reports.hasOwnProperty(pReportHash))
			{
				// Run the report
				_Quantifier.reports[pReportHash](_Quantifier);
			}
			else
			{
				try
				{
					// Try to lazily load the report since it isn't in the _Quantifier.reports object
					_Quantifier.reports[pReportHash] = require(__dirname+'/visualizations/Quantifier-Visualization-Console-'+pReportHash+'.js');
					// Now Run the report
					_Quantifier.reports[pReportHash](_Quantifier);

				}
				catch (pException)
				{
					console.error('Report "'+pReportHash+'" could not load -- maybe it does not exist in the visualizations folder and has not been added to the Reports object.');
					console.error('  > Exception: '+pException);
					return _Quantifier;
				}
			}

			return _Quantifier;
		};


		// Write a complete line out to the report stream
		var writeReportLine = function(pReportLine)
		{
			_RenderSettings.RenderStream.write(pReportLine+"\n");
		};

		// Write a string out to the report stream
		var writeReportString = function(pReportString)
		{
			_RenderSettings.RenderStream.write(pReportString);
		};


		// Render a report header
		var renderReportHeader = function(pReportName)
		{
			if (_RenderSettings.Header)
			{
				writeReportLine('# '+pQuantifier.settings.Title);
				writeReportLine('');
				if (_RenderSettings.HeaderDescription && pQuantifier.settings.Description)
				{
					writeReportLine(pQuantifier.settings.Description);
					writeReportLine('');
				}
				writeReportLine('## '+pReportName);
				writeReportLine('');
			}
		};


		// Render a report header
		var renderReportFooter = function(pReportName)
		{
			if (_RenderSettings.Footer)
			{
				writeReportLine('');
				writeReportLine('');
			}
		};


		// Container Object for our Factory Pattern
		var tmpNewQuantifierRenderToolsObject = (
		{
			renderReport: renderReport,

			renderReportHeader: renderReportHeader,
			renderReportFooter: renderReportFooter,

			writeReportLine: writeReportLine,
			writeReportString: writeReportString,

			new: createNew
		});

		return tmpNewQuantifierRenderToolsObject;
	}

	return { New: createNew };
};

module.exports = new QuantifierRenderTools();
