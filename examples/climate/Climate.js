/**
* Climate Histogram test app.
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/

var _SettingsDefaults = require('./Climate-Settings.js');
var modulePath = (pModuleName)=>{ return `${_SettingsDefaults.NodeModuleRoot}${pModuleName}`; };
// The dependency libraries for loading data, logging, etc.
var libFable = require(modulePath('fable'));
var _Fable = libFable.new(_SettingsDefaults);

// Quick macro to build module paths.
//   We use this to allow modules to be loaded from the main quantifier node_modules
//   since this is an "example" application.  It can be changed in the fable settings
//   object without disrupting the rest of the code.
_Fable.modulePath = modulePath;

_Fable.log.info('Starting up the quantifier example climate application...');

// Initialize the Quantifier histogram library (use the unpackaged version not the npm module)
var libQuantifier = require(_Fable.modulePath('../source/Quantifier.js'));
// Switch to this if you want to use the npm module, and fix NodeModuleRoot above
// var libQuantifier = require(modulePath('quantifier'));

var _ClimateModel = require('./Climate-Model.js').new(_Fable);

var _Histograms = {};
// Add a histogram to the library
var histogramsAdd = (pVariable, pTitle) =>
{
	_Histograms[pVariable] = libQuantifier.new();
	_Histograms[pVariable].settings.Title = (typeof(pTitle) === 'string') ? pTitle : pVariable;
};
// Bin values in the histograms
var histogramsBin = (pRecord) =>
{
	for (var tmpProperty in _Histograms)
	{
		_Histograms[tmpProperty].addBin(pRecord[tmpProperty]);
	}
};
// Generate statistics for each histogram
var histogramsGenerateStatistics = () =>
{
	for (var tmpProperty in _Histograms)
		_Histograms[tmpProperty].generateStatistics();
};
var histogramsRenderHorizontal = (pVariable) =>
{
	_Histograms[pVariable].renderReport('HorizontalBar');
};

histogramsAdd('Pressure');
histogramsAdd('HeatIndex', 'Heat Index');
histogramsAdd('Temperature');
histogramsAdd('WindChill', 'Wind Chill');
histogramsAdd('WindSpeed', 'Wind Speed');
histogramsAdd('WindVector', 'Wind Vector');

_ClimateModel.load(() =>
	{
		_ClimateModel.readAll(
			(pRecord)=>
			{
				//console.log(pRecord.Time+' '+pRecord.HeatIndex);
				histogramsBin(pRecord);
			},
			()=>
			{
				histogramsGenerateStatistics();
				histogramsRenderHorizontal('Temperature');
				histogramsRenderHorizontal('Pressure');
				histogramsRenderHorizontal('WindChill');
				histogramsRenderHorizontal('WindSpeed');
				histogramsRenderHorizontal('WindVector');
				// Wait for a key to continue
				process.stdin.setRawMode(true);
				process.stdin.resume();
				process.stdin.on('data', process.exit.bind(process, 0));
			}
		);
	}
);

