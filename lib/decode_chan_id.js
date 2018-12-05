const BN = require('bn.js');

const {blockIndexByteLen} = require('./constants');
const {blockIndexOffset} = require('./constants');
const {decBase} = require('./constants');
const decodeFromBuffer = require('./decode_from_buffer');
const {endian} = require('./constants');
const {heightByteLen} = require('./constants');
const {heightByteOffset} = require('./constants');
const {outputIndexByteLen} = require('./constants');

const heightBytesUsed = heightByteLen - heightByteOffset;
const indexBytesUsed = blockIndexByteLen - blockIndexOffset;

/** Decode a short channel id into components

  {
    number: <Channel Id Number Format String>
  }

  @throws
  <Error>

  @returns
  {
    block_height: <Channel Funding Transaction Inclusion Block Height Number>
    block_index: <Channel Funding Transaction Inclusion Block Position Number>
    output_index: <Channel Funding Transaction Output Index Number>
  }
*/
module.exports = ({number}) => {
  if (!number) {
    throw new Error('ExpectedShortChannelIdToDecode');
  }

  const idLen = heightBytesUsed + indexBytesUsed + outputIndexByteLen;

  try {
    const rawId = new BN(number, decBase).toArrayLike(Buffer, endian, idLen);

    const channel = decodeFromBuffer({id: rawId});

    return {
      block_height: channel.block_height,
      block_index: channel.block_index,
      output_index: channel.output_index,
    };
  } catch (err) {
    throw new Error('UnexpectedErrorDecodingChannelIdNumber');
  }
};

