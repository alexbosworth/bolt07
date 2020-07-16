const {test} = require('@alexbosworth/tap');

const {rawChanId} = require('./../../');

const tests = [
  {
    args: {channel: '1440743x38x0'},
    description: 'Standard testnet channel',
    expected: {id: '15fbe70000260000'},
  },
  {
    args: {number: '1584113681139367936'},
    description: 'Standard testnet channel id',
    expected: {id: '15fbe70000260000'},
  },
  {
    args: {channel: '537136x2080x1'},
    description: 'Standard bitcoin channel id',
    expected: {id: '0832300008200001'},
  },
  {
    args: {number: '590587277833404417'},
    description: 'Standard bitcoin channel id',
    expected: {id: '0832300008200001'},
  },
  {
    args: {},
    description: 'Number is required',
    error: 'ExpectedChannelIdInNumericFormat',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, ({end, equals, throws}) => {
    if (!!error) {
      throws(() => rawChanId(args), new Error(error), 'Got expected error');

      return end();
    }

    const {id} = rawChanId(args);

    equals(id, expected.id, 'Raw channel id returned');

    return end();
  });
});
