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

	var tmpQuantizedSet;
	if (tmpWidth < pQuantifier.statistics.Size)
	{
		tmpQuantizedSet = pQuantifier.quantizeLargestPossibleEvenSet(tmpWidth);
	}
	else
	{
		tmpQuantizedSet = pQuantifier.quantizeLargestPossibleEvenSet(pQuantifier.statistics.Size);
	}

	// Get the top point for each bar
	var tmpBarTops = [];
	for (var i = tmpQuantizedSet.statistics.Minimum; i <= tmpQuantizedSet.statistics.Maximum; i++)
	{
		var tmpBinAmount = (tmpQuantizedSet.statistics.ProcessedBins[i] == null) ? 0 : tmpQuantizedSet.statistics.ProcessedBins[i];
		tmpBarTops[i] = getBarTop(i, tmpBinAmount, tmpQuantizedSet.statistics.BinMaximum, tmpHeight);
	}

	pQuantifier.renderingTools.renderReportHeader('Vertical Bar');

	// Only separate the bars if there is room.
	var tmpBarSeparation = (tmpQuantizedSet.statistics.Size >= (tmpWidth/2)) ? '' : ' ';

	// Now render the grid, line by line.
	for (var y = tmpHeight; y > 0; y--)
	{
		for (var x = tmpQuantizedSet.statistics.Minimum; x <= tmpQuantizedSet.statistics.Maximum; x++)
		{
			// Show a space between each bar
			if (x > tmpQuantizedSet.statistics.Minimum)
			{
				pQuantifier.renderingTools.writeReportString(tmpBarSeparation);
			}

			if (y == tmpBarTops[x])
			{
				// If the bar top is rendered, render it.
				pQuantifier.renderingTools.writeReportString(tmpQuantizedSet.settings.ConsoleRendering.HistogramCap);
			}
			else if (y < tmpBarTops[x])
			{
				// If the bar top is rendered, render it.
				pQuantifier.renderingTools.writeReportString(tmpQuantizedSet.settings.ConsoleRendering.HistogramFull);
			}
			else
			{
				pQuantifier.renderingTools.writeReportString(tmpQuantizedSet.settings.ConsoleRendering.HistogramEmpty);
			}
		}
		pQuantifier.renderingTools.writeReportLine('');
	}

	pQuantifier.renderingTools.renderReportFooter('Vertical Bar');
};

module.exports = renderConsoleHorizontalBar;