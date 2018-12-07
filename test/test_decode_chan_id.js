const {test} = require('tap');

const {decodeChanId} = require('./../');

const tests = [
  {
    args: {number: '1584113681139367936'},
    description: 'Standard testnet channel id',
    expected: {
      block_height: 1440743,
      block_index: 38,
      output_index: 0,
    },
  },
  {
    args: {id: '15fbe70000260000'},
    description: 'Standard testnet channel id',
    expected: {
      block_height: 1440743,
      block_index: 38,
      output_index: 0,
    },
  },
  {
    args: {number: '590587277833404417'},
    description: 'Standard bitcoin channel id',
    expected: {
      block_height: 537136,
      block_index: 2080,
      output_index: 1,
    },
  },
  {
    args: {id: '0832300008200001'},
    description: 'Standard bitcoin channel id',
    expected: {
      block_height: 537136,
      block_index: 2080,
      output_index: 1,
    },
  },
];

tests.forEach(({args, description, expected}) => {
  return test(description, ({equal, end}) => {
    const decoded = decodeChanId(args);

    equal(decoded.block_height, expected.block_height, 'Block height derived');
    equal(decoded.block_index, expected.block_index, 'Block index derived');
    equal(decoded.output_index, expected.output_index, 'Output index derived');

    return end();
  });
});

