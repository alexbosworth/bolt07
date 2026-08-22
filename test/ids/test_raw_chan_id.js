const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');
const {throws} = require('node:assert').strict;

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
    args: {number: '17592186044416000010'},
    description: 'SCID alias channel id',
    expected: {id: 'f42400000000000a'},
  },
  {
    args: {number: '18446744073709551615'},
    description: 'Maximum value channel id number',
    expected: {id: 'ffffffffffffffff'},
  },
  {
    args: {number: '0'},
    description: 'Minimum value channel id number',
    expected: {id: '0000000000000000'},
  },
  {
    args: {},
    description: 'Number is required',
    error: 'ExpectedChannelIdInNumericFormat',
  },
  {
    args: {number: 'number'},
    description: 'Number must be numeric',
    error: 'ExpectedNumericValueForChannelId',
  },
  {
    args: {number: '-1'},
    description: 'Number must not be negative',
    error: 'ExpectedNumericValueForChannelId',
  },
  {
    args: {number: '18446744073709551616'},
    description: 'Number must fit within eight bytes',
    error: 'ExpectedNumberWithinRangeForChannelId',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => rawChanId(args), new Error(error), 'Got expected error');

      return end();
    }

    const {id} = rawChanId(args);

    strictSame(id, expected.id, 'Raw channel id returned');

    return end();
  });
});
