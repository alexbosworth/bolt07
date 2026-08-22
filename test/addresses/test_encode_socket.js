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
    args: {socket: '0000:1111:2222:3333:4444:5555:6666:7777:12345'},
    description: 'Encode ip version 6 socket',
    expected: {ip6: '000011112222333344445555666677773039'},
  },
  {
    args: {socket: '2001:0db8:0000:0000:0000:0000:0000:0001:9735'},
    description: 'Encode fully padded ip version 6 socket',
    expected: {ip6: '20010db80000000000000000000000012607'},
  },
  {
    args: {socket: '2001:db8::1:9735'},
    description: 'Encode zero compressed ip version 6 socket',
    expected: {ip6: '20010db80000000000000000000000012607'},
  },
  {
    args: {socket: '[2001:db8::1]:9735'},
    description: 'Encode bracketed ip version 6 socket',
    expected: {ip6: '20010db80000000000000000000000012607'},
  },
  {
    args: {socket: '::1:9735'},
    description: 'Encode loopback ip version 6 socket',
    expected: {ip6: '000000000000000000000000000000012607'},
  },
  {
    args: {socket: '[2001:db8::8a2e:370:7334]:9735'},
    description: 'Encode middle zero compressed ip version 6 socket',
    expected: {ip6: '20010db80000000000008a2e037073342607'},
  },
  {
    args: {socket: '0000:1111:2222:3333:4444:5555:6666:12345'},
    description: 'Ip version 6 socket must have eight groups',
    expected: {},
  },
  {
    args: {socket: '[::ffff:1.2.3.4]:9735'},
    description: 'Ip version 4 mapped sockets are not encoded',
    expected: {},
  },
  {
    args: {socket: '[fe80::1%25eth0]:9735'},
    description: 'Zone indexed sockets are not encoded',
    expected: {},
  },
  {
    args: {socket: '1.2.3.4:65536'},
    description: 'Socket port must fit within a uint16',
    expected: {},
  },
  {
    args: {socket: '1.2.3.4:port'},
    description: 'Socket port must be numeric',
    expected: {},
  },
  {
    args: {socket: '2001::db8::1:9735'},
    description: 'Ip version 6 socket must have a single zero compression',
    expected: {},
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
  {
    args: {
      socket: 'a4dqobyha4dqobyha4dqobyha4dqobyha4dqobyha4dqobyha4dwc6ad.onion:9735',
    },
    description: 'Encode checksummed tor v3 socket',
    expected: {
      tor3: '07070707070707070707070707070707070707070707070707070707070707076178032607',
    },
  },
  {
    args: {socket: 'expyuzz4wqqyqhjn.onion:9735'},
    description: 'Tor v2 sockets are not encoded',
    expected: {},
  },
  {
    args: {socket: 'node.example.com:9735'},
    description: 'Encode DNS hostname socket',
    expected: {dns: '106e6f64652e6578616d706c652e636f6d2607'},
  },
  {
    args: {socket: 'localhost:9735'},
    description: 'Encode single label DNS hostname socket',
    expected: {dns: '096c6f63616c686f73742607'},
  },
  {
    args: {socket: 'node_1.example.com:9735'},
    description: 'DNS hostnames must have valid characters',
    expected: {},
  },
  {
    args: {socket: `${'a'.repeat(64)}.example.com:9735`},
    description: 'DNS hostname labels must not be overly long',
    expected: {},
  },
  {
    args: {socket: `${`${'a'.repeat(63)}.`.repeat(4)}com:9735`},
    description: 'DNS hostnames must not be overly long',
    expected: {},
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
