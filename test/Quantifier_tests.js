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
						testQuantifier.settings.Title = 'Simple Histogram 1';

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

						testQuantifier.renderReport('HorizontalBar');
						testQuantifier.renderReport('HorizontalBarLog10');
					}
				);

				test
				(
					'generate a complex larger histogram',
					function()
					{
						var tmpOperationStartTime = +new Date();

						var testQuantifier = libQuantifier.new();
						testQuantifier.settings.Title = 'Larger Histogram 2';
						testQuantifier.settings.Description = 'Add a large number of values to a 1...25 histogram to exercise basic scalability.';

						var tmpBinMin = 1;
						var tmpBinMax = 25;

						for (var i = 0; i < 1000000; i++)
							testQuantifier.addBin(Math.random() * (tmpBinMax - tmpBinMin) + tmpBinMin);
						for (var i = 0; i < 500000; i++)
							testQuantifier.addBin(Math.random() * (15 - 5) + 5);
						for (var i = 0; i < 200000; i++)
							testQuantifier.addBin(Math.random() * (11 - 8) + 8);
						for (var i = 0; i < 100000; i++)
							testQuantifier.addBin(Math.random() * (9 - 8) + 8);
						testQuantifier.generateStatistics();

						var tmpOperationEndTime = +new Date();
						var tmpOperationTime = tmpOperationEndTime - tmpOperationStartTime;
						console.log('  > Statistics Generated in '+tmpOperationTime+'ms');

						//testQuantifier.renderReport('HorizontalBar');
						testQuantifier.renderReport('HorizontalBarLog10');

						Expect(testQuantifier.statistics.PushOperations)
							.to.equal(1800000);
					}
				);

				test
				(
					'generate a complex larger histogram with Arbitrary Precision',
					function()
					{
						// This test can take a long time.  Give it at least 20 seconds.
						this.timeout(20000);

						var tmpOperationStartTime = +new Date();

						var testQuantifier = libQuantifier.new();
						testQuantifier.settings.MathMode.ArbitraryPrecision = true;
						testQuantifier.settings.Title = 'Larger Histogram 3';
						testQuantifier.settings.Description = 'Using arbitrary precision ... Add a large number of values to a 1...25 histogram to exercise basic scalability.';

						var tmpBinMin = 1;
						var tmpBinMax = 25;

						for (var i = 0; i < 1000000; i++)
							testQuantifier.addBin(Math.random() * (tmpBinMax - tmpBinMin) + tmpBinMin);
						for (var i = 0; i < 500000; i++)
							testQuantifier.addBin(Math.random() * (15 - 5) + 5);
						for (var i = 0; i < 200000; i++)
							testQuantifier.addBin(Math.random() * (11 - 8) + 8);
						for (var i = 0; i < 100000; i++)
							testQuantifier.addBin(Math.random() * (9 - 8) + 8);
						testQuantifier.generateStatistics();

						var tmpOperationEndTime = +new Date();
						var tmpOperationTime = tmpOperationEndTime - tmpOperationStartTime;
						console.log('  > Statistics Generated in '+tmpOperationTime+'ms');

						//testQuantifier.renderReport('HorizontalBar');
						testQuantifier.renderReport('HorizontalBarLog10');

						Expect(testQuantifier.statistics.PushOperations)
							.to.equal(1800000);
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