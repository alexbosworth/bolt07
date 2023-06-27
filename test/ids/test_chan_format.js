const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {chanFormat} = require('./../../');

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
  {
    args: {number: '17592186044416000010'},
    description: 'SCID alias type id',
    expected: {channel: '16000000x0x10'},
  },
  {
    args: {},
    description: 'An id or number is required',
    error: 'ExpectedIdOrNumberToFormatAsChannelComponents',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => chanFormat(args), new Error(error), 'Got expected error');

      return end();
    }

    const {channel} = chanFormat(args);

    strictSame(channel, expected.channel, 'Channel formatted returned');

    return end();
  });
});
