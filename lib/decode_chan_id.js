const {blockIndexByteLen} = require('./constants');
const {blockIndexOffset} = require('./constants');
const componentsFromBuffer = require('./components_from_buffer');
const {decBase} = require('./constants');
const {endian} = require('./constants');
const {heightByteLen} = require('./constants');
const {heightByteOffset} = require('./constants');
const {outputIndexByteLen} = require('./constants');
const rawChanId = require('./raw_chan_id');

const heightBytesUsed = heightByteLen - heightByteOffset;
const indexBytesUsed = blockIndexByteLen - blockIndexOffset;

/** Decode a short channel id into components

  {
    [id]: <Channel Id Hex String>
    [number]: <Channel Id Number Format String>
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
module.exports = ({id, number}) => {
  if (!id && !number) {
    throw new Error('ExpectedShortChannelIdToDecode');
  }

  const idLen = heightBytesUsed + indexBytesUsed + outputIndexByteLen;

  if (!!id && Buffer.from(id, 'hex').length !== idLen) {
    throw new Error('UnexpectedLengthOfShortChannelId');
  }

  try {
    const channelId = !id ? rawChanId({number}).id : id;

    const channel = componentsFromBuffer({id: Buffer.from(channelId, 'hex')});

    return {
      block_height: channel.block_height,
      block_index: channel.block_index,
      output_index: channel.output_index,
    };
  } catch (err) {
    throw new Error('UnexpectedErrorDecodingChannelIdNumber');
  }
};

