const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
const byte = 8;
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const lastIndex = 31;
const word = 5;

/** Encode data as base32

  {
    data: <Data To Encode as Base32 Format Hex String>
  }

  @returns
  {
    base32: <Base32 Encoded String>
  }
*/
module.exports = ({data}) => {
  let bits = 0;
  const encoded = hexAsBuffer(data);
  let base32 = '';
  let value = 0;

  for (let i = 0; i < encoded.length; i++) {
    bits += byte;
    value = (value << byte) | encoded[i];

    while (bits >= word) {
      base32 += alphabet[(value >>> (bits - word)) & lastIndex];

      bits -= word;
    }
  }

  if (bits > 0) {
    base32 += alphabet[(value << (word - bits)) & lastIndex];
  }

  return {base32};
};
