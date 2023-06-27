const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {decodeSocket} = require('./../../');

const tests = [
  {
    args: {},
    description: 'A socket is expected',
    error: 'ExectedSocketDataToDecodeSocket',
  },
  {
    args: {ip4: true, ip6: true},
    description: 'A single socket is expected',
    error: 'ExpectedOnlyOneSocketTypeToDecode',
  },
  {
    args: {ip4: '00'},
    description: 'A socket requires sufficient bytes',
    error: 'ExpectedSocketDataWithPortToDecodeSocket',
  },
  {
    args: {ip4: '000000'},
    description: 'Ip4 requires sufficient bytes',
    error: 'UnexpectedLengthForIpV4SocketData',
  },
  {
    args: {ip6: '000000'},
    description: 'Ip6 requires sufficient bytes',
    error: 'UnexpectedLengthForIpV6SocketData',
  },
  {
    args: {tor3: '000000'},
    description: 'Tor3 requires sufficient bytes',
    error: 'UnexpectedLengthForTorV3SocketData',
  },
  {
    args: {ip4: Buffer.alloc(6).toString('hex')},
    description: 'Decode ip version 4 socket',
    expected: {socket: '0.0.0.0:0'},
  },
  {
    args: {ip6: Buffer.alloc(18).toString('hex')},
    description: 'Decode ip version 6 socket',
    expected: {socket: '0000:0000:0000:0000:0000:0000:0000:0000:0'},
  },
  {
    args: {tor3: Buffer.alloc(37).toString('hex')},
    description: 'Decode tor v3 onion socket',
    expected: {
      socket: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.onion:0',
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => decodeSocket(args), new Error(error), 'Got expected error');
    } else {
      const res = decodeSocket(args);

      strictSame(res, expected, 'Got expected result');
    }

    return end();
  });
});
