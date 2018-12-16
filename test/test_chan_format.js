const {test} = require('tap');

const {chanFormat} = require('./../');

const tests = [
  {
    args: {id: '15fbe70000260000'},
    description: 'Standard testnet channel id',
    expected: {channel: '1440743x38x0'},
  },
  {
    args: {number: '1584113681139367936'},
    description: 'Standard testnet channel',
    expected: {channel: '1440743x38x0'},
  },
  {
    args: {id: '0832300008200001'},
    description: 'Standard bitcoin channel id',
    expected: {channel: '537136x2080x1'},
  },
  {
    args: {number: '590587277833404417'},
    description: 'Standard bitcoin channel',
    expected: {channel: '537136x2080x1'},
  },
];

tests.forEach(({args, description, expected}) => {
  return test(description, ({end, equals}) => {
    const {channel} = chanFormat(args);

    equals(channel, expected.channel, 'Channel formatted returned');

    return end();
  });
});

