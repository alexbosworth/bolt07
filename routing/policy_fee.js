const none = '0';
const rateDivisor = BigInt(1e6);

/** Fee for policy

  {
    mtokens: <Millitokens String>
    policy: {
      base_fee_mtokens: <Base Fee Millitokens String>
      fee_rate: <Fee Rate Number>
      [inbound_base_discount_mtokens]: <Source Base Fee Reduction String>
      [inbound_rate_discount]: <Source Per Million Rate Reduction Number>
    }
  }

  @throws
  <Error>

  @returns
  {
    fee_mtokens: <Fee Millitokens String>
  }
*/
module.exports = ({mtokens, policy}) => {
  if (mtokens === undefined) {
    throw new Error('ExpectedMillitokensForPolicyFeeCalculation');
  }

  if (!policy) {
    throw new Error('ExpectedPolicyToCalculateFeeFor');
  }

  if (!policy.base_fee_mtokens) {
    throw new Error('ExpectedBaseFeeMillitokensForPolicyFeeCalculation');
  }

  if (policy.fee_rate === undefined) {
    throw new Error('ExpectedFeeRateForPolicyFeeCalculation');
  }

  const baseFeeMtokens = BigInt(policy.base_fee_mtokens);
  const feeRate = BigInt(policy.fee_rate);
  const forwardMtokens = BigInt(mtokens);
  const lowerBaseFee = BigInt(policy.inbound_base_discount_mtokens || none);
  const lowerFeeRate = BigInt(policy.inbound_rate_discount || none);

  const fee = baseFeeMtokens + forwardMtokens * feeRate / rateDivisor;

  const total = fee + forwardMtokens;

  const discount = lowerBaseFee + total * lowerFeeRate / rateDivisor;

  // Exit early when the discount drowns out the fee
  if (discount > fee) {
    return {fee_mtokens: none};
  }

  return {fee_mtokens: (fee - discount).toString()};
};
