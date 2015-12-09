// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Quantifier Console Log10 Horizontal Bar Renderer
*
* Display the console graph using a log10 scale, so elements don't blow out with huge set values
*/

// Return the top Y of a bar
var getBarTop = function(pValue, pAmount, pMax, pHeight)
{
	return (pAmount === 0) ? 0 : Math.round(pAmount / (pMax / pHeight));
};

var renderConsoleHorizontalBar = function(pQuantifier)
{
	var tmpWidth = pQuantifier.settings.ConsoleRendering.Width - 10;
	var tmpHeight = pQuantifier.settings.ConsoleRendering.Height - 12;

	// Get the top point for each bar
	var tmpBarTops = [];
	for (var i = pQuantifier.statistics.Minimum; i <= pQuantifier.statistics.Maximum; i++)
	{
		var tmpBinAmount = (pQuantifier.statistics.ProcessedBins[i] == null) ? 0 : pQuantifier.statistics.ProcessedBins[i];
		tmpBarTops[i] = getBarTop(i, tmpBinAmount, pQuantifier.statistics.BinMaximum, tmpHeight);
	}

	pQuantifier.renderingTools.renderReportHeader('Vertical Bar');

	// Now render the grid, line by line.
	for (var y = tmpHeight; y > 0; y--)
	{
		for (var x = pQuantifier.statistics.Minimum; x <= pQuantifier.statistics.Maximum; x++)
		{
			// Show a space between each bar
			if (x > pQuantifier.statistics.Minimum)
			{
				pQuantifier.renderingTools.writeReportString(' ');
			}

			if (y == tmpBarTops[x])
			{
				// If the bar top is rendered, render it.
				pQuantifier.renderingTools.writeReportString('-');
			}
			else if (y < tmpBarTops[x])
			{
				// If the bar top is rendered, render it.
				pQuantifier.renderingTools.writeReportString('#');
			}
			else
			{
				pQuantifier.renderingTools.writeReportString(':');
			}
		}
		pQuantifier.renderingTools.writeReportLine('');
	}

	pQuantifier.renderingTools.renderReportFooter('Vertical Bar');
};

module.exports = renderConsoleHorizontalBar;