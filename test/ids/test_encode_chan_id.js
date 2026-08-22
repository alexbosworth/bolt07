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
    args: {block_height: 16777215, block_index: 16777215, output_index: 65535},
    description: 'Maximum encodable channel id',
    expected: {
      channel: '16777215x16777215x65535',
      id: 'ffffffffffffffff',
      number: '18446744073709551615',
    },
  },
  {
    args: {block_height: 0, block_index: 0, output_index: 0},
    description: 'Minimum encodable channel id',
    expected: {
      channel: '0x0x0',
      id: '0000000000000000',
      number: '0',
    },
  },
  {
    args: {},
    description: 'Expected block height',
    error: 'ExpectedBlockHeightForChannelId',
  },
  {
    args: {block_height: 16777216, block_index: 0, output_index: 0},
    description: 'Expected block height that fits within three bytes',
    error: 'ExpectedBlockHeightWithinRangeForChannelId',
  },
  {
    args: {block_height: 1440743},
    description: 'Expected block index',
    error: 'ExpectedBlockIndexForChannelId',
  },
  {
    args: {block_height: 1440743, block_index: 16777216, output_index: 0},
    description: 'Expected block index that fits within three bytes',
    error: 'ExpectedBlockIndexWithinRangeForChannelId',
  },
  {
    args: {block_height: 1440743, block_index: 2080},
    description: 'Expected output index',
    error: 'ExpectedTransactionOutputIndexForChannelId',
  },
  {
    args: {block_height: 1440743, block_index: 2080, output_index: 65536},
    description: 'Expected output index that fits within two bytes',
    error: 'ExpectedOutputIndexWithinRangeForChannelId',
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
