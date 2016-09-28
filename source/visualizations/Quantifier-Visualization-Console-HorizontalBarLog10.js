/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Quantifier Console Log10 Horizontal Bar Renderer
*
* Display the console graph using a log10 scale, so elements don't blow out with huge set values
*/

// This is a sprite buffer for the bar graphic.  It is used to generate the bar
var _BarGraphicCache = '';
var generateBar = function(pValue, pAmount, pMax, pWidth)
{
	var tmpBarRenderAmount = (pAmount === 0) ? 0 : Math.log(pAmount) / (Math.log(pMax) / pWidth);

	// If the value equates to 0, just show an empty bar.
	if (parseInt(tmpBarRenderAmount) == 0)
	{
		return tmpBar = ('     '+pValue).slice(-5)+' |';
	}

	return tmpBar = ('     '+pValue).slice(-5)+' |'+_BarGraphicCache.slice(-tmpBarRenderAmount)+'   < '+pAmount;
};

var renderConsoleHorizontalBar = function(pQuantifier)
{
	// For Log10 we always want scaling
	var tmpWidth = pQuantifier.settings.ConsoleRendering.Width - 25;

	// Generate the ascii sprite used to render each bar
	_BarGraphicCache = pQuantifier.settings.ConsoleRendering.HistogramFull.repeat(tmpWidth)+pQuantifier.settings.ConsoleRendering.HistogramCap;

	pQuantifier.renderingTools.renderReportHeader('Horizontal Bar Log10');

	for (var i = pQuantifier.statistics.Minimum; i <= pQuantifier.statistics.Maximum; i++)
	{
		var tmpBinAmount = (pQuantifier.statistics.ProcessedBins[i] == null) ? 0 : pQuantifier.statistics.ProcessedBins[i];
		pQuantifier.renderingTools.writeReportLine(generateBar(i, tmpBinAmount, pQuantifier.statistics.BinMaximum, tmpWidth));
	}

	pQuantifier.renderingTools.renderReportFooter('Horizontal Bar Log10');
};

module.exports = renderConsoleHorizontalBar;