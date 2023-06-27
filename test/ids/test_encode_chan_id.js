const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {encodeChanId} = require('./../../');

const tests = [
  {
    args: {block_height: 1440743, block_index: 38, output_index: 0},
    description: 'Standard testnet channel id',
    expected: {
      channel: '1440743x38x0',
      id: '15fbe70000260000',
      number: '1584113681139367936',
    },
  },
  {
    args: {block_height: 537136, block_index: 2080, output_index: 1},
    description: 'Standard bitcoin channel id',
    expected: {
      channel: '537136x2080x1',
      id: '0832300008200001',
      number: '590587277833404417',
    },
  },
  {
    args: {block_height: 16000000, block_index: 0, output_index: 10},
    description: 'SCID alias channel id',
    expected: {
      channel: '16000000x0x10',
      id: 'f42400000000000a',
      number: '17592186044416000010',
    },
  },
  {
    args: {},
    description: 'Expected block height',
    error: 'ExpectedBlockHeightForChannelId',
  },
  {
    args: {block_height: 1440743},
    description: 'Expected block index',
    error: 'ExpectedBlockIndexForChannelId',
  },
  {
    args: {block_height: 1440743, block_index: 2080},
    description: 'Expected output index',
    error: 'ExpectedTransactionOutputIndexForChannelId',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => encodeChanId(args), new Error(error), 'Got expected err');

      return end();
    }

    const encoded = encodeChanId(args);

    strictSame(encoded.channel, expected.channel, 'Channel components');
    strictSame(encoded.id, expected.id, 'Channel id returned');
    strictSame(encoded.number, expected.number, 'Channel number returned');

    return end();
  });
});
