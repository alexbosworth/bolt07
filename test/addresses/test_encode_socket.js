const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {encodeSocket} = require('./../../');

const tests = [
  {
    args: undefined,
    description: 'Arguments are required',
    error: 'ExpectedArgumentsToEncodeSocket',
  },
  {
    args: {},
    description: 'A socket is required',
    error: 'ExpectedSocketToEncode',
  },
  {
    args: {socket: 'socket'},
    description: 'Unknown socket type is not encoded',
    expected: {},
  },
  {
    args: {socket: '1.2.3.4:56789'},
    description: 'Encode ip version 4 socket',
    expected: {ip4: '01020304ddd5'},
  },
  {
    args: {socket: '0000:1111:2222:3333:4444:5555:6666:12345'},
    description: 'Encode ip version 6 socket',
    expected: {ip6: '00001111222233334444555566663039'},
  },
  {
    args: {
      socket: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.onion:0',
    },
    description: 'Encode tor v3 socket',
    expected: {
      tor3: '00000000000000000000000000000000000000000000000000000000000000000000000000',
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => encodeSocket(args), new Error(error), 'Got expected error');
    } else {
      const res = encodeSocket(args);

      strictSame(res, expected, 'Got expected result');
    }

    return end();
  });
});
