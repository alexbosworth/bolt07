const {chanDelimiter} = require('./constants');
const {decBase} = require('./constants');
const encodeChanId = require('./encode_chan_id');
const {rawChanIdByteLen} = require('./constants');

const bufferAsHex = buffer => buffer.toString('hex');
const isNumeric = n => /^\d+$/.test(n);
const maxNumericValue = BigInt(2 ** (8 * rawChanIdByteLen)) - BigInt(1);

/** Raw channel id

  {
    [channel]: <Channel Components String>
    [number]: <Channel Id In Number Format String>
  }

  @throws
  <ExpectedChannelIdInNumericFormat Error>
  <ExpectedNumericValueForChannelId Error>
  <ExpectedNumberWithinRangeForChannelId Error>

  @returns
  {
    id: <Raw Channel Id Hex String>
  }
*/
module.exports = ({channel, number}) => {
  if (!channel && !number) {
    throw new Error('ExpectedChannelIdInNumericFormat');
  }

  if (!!number && !isNumeric(number)) {
    throw new Error('ExpectedNumericValueForChannelId');
  }

  if (!!number && BigInt(number) > maxNumericValue) {
    throw new Error('ExpectedNumberWithinRangeForChannelId');
  }

  if (!!number) {
    const rawId = Buffer.alloc(rawChanIdByteLen);

    rawId.writeBigUInt64BE(BigInt(number));

    return {id: bufferAsHex(rawId)};
  } else {
    const [height, blockIndex, outputindex] = channel.split(chanDelimiter);

    const {id} = encodeChanId({
      block_height: parseInt(height, decBase),
      block_index: parseInt(blockIndex, decBase),
      output_index: parseInt(outputindex, decBase),
    });

    return {id};
  }
};
