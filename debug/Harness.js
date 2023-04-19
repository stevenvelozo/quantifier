const libQuantifier = require(`../source/Quantifier.js`);

let testQuantifier = new libQuantifier();

testQuantifier.settings.Title = 'Larger Histogram 2 lifted from Tests';
testQuantifier.settings.Description = 'Add a large number (a million or so) of values to a 1...25 histogram to exercise basic scalability.';

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