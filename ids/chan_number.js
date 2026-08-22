const {decBase} = require('./constants');
const rawChanId = require('./raw_chan_id');
const {rawChanIdByteLen} = require('./constants');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

/** Channel id in numeric format

  {
    [channel]: <Channel Components String>
    [id]: <Channel Id Hex String>
  }

  @throws
  <ExpectedChannelIdOrComponentsToConvertToNumber Error>
  <UnexpectedLengthOfShortChannelId Error>

  @returns
  {
    number: <Channel Id Number String>
  }
*/
module.exports = ({channel, id}) => {
  if (!channel && !id) {
    throw new Error('ExpectedChannelIdOrComponentsToConvertToNumber');
  }

  if (!!id && hexAsBuffer(id).length !== rawChanIdByteLen) {
    throw new Error('UnexpectedLengthOfShortChannelId');
  }

  const rawId = hexAsBuffer(id || rawChanId({channel}).id);

  return {number: rawId.readBigUInt64BE().toString(decBase)};
};
