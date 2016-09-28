/**
* Climate Model - Load Records
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/

/**
* Load pFile into pModel, using the NOAA CSV format.
*/
var loadClimateModelCSV = function(pFable, pFile, fAddDatum, fStageComplete)
{
	var tmpStageComplete = (typeof(fStageComplete) === 'function') ? fStageComplete : ()=>{};

	var libAsync = require(pFable.modulePath('async'));
	var libLineByLine = require(pFable.modulePath('line-by-line'));
	var libCSVParser = require(pFable.modulePath('csv-parse/lib/sync'));

	var tmpLineReader = new libLineByLine(pFile);
	var tmpWeatherFileHeader = false;

	var parseCSVLine = (pLine) =>
	{
		var tmpValues = libCSVParser(pLine);

		if (tmpValues.length > 0)
			return tmpValues[0];
		else
			return false;
	};


	var marshalWeatherRecord = (pRecord) =>
	{
		return (
			{
				WeatherStation: pRecord[tmpWeatherFileHeader['WeatherStation']],
				WeatherStationName: pRecord[tmpWeatherFileHeader['WeatherStationName']],

				Elevation: pRecord[tmpWeatherFileHeader['Elevation']],
				Latitude: pRecord[tmpWeatherFileHeader['Latitude']],
				Longitude: pRecord[tmpWeatherFileHeader['Longitude']],

				Time: pRecord[tmpWeatherFileHeader['Time']],

				CoolingDegreesNormal: pRecord[tmpWeatherFileHeader['CoolingDegreesNormal']],
				HeatingDegreesNormal: pRecord[tmpWeatherFileHeader['HeatingDegreesNormal']],

				Pressure: pRecord[tmpWeatherFileHeader['Pressure']],
				CloudCoverPercent: pRecord[tmpWeatherFileHeader['CloudCoverPercent']],
				DewPoint: pRecord[tmpWeatherFileHeader['DewPoint']],

				HeatIndex: pRecord[tmpWeatherFileHeader['HeatIndex']],
				Temperature: pRecord[tmpWeatherFileHeader['Temperature']],

				WindChill: pRecord[tmpWeatherFileHeader['WindChill']],
				WindSpeed: pRecord[tmpWeatherFileHeader['WindSpeed']],
				WindVector: pRecord[tmpWeatherFileHeader['WindVector']],
				WindVectorSpeed: pRecord[tmpWeatherFileHeader['WindVectorSpeed']]
			}
		);
	};

	/**
	 * Data insertion queue
	 */
	var tmpQueue = libAsync.queue(
		function(pLine, fCallback)
		{
			if (tmpWeatherFileHeader)
			{
				fAddDatum(marshalWeatherRecord(parseCSVLine(pLine)), fCallback);
			}
			else
			{
				// Get the header reverse lookup
				tmpWeatherFileHeader = {};
				var tmpWeatherHeaderLine = parseCSVLine(pLine);
				for (var i = 0; i < tmpWeatherHeaderLine.length; i++)
				{
					tmpWeatherFileHeader[tmpWeatherHeaderLine[i]] = i;
				}
				fCallback();
			}
		},
		pFable.settings.WeatherQueueConcurrency
	);
	// Resume emitting lines from the data file whenever the queue empties itself
	tmpQueue.drain = () =>
	{
		tmpLineReader.resume();
	};
	/*
	 * END Data insertion queue
	 **/

	/**
	 * Reading in the file line by line
	 */
	tmpLineReader.on('error',
		function (pError)
		{
			pFable.log.error('There was an error reading the WeatherDataFile',{Error:pError});
		}
	);
	tmpLineReader.on('line',
		function (pLine)
		{
			tmpQueue.push(pLine);
			// Pause emitting of lines from the data file if the queue is maxed out
			if (tmpQueue.length > pFable.settings.WeatherQueueMax)
				tmpLineReader.pause();
		}
	);
	tmpLineReader.on('end', 
		function ()
		{
			// All lines are read, file is closed now.
			pFable.log.info('... WeatherDataFile loaded.');
			tmpStageComplete();
		}
	);
	/*
	 * END Reading in the file line by line
	 **/

};

module.exports = loadClimateModelCSV;