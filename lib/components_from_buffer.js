const {blockIndexByteLen} = require('./constants');
const {blockIndexOffset} = require('./constants');
const {heightByteLen} = require('./constants');
const {heightByteOffset} = require('./constants');
const {outputByteOffset} = require('./constants');
const {outputIndexByteLen} = require('./constants');

const heightBytesUsed = heightByteLen - heightByteOffset;
const indexBytesUsed = blockIndexByteLen - blockIndexOffset;

/** Decode a short channel id into components

  {
    id: <BOLT 7 Encoded Short Channel Id Buffer Object>
  }

  @throws
  <ExpectedChannelIdBuffer Error>
  <UnexpectedByteCountForShortChannelId Error>

  @returns
  {
    block_height: <Channel Funding Transaction Inclusion Block Height Number>
    block_index: <Channel Funding Transaction Inclusion Block Position Number>
    output_index: <Channel Funding Transaction Output Index Number>
  }
*/
module.exports = ({id}) => {
  if (!Buffer.isBuffer(id)) {
    throw new Error('ExpectedChannelIdBuffer');
  }

  if (id.length !== heightBytesUsed + indexBytesUsed + outputIndexByteLen) {
    throw new Error('UnexpectedByteCountForShortChannelId');
  }

  const height = Buffer.alloc(heightByteLen);
  const index = Buffer.alloc(blockIndexByteLen);
  const vout = Buffer.alloc(outputIndexByteLen);

  // Skip the first byte of height, which will be zero due to BE 3byte encoding
  id.copy(height, heightByteOffset);

  // Skip the first byte of index, also zero. Write into id after the 3rd byte
  id.copy(index, blockIndexOffset, indexBytesUsed);

  // Write the vout into the final 2 bytes
  id.copy(vout, outputByteOffset, heightBytesUsed + indexBytesUsed);

  return {
    block_height: height.readUInt32BE(),
    block_index: index.readUInt32BE(),
    output_index: vout.readUInt16BE(),
  };
};

