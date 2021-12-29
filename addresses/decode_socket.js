const encodeBase32 = require('./encode_base32');

const hexAsIpV4 = hex => [...Buffer.from(hex.slice(0, 8), 'hex')].join('.');
const hexAsIpV6 = data => data.slice(0, 32).match(/.{1,4}/g).join(':');
const hexAsTorV3 = data => encodeBase32({data: data.slice(0, 70)}).base32;
const ip4HexLength = 12;
const ip6HexLength = 36;
const portFromData = data => Buffer.from(data.slice(-4), 'hex').readUInt16BE();
const portHexLength = 4;
const tor3HexLength = 74;

/** Decode an encoded socket

  {
    [ip4]: <Hex Encoded IpV4 Socket String>
    [ip6]: <Hex Encoded IpV6 Socket String>
    [tor3]: <Hex Encoded TorV3 Socket String>
  }

  @returns
  {
    [socket]: <Connection Socket String>
  }
*/
module.exports = ({ip4, ip6, tor3}) => {
  const data = ip4 || ip6 || tor3;

  if (!data) {
    throw new Error('ExectedSocketDataToDecodeSocket');
  }

  const [, other] = [ip4, ip6, tor3].filter(n => !!n);

  if (!!other) {
    throw new Error('ExpectedOnlyOneSocketTypeToDecode');
  }

  if (data.length < portHexLength) {
    throw new Error('ExpectedSocketDataWithPortToDecodeSocket');
  }

  // Read the port number as a UInt16 off of the end
  const port = portFromData(data);

  if (!!ip4 && ip4.length !== ip4HexLength) {
    throw new Error('UnexpectedLengthForIpV4SocketData');
  }

  if (!!ip6 && ip6.length !== ip6HexLength) {
    throw new Error('UnexpectedLengthForIpV6SocketData');
  }

  if (!!tor3 && tor3.length !== tor3HexLength) {
    throw new Error('UnexpectedLengthForTorV3SocketData');
  }

  if (!!ip4) {
    return {socket: `${hexAsIpV4(ip4)}:${port}`};
  } else if (!!ip6) {
    return {socket: `${hexAsIpV6(ip6)}:${port}`};
  } else {
    return {socket: `${hexAsTorV3(data)}.onion:${port}`};
  }
};
