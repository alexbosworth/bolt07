const bufferAsHex = buffer => buffer.toString('hex');
const byte = 8;
const max = 255;
const read = n => 'abcdefghijklmnopqrstuvwxyz234567'.indexOf(n);
const size = len => (len * 5 / 8) | 0;
const word = 5;

/** Decode base32 encoded value

  {
    base32: <Base32 String>
  }

  @returns
  {
    data: <Hex Encoded Value String>
  }
*/
module.exports = ({base32}) => {
  const b32 = base32.toLowerCase();
  let bits = 0;
  let index = 0;
  const len = base32.length;
  let value = 0;

  const output = Buffer.alloc(size(len));

  for (let i = 0; i < len; i++) {
    value = (value << word) | read(b32[i]);

    bits += word;

    if (bits < byte) {
      continue;
    }

    output[index++] = (value >>> (bits - byte)) & max;

    bits -= byte;
  }

  return {data: bufferAsHex(output)};
};
