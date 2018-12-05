const {test} = require('tap');

const {chanNumber} = require('./../');

const tests = [
  {
    args: {id: '15fbe70000260000'},
    description: 'Standard testnet channel id',
    expected: {number: '1584113681139367936'},
  },
  {
    args: {id: '0832300008200001'},
    description: 'Standard bitcoin channel id',
    expected: {number: '590587277833404417'},
  },
];

tests.forEach(({args, description, expected}) => {
  return test(description, ({end, equals}) => {
    const {number} = chanNumber(args);

    equals(number, expected.number, 'Channel id number returned');

    return end();
  });
});
