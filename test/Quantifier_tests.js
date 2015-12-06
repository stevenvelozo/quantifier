/**
* Unit tests for Quantifier
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require('chai');
var Expect = Chai.expect;
var Assert = Chai.assert;

var libQuantifier = require('../source/Quantifier.js');

suite
(
	'Quantifier',
	function()
	{
		setup
		(
			function()
			{
			}
		);

		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'initialize should build a happy little object',
					function()
					{
						var testQuantifier = libQuantifier.new();
						Expect(testQuantifier)
							.to.be.an('object', 'Quantifier should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'basic class parameters',
					function()
					{
						var testQuantifier = libQuantifier.new();

						Expect(testQuantifier).to.have.a.property('settings')
							.that.is.a('object');
						Expect(testQuantifier.settings).to.have.a.property('Hash')
							.that.is.a('string'); 
						Expect(testQuantifier.settings).to.have.a.property('Title')
							.that.is.a('string'); 
						Expect(testQuantifier.settings).to.have.a.property('Description')
							.that.is.a('boolean'); 
						Expect(testQuantifier.settings).to.have.a.property('Minimum')
							.that.is.a('boolean'); 
						Expect(testQuantifier.settings).to.have.a.property('Maximum')
							.that.is.a('boolean'); 

						Expect(testQuantifier).to.have.a.property('statistics')
							.that.is.a('object');
						Expect(testQuantifier.statistics).to.have.a.property('Entries')
							.that.is.a('boolean'); 
						Expect(testQuantifier.statistics).to.have.a.property('PushOperations')
							.that.is.a('number'); 
					}
				);
			}
		);

		suite
		(
			'Basic Histogramming',
			function()
			{
				test
				(
					'generate a small simple histogram',
					function()
					{
						var testQuantifier = libQuantifier.new();
						testQuantifier.settings.Title = 'Unit Test Histogram 1';
						testQuantifier.settings.Description = 'Add a few values to a 1...10 histogram to exercise basic functionality.';

						testQuantifier.addBin(1);
						testQuantifier.addBin(5, 2);
						testQuantifier.addBin(1);
						testQuantifier.addBin(8, 6);
						testQuantifier.addBin(10);

						Expect(testQuantifier.statistics.Minimum)
							.to.equal(1);

						Expect(testQuantifier.statistics.Maximum)
							.to.equal(10);

						Expect(testQuantifier.bins[1])
							.to.equal(2);
						testQuantifier.generateStatistics();

						//console.log(JSON.stringify(testQuantifier.statistics, null, 4));
						testQuantifier.renderReport('HorizontalBar');

						testQuantifier.renderReport('HorizontalBarLog10');
					}
				);

			}
		);

		suite
		(
			'State Management',
			function()
			{

			}
		);
	}
);