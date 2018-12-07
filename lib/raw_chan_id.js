const BN = require('bn.js');

const {chanDelimiter} = require('./constants');
const {decBase} = require('./constants');
const {endian} = require('./constants');
const encodeChanId = require('./encode_chan_id');
const {rawChanIdByteLen} = require('./constants');

/** Raw channel id

  {
    [channel]: <Channel Components String>
    [number]: <Channel Id In Number Format String>
  }

  @throws
  <Error>

  @returns
  {
    id: <Raw Channel Id Hex String>
  }
*/
module.exports = ({channel, number}) => {
  if (!channel && !number) {
    throw new Error('ExpectedChannelIdInNumericFormat');
  }

  if (!!number) {
    const rawId = new BN(number, decBase);

    return {
      id: rawId.toArrayLike(Buffer, endian, rawChanIdByteLen).toString('hex'),
    };
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

