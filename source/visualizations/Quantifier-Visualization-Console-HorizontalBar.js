// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Quantifier Console Linear Horizontal Bar Renderer
*/

// This is a sprite buffer for the bar graphic.  It is used to generate the bar
var _BarGraphicCache = '';
var generateBar = function(pValue, pAmount, pMax, pWidth)
{
	var tmpBarRenderAmount = pAmount;

	if ((pMax > pWidth) && (tmpBarRenderAmount > 0))
	{
		tmpBarRenderAmount = pAmount / (pMax / pWidth);
	}

	if (parseInt(tmpBarRenderAmount) == 0)
	{
		return tmpBar = ('     '+pValue).slice(-5)+' |';
	}

	return tmpBar = ('     '+pValue).slice(-5)+' |'+_BarGraphicCache.slice(-tmpBarRenderAmount)+'   < '+pAmount;
};

var renderConsoleHorizontalBar = function(pQuantifier)
{
	// Determine the width for our rendering
	var tmpWidth = pQuantifier.statistics.BinMaximum;
	// Because this is linear, if the display is wider than the sets maximum bin size, alter the width.
	if (pQuantifier.settings.ConsoleRendering.Width < (pQuantifier.statistics.BinMaximum + 25))
	{
		tmpWidth = pQuantifier.settings.ConsoleRendering.Width - 25;
	}

	// Generate the ascii sprite used to render each bar
	_BarGraphicCache = "#".repeat(tmpWidth)+'|';

	pQuantifier.renderingTools.renderReportHeader('Horizontal Bar');

	for (var i = pQuantifier.statistics.Minimum; i <= pQuantifier.statistics.Maximum; i++)
	{
		var tmpBinAmount = (pQuantifier.statistics.ProcessedBins[i] === null) ? 0 : pQuantifier.statistics.ProcessedBins[i];
		pQuantifier.renderingTools.writeReportLine(generateBar(i, tmpBinAmount, pQuantifier.statistics.BinMaximum, tmpWidth));
	}

	pQuantifier.renderingTools.renderReportFooter('Horizontal Bar');
};

module.exports = renderConsoleHorizontalBar;