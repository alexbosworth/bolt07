const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {chanNumber} = require('./../../');

const tests = [
  {
    args: {id: '15fbe70000260000'},
    description: 'Standard testnet channel id',
    expected: {number: '1584113681139367936'},
  },
  {
    args: {channel: '1440743x38x0'},
    description: 'Standard testnet channel',
    expected: {number: '1584113681139367936'},
  },
  {
    args: {id: '0832300008200001'},
    description: 'Standard bitcoin channel id',
    expected: {number: '590587277833404417'},
  },
  {
    args: {channel: '537136x2080x1'},
    description: 'Standard bitcoin channel',
    expected: {number: '590587277833404417'},
  },
  {
    args: {channel: '16000000x0x10'},
    description: 'SCID alias channel id',
    expected: {number: '17592186044416000010'},
  },
  {
    args: {id: 'ffffffffffffffff'},
    description: 'Maximum value channel id',
    expected: {number: '18446744073709551615'},
  },
  {
    args: {id: '0000000000000000'},
    description: 'Minimum value channel id',
    expected: {number: '0'},
  },
  {
    args: {},
    description: 'Channel or id is required',
    error: 'ExpectedChannelIdOrComponentsToConvertToNumber',
  },
  {
    args: {id: '00'},
    description: 'Id must not be too short',
    error: 'UnexpectedLengthOfShortChannelId',
  },
  {
    args: {id: '15fbe7000026000000'},
    description: 'Id must not be too long',
    error: 'UnexpectedLengthOfShortChannelId',
  },
  {
    args: {id: '000000000'},
    description: 'Id must not have an odd number of hex characters',
    error: 'UnexpectedLengthOfShortChannelId',
  },
  {
    args: {id: 'zzzzzzzzzzzzzzzz'},
    description: 'Id must be hex encoded',
    error: 'UnexpectedLengthOfShortChannelId',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => chanNumber(args), new Error(error), 'Got expected error');

      return end();
    }

    const {number} = chanNumber(args);

    strictSame(number, expected.number, 'Channel id number returned');

    return end();
  });
});
