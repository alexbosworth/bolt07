const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');

const expandIpV6 = require('./../../addresses/expand_ip_v6');

const tests = [
  {
    args: {hostname: '2001:0db8:0000:0000:0000:0000:0000:0001'},
    description: 'Expand a fully padded address',
    expected: {
      groups: ['2001', '0db8', '0000', '0000', '0000', '0000', '0000', '0001'],
    },
  },
  {
    args: {hostname: '2001:DB8::1'},
    description: 'Expand a zero compressed address with uppercase groups',
    expected: {
      groups: ['2001', '0db8', '0000', '0000', '0000', '0000', '0000', '0001'],
    },
  },
  {
    args: {hostname: '2001:db8::8a2e:370:7334'},
    description: 'Expand an address with zero compression in the middle',
    expected: {
      groups: ['2001', '0db8', '0000', '0000', '0000', '8a2e', '0370', '7334'],
    },
  },
  {
    args: {hostname: '2001:db8::'},
    description: 'Expand an address with trailing zero compression',
    expected: {
      groups: ['2001', '0db8', '0000', '0000', '0000', '0000', '0000', '0000'],
    },
  },
  {
    args: {hostname: '::1'},
    description: 'Expand an address with leading zero compression',
    expected: {
      groups: ['0000', '0000', '0000', '0000', '0000', '0000', '0000', '0001'],
    },
  },
  {
    args: {hostname: '::'},
    description: 'Expand the all zeros address',
    expected: {
      groups: ['0000', '0000', '0000', '0000', '0000', '0000', '0000', '0000'],
    },
  },
  {
    args: {hostname: '0:1:2:3:4:5:6'},
    description: 'An uncompressed address must have eight groups',
    expected: {},
  },
  {
    args: {hostname: '0:1:2:3:4:5:6:77777'},
    description: 'An uncompressed address must have short groups',
    expected: {},
  },
  {
    args: {hostname: '0:1:2:3:4:5:6:7:8::9'},
    description: 'A compressed address must stand in for a zeros group',
    expected: {},
  },
  {
    args: {hostname: '77777::1'},
    description: 'A compressed address must have short groups',
    expected: {},
  },
  {
    args: {hostname: '2001::db8::1'},
    description: 'An address must have a single zero compression',
    expected: {},
  },
];

tests.forEach(({args, description, expected}) => {
  return test(description, (t, end) => {
    const res = expandIpV6(args);

    strictSame(res, expected, 'Got expected result');

    return end();
  });
});
