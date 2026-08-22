const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');

const decodeBase32 = require('./../../addresses/decode_base32');

const tests = [
  {
    args: {base32: ''},
    description: 'Decode nil base32 data',
    expected: {data: ''},
  },
  {
    args: {base32: 'om'},
    description: 'Decode short base32 data',
    expected: {data: '73'},
  },
  {
    args: {base32: 'OM'},
    description: 'Decode uppercase base32 data',
    expected: {data: '73'},
  },
  {
    args: {
      base32: '6l6cggn5ffcxztib5dqzj3u327uxfgfwmeg7jkyphvn2ucznpthwtau63n2o33y',
    },
    description: 'Decode long base32 data',
    expected: {
      data: 'f2fc2319bd29457ccd01e8e194ee9bd7e97298b6610df4ab0f3d5baa0b2d7ccf69829edb74edef',
    },
  },
];

tests.forEach(({args, description, expected}) => {
  return test(description, (t, end) => {
    const res = decodeBase32(args);

    strictSame(res, expected, 'Got expected result');

    return end();
  });
});
