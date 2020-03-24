const decodeChanId = require('./decode_chan_id');
const encodeChanId = require('./encode_chan_id');

/** Get channel components formatted string

  {
    [id]: <Raw Channel Id String>
    [number]: <Number Format Channel Id String>
  }

  @throws
  <Error>

  @returns
  {
    channel: <Components Channel Format String>
  }
*/
module.exports = ({id, number}) => {
  if (!id && !number) {
    throw new Error('ExpectedIdOrNumberToFormatAsChannelComponents');
  }

  const decoded = decodeChanId({id, number});

  const {channel} = encodeChanId({
    block_height: decoded.block_height,
    block_index: decoded.block_index,
    output_index: decoded.output_index,
  });

  return {channel};
};

