const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {decodeSocket} = require('./../../');

const tests = [
  {
    args: {},
    description: 'A socket is expected',
    error: 'ExpectedSocketDataToDecodeSocket',
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
    args: {dns: '10aabb2607'},
    description: 'DNS hostname length must match the hostname data',
    error: 'UnexpectedLengthForDnsSocketData',
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
    args: {ip6: '20010db80000000000000000000000012607'},
    description: 'Decode encoded ip version 6 socket',
    expected: {socket: '2001:0db8:0000:0000:0000:0000:0000:0001:9735'},
  },
  {
    args: {tor3: Buffer.alloc(37).toString('hex')},
    description: 'Decode tor v3 onion socket',
    expected: {
      socket: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.onion:0',
    },
  },
  {
    args: {
      tor3: '07070707070707070707070707070707070707070707070707070707070707076178032607',
    },
    description: 'Decode checksummed tor v3 onion socket',
    expected: {
      socket: 'a4dqobyha4dqobyha4dqobyha4dqobyha4dqobyha4dqobyha4dwc6ad.onion:9735',
    },
  },
  {
    args: {dns: '106e6f64652e6578616d706c652e636f6d2607'},
    description: 'Decode DNS hostname socket',
    expected: {socket: 'node.example.com:9735'},
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
