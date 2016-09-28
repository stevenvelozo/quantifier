/**
* @license MIT
* @author <steven@velozo.com>
*/
"use strict";

/**
 * Reading in the file line by line
 */

/**
* Climate Data Model
*
* Stores longitudinal weather.
*
* @class Quantifier
*/
var ClimateModel = function()
{
	function createNew(pFable)
	{
		// If a valid Fable object isn't passed in, return a constructor
		if ((typeof(pFable) !== 'object') || (!pFable.hasOwnProperty('fable')))
		{
			return {new: createNew};
		}
		var _Fable = pFable;

		var libRetold = require(_Fable.modulePath('retold'));

		var _WeatherData = [];

		var addDatum = (pDatum, fCallback) =>
		{
			if (pFable.settings.WeatherDataStorageSimple)
			{
				_WeatherData.push(pDatum);
				fCallback();
			}
			else
			{
				libRetold.DALMacros.doDALCreate({SchemaName:'Weather', IDUser:1, Record:pDatum}, fCallback);
			}
		};

		var loadClimateCSV = require('./Climate-Model-Load.js');
		var load = (fCallback, pFileName) =>
		{
			let tmpFileName = (typeof(pFileName) === 'undefined') ? _Fable.settings.WeatherDataFile : pFileName;
			return loadClimateCSV(_Fable, tmpFileName, addDatum, fCallback);
		};

		var processRecords = (pRecords, fProcessLine, fCallback) =>
		{
			var tmpProcessLine = (typeof(fProcessLine) === 'function') ? fProcessLine : ()=>{};
			var tmpCallback = (typeof(fCallback) === 'function') ? fCallback : ()=>{};
			for (var i = 0; i < pRecords.length; i++)
			{
				tmpProcessLine(pRecords[i]);
			}
			fCallback();
		}

		var readAll = (fProcessLine, fCallback) =>
		{
			if (pFable.settings.WeatherDataStorageSimple)
			{
				processRecords(_WeatherData, fProcessLine, fCallback);
			}
			else
			{
				libRetold.DALMacros.doDALReads(
					{
						SchemaName:'Weather',
						Cap:25,
						Begin:0,
						Filter:''
					},
					(pError, pQuery, pRecords) =>
					{
						processRecords(pRecords, fProcessLine, fCallback);
					}
				);
			}
		};

		// Container Object for our Factory Pattern
		var tmpNewClimateModelObject = (
		{
			load: load,

			readAll: readAll,

			addDatum: addDatum,

			new: createNew
		});

		return tmpNewClimateModelObject;
	}

	return createNew();
};

module.exports = new ClimateModel();
