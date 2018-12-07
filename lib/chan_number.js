const BN = require('bn.js');

const {decBase} = require('./constants');
const rawChanId = require('./raw_chan_id');

/** Channel id in numeric format

  {
    [channel]: <Channel Components String>
    [id]: <Channel Id Hex String>
  }

  @returns
  {
    number: <Channel Id Number String>
  }
*/
module.exports = ({channel, id}) => {
  if (!channel && !id) {
    throw new Error('ExpectedChannelIdOrComponentsToConvertToNumber');
  }

  const rawId = id || rawChanId({channel}).id;

  return {number: new BN(Buffer.from(rawId, 'hex')).toString(decBase)};
};

