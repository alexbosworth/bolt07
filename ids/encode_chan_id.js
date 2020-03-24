const BN = require('bn.js');

const {blockIndexByteLen} = require('./constants');
const {blockIndexOffset} = require('./constants');
const {chanDelimiter} = require('./constants');
const {decBase} = require('./constants');
const {heightByteIndex} = require('./constants');
const {heightByteLen} = require('./constants');
const {heightByteOffset} = require('./constants');
const {outputIndexByteLen} = require('./constants');
const {rawChanIdByteLen} = require('./constants');

/** Encode a short channel id from components

  {
    block_height: <Channel Funding Transaction Inclusion Block Height Number>
    block_index: <Channel Funding Transaction Inclusion Block Position Number>
    output_index: <Channel Funding Transaction Output Index Number>
  }

  @throws
  <ExpectedBlockHeightForChannelId Error>
  <ExpectedBlockIndexForChannelId Error>
  <ExpectedTransactionOutputIndexForChannelId Error>

  @returns
  {
    channel: <Channel Components Format String>
    id: <Channel Id Hex String>
    number: <Channel Number String>
  }
*/
module.exports = args => {
  if (args.block_height === undefined) {
    throw new Error('ExpectedBlockHeightForChannelId');
  }

  if (args.block_index === undefined) {
    throw new Error('ExpectedBlockIndexForChannelId');
  }

  if (args.output_index === undefined) {
    throw new Error('ExpectedTransactionOutputIndexForChannelId');
  }

  const channel = [
    args.block_height,
    args.block_index,
    args.output_index,
  ].join(chanDelimiter);

  const id = Buffer.alloc(rawChanIdByteLen);

  const height = Buffer.alloc(heightByteLen);

  height.writeUInt32BE(args.block_height);

  // Skip the 1st byte of the BE height number so that only 3 bytes are used
  height.copy(id, heightByteIndex, heightByteOffset);

  const index = Buffer.alloc(blockIndexByteLen);

  index.writeUInt32BE(args.block_index);

  // Skip the 1st byte of the BE index number, pull from after the height bytes
  index.copy(id, blockIndexByteLen - blockIndexOffset, blockIndexOffset);

  // Bring in the final 2 bytes which are the output index
  id.writeUInt16BE(args.output_index, rawChanIdByteLen - outputIndexByteLen);

  return {
    channel,
    id: id.toString('hex'),
    number: new BN(id).toString(decBase),
  };
};
