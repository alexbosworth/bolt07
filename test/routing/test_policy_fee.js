const strictSame = require('node:assert').strict.deepStrictEqual;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const policyFee = require('./../../routing/policy_fee');

const tests = [
  {
    args: {},
    description: 'Mtokens are required',
    error: 'ExpectedMillitokensForPolicyFeeCalculation',
  },
  {
    args: {mtokens: '1000000'},
    description: 'A policy is required',
    error: 'ExpectedPolicyToCalculateFeeFor',
  },
  {
    args: {mtokens: '1000000', policy: {}},
    description: 'Base fee tokens are required',
    error: 'ExpectedBaseFeeMillitokensForPolicyFeeCalculation',
  },
  {
    args: {mtokens: '1000000', policy: {base_fee_mtokens: '1'}},
    description: 'Fee rate is required',
    error: 'ExpectedFeeRateForPolicyFeeCalculation',
  },
  {
    args: {mtokens: '1000000', policy: {base_fee_mtokens: '1', fee_rate: 1}},
    description: 'Fee rate is required',
    expected: {fee_mtokens: '2'},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => policyFee(args), new Error(error), 'Got expected error');
    } else {
      strictSame(policyFee(args).fee_mtokens, expected.fee_mtokens, 'Fee');
    }

    return end();
  });
});
