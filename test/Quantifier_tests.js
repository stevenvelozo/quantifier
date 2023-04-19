/**
* Unit tests for Quantifier
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const Chai = require('chai');
const Expect = Chai.expect;
const Assert = Chai.assert;

const libQuantifier = require('../source/Quantifier.js');

suite
(
	'Quantifier',
	function()
	{
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
						let testQuantifier = new libQuantifier();
						Expect(testQuantifier)
							.to.be.an('object', 'Quantifier should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'basic class parameters',
					function()
					{
						let testQuantifier = new libQuantifier();

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
						let testQuantifier = new libQuantifier();
						testQuantifier.settings.Title = 'Simple Histogram 1';

						testQuantifier.addBin(1);
						testQuantifier.addBin(5, 2);
						testQuantifier.addBin(1);
						testQuantifier.addBin(8, 6);
						testQuantifier.addBin(10);

						testQuantifier.generateStatistics();

						Expect(testQuantifier.statistics.Minimum)
							.to.equal(1);

						Expect(testQuantifier.statistics.Maximum)
							.to.equal(10);

						Expect(testQuantifier.bins[1])
							.to.equal(2);
					}
				);

				test
				(
					'generate a small fixed width histogram',
					function()
					{
						let testQuantifier = new libQuantifier();
						testQuantifier.settings.Minimum = 1;
						testQuantifier.settings.Maximum = 15;
						testQuantifier.settings.FixedRange = true;
						testQuantifier.settings.Title = 'Simple Histogram 2';

						testQuantifier.addBin(1);
						testQuantifier.addBin(5, 2);
						testQuantifier.addBin(1);
						testQuantifier.addBin(8, 6);
						testQuantifier.addBin(10, 4);

						testQuantifier.generateStatistics();

						Expect(testQuantifier.statistics.Minimum)
							.to.equal(1);

						Expect(testQuantifier.statistics.Maximum)
							.to.equal(15);

						Expect(testQuantifier.bins[1])
							.to.equal(2);
					}
				);

				test
				(
					'generate a complex larger histogram',
					function()
					{
						// This test can take a long time.  Give it at least 20 seconds.
						this.timeout(40000);

						let tmpOperationStartTime = +new Date();

						let testQuantifier = new libQuantifier();
						testQuantifier.settings.Title = 'Larger Histogram 2';
						testQuantifier.settings.Description = 'Add a large number of values to a 1...25 histogram to exercise basic scalability.';

						let tmpBinMin = 1;
						let tmpBinMax = 25;

						for (let i = 0; i < 1000000; i++)
							testQuantifier.addBin(Math.random() * (tmpBinMax - tmpBinMin) + tmpBinMin);
						for (let i = 0; i < 500000; i++)
							testQuantifier.addBin(Math.random() * (15 - 5) + 5);
						for (let i = 0; i < 200000; i++)
							testQuantifier.addBin(Math.random() * (11 - 8) + 8);
						for (let i = 0; i < 100000; i++)
							testQuantifier.addBin(Math.random() * (9 - 8) + 8);
						testQuantifier.generateStatistics();

						let tmpOperationEndTime = +new Date();
						let tmpOperationTime = tmpOperationEndTime - tmpOperationStartTime;
						console.log('  > Data Inserted and Statistics Generated in '+tmpOperationTime+'ms');

						Expect(testQuantifier.statistics.PushOperations)
							.to.equal(1800000);
					}
				);

				test
				(
					'generate a complex larger histogram using native math and Math.round',
					function()
					{
						// This test can take a long time.  Give it at least 20 seconds.
						this.timeout(40000);

						let tmpOperationStartTime = +new Date();

						let testQuantifier = new libQuantifier();

						// Tell the library to use standard rounding
						// The advanced rounding only works for the arbitrary precision math library
						testQuantifier.settings.MathMode.Standard.Rounding = true;

						testQuantifier.settings.Title = 'Larger Histogram 2';
						testQuantifier.settings.Description = 'Add a large number of values to a 1...25 histogram to exercise basic scalability.';

						let tmpBinMin = 1;
						let tmpBinMax = 25;

						for (let i = 0; i < 1000000; i++)
							testQuantifier.addBin(Math.random() * (tmpBinMax - tmpBinMin) + tmpBinMin);
						for (let i = 0; i < 500000; i++)
							testQuantifier.addBin(Math.random() * (15 - 5) + 5);
						for (let i = 0; i < 200000; i++)
							testQuantifier.addBin(Math.random() * (11 - 8) + 8);
						for (let i = 0; i < 100000; i++)
							testQuantifier.addBin(Math.random() * (9 - 8) + 8);
						testQuantifier.generateStatistics();

						let tmpOperationEndTime = +new Date();
						let tmpOperationTime = tmpOperationEndTime - tmpOperationStartTime;
						console.log('  > Data Inserted and Statistics Generated in '+tmpOperationTime+'ms');

						Expect(testQuantifier.statistics.PushOperations)
							.to.equal(1800000);
					}
				);

				test
				(
					'generate a complex larger histogram with Arbitrary Precision',
					function()
					{
						// This test can take a long time.  Give it at 40 seconds.
						this.timeout(40000);

						let tmpOperationStartTime = +new Date();

						let testQuantifier = new libQuantifier();
						testQuantifier.settings.MathMode.ArbitraryPrecision = true;
						testQuantifier.settings.Title = 'Larger Histogram 3';
						testQuantifier.settings.Description = 'Using arbitrary precision ... Add a large number of values to a 1...25 histogram to exercise basic scalability.  Although this uses the same algorithm as the previous test to generate the curve, because it has a different rounding mechanism it is not shaped the same.';

						let tmpBinMin = 1;
						let tmpBinMax = 25;

						for (let i = 0; i < 1000000; i++)
							testQuantifier.addBin(Math.random() * (tmpBinMax - tmpBinMin) + tmpBinMin);
						for (let i = 0; i < 500000; i++)
							testQuantifier.addBin(Math.random() * (15 - 5) + 5);
						for (let i = 0; i < 200000; i++)
							testQuantifier.addBin(Math.random() * (11 - 8) + 8);
						for (let i = 0; i < 100000; i++)
							testQuantifier.addBin(Math.random() * (9 - 8) + 8);
						testQuantifier.generateStatistics();

						let tmpOperationEndTime = +new Date();
						let tmpOperationTime = tmpOperationEndTime - tmpOperationStartTime;
						console.log('  > Data Inserted and Statistics Generated in '+tmpOperationTime+'ms');

						Expect(testQuantifier.statistics.PushOperations)
							.to.equal(1800000);
					}
				);


				test
				(
					'generate a wide histogram',
					function()
					{
						// This test can take a long time.  Give it at 40 seconds.
						this.timeout(40000);

						let tmpOperationStartTime = +new Date();

						let testQuantifier = new libQuantifier();

						testQuantifier.settings.Title = 'Wide Histogram 1';

						let tmpBinMin = 1;
						let tmpBinMax = 401;

						for (let i = 0; i < 1000000; i++)
							testQuantifier.addBin(Math.random() * (tmpBinMax - tmpBinMin) + tmpBinMin);
						for (let i = 0; i < 500000; i++)
							testQuantifier.addBin(Math.random() * (150 - 50) + 50);
						for (let i = 0; i < 200000; i++)
							testQuantifier.addBin(Math.random() * (110 - 80) + 80);
						for (let i = 0; i < 100000; i++)
							testQuantifier.addBin(Math.random() * (90 - 84) + 84);
						testQuantifier.generateStatistics();

						let tmpOperationEndTime = +new Date();
						let tmpOperationTime = tmpOperationEndTime - tmpOperationStartTime;
						console.log('  > Data Inserted and Statistics Generated in '+tmpOperationTime+'ms');

						Expect(testQuantifier.statistics.PushOperations)
							.to.equal(1800000);
					}
				);
			}
		);
	}
);