/**
* Climate Settings
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/

module.exports = (
{
	LogStreams:
	[
		{
			level: 'trace',
			streamtype:'process.stdout',
		},
		{
			level: 'trace',
			path: __dirname+'/Climate.log'
		}
	],
	
	NodeModuleRoot: `${__dirname}/../../node_modules/`,

	// Use the in-memory provider by default
	MeadowProvider: 'ALASQL',
	MeadowSchemaFilePrefix: `${__dirname}/schema/MeadowSchema-`,

	// The persistence mechanism (if this is true, it stores in an object array --- false, it uses Meadow)
	WeatherDataStorageSimple: true,
	// Autoload any weather data in the Meadow database
	WeatherDataDepersist: false,

	// The input file to load weather data from
	WeatherDataFile: `${__dirname}/data/NOAA-Climate-Seattle-1981-2010-Hourly.csv`,
	// Autoload the weather data from the CSV
	WeatherDataAutoLoad: true,

	// How many inserts are done concurrently.  If this is more than one, Record order is not file order.
	WeatherQueueConcurrency: 1,
	// The maximum entries in the queue object before we pause insertion until done processing
	WeatherQueueMax: 100
});