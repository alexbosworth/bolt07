const BN = require('bn.js');

const {decBase} = require('./constants');
const {endian} = require('./constants');
const {rawChanIdLen} = require('./constants');

/** Raw channel id

  {
    number: <Channel Id In Number Format String>
  }

  @throws
  <Error>

  @returns
  {
    id: <Raw Channel Id Hex String>
  }
*/
module.exports = ({number}) => {
  if (!number) {
    throw new Error('ExpectedChannelIdInNumericFormat');
  }

  const id = new BN(number, decBase);

  return {id: id.toArrayLike(Buffer, endian, rawChanIdLen).toString('hex')};
};

