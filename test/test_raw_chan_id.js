const {test} = require('tap');

const {rawChanId} = require('./../');

const tests = [
  {
    args: {number: '1584113681139367936'},
    description: 'Standard testnet channel id',
    expected: {id: '15fbe70000260000'},
  },
  {
    args: {number: '590587277833404417'},
    description: 'Standard bitcoin channel id',
    expected: {id: '0832300008200001'},
  },
];

tests.forEach(({args, description, expected}) => {
  return test(description, ({end, equals}) => {
    const {id} = rawChanId(args);

    equals(id, expected.id, 'Raw channel id returned');

    return end();
  });
});

