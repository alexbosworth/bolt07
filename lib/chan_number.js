const BN = require('bn.js');

const decBase = 10;

/** Channel id in numeric format

  {
    id: <Channel Id Hex String>
  }

  @returns
  {
    number: <Channel Id Number String>
  }
*/
module.exports = ({id}) => {
  if (!id) {
    throw new Error('ExpectedChannelIdToConvertToNumber');
  }

  return {number: new BN(Buffer.from(id, 'hex')).toString(decBase)};
};

