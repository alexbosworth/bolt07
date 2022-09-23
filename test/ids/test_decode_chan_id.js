const {test} = require('@alexbosworth/tap');

const {decodeChanId} = require('./../../');

const tests = [
  {
    args: {channel: '1440743x38x0'},
    description: 'Standard testnet channel',
    expected: {block_height: 1440743, block_index: 38, output_index: 0},
  },
  {
    args: {id: '15fbe70000260000'},
    description: 'Standard testnet channel id',
    expected: {block_height: 1440743, block_index: 38, output_index: 0},
  },
  {
    args: {number: '1584113681139367936'},
    description: 'Standard testnet channel id',
    expected: {block_height: 1440743, block_index: 38, output_index: 0},
  },
  {
    args: {channel: '537136x2080x1'},
    description: 'Standard bitcoin channel',
    expected: {block_height: 537136, block_index: 2080, output_index: 1},
  },
  {
    args: {id: '0832300008200001'},
    description: 'Standard bitcoin channel id',
    expected: {block_height: 537136, block_index: 2080, output_index: 1},
  },
  {
    args: {number: '590587277833404417'},
    description: 'Standard bitcoin channel id',
    expected: {block_height: 537136, block_index: 2080, output_index: 1},
  },
  {
    args: {number: '17592186044416000010'},
    description: 'SCID alias channel id',
    expected: {block_height: 16000000, block_index: 0, output_index: 10},
  },
  {
    args: {},
    description: 'Id or channel or number is required',
    error: 'ExpectedShortChannelIdToDecode',
  },
  {
    args: {id: '00'},
    description: 'Id needs to be correct length',
    error: 'UnexpectedLengthOfShortChannelId',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, ({equal, end, throws}) => {
    if (!!error) {
      throws(() => decodeChanId(args), new Error(error), 'Got expected err');

      return end();
    }

    const decoded = decodeChanId(args);

    equal(decoded.block_height, expected.block_height, 'Block height derived');
    equal(decoded.block_index, expected.block_index, 'Block index derived');
    equal(decoded.output_index, expected.output_index, 'Output index derived');

    return end();
  });
});
