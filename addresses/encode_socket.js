const decodeBase32 = require('./decode_base32');

const bufferAsHex = buffer => buffer.toString('hex');
const ipv4Match = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;
const ipv6Match = /^[a-fA-F0-9:]+$/;
const portBuffer = () => Buffer.alloc(2);
const torV3Data = hostname => hostname.slice(0, 56);
const torV3Match = /[a-z2-7]{56}.onion/i;

/** Hex-encode a socket

  {
    socket: <Host:Port String>
  }

  @returns
  {
    [ip4]: <IPv4 Socket Hex Encoded String>
    [ip6]: <IPv6 Socket Hex Encoded String>
    [tor3]: <Tor V3 Socket Hex Encoded String>
  }
*/
module.exports = args => {
  if (!args) {
    throw new Error('ExpectedArgumentsToEncodeSocket');
  }

  if (!args.socket) {
    throw new Error('ExpectedSocketToEncode');
  }

  const [port, ...host] = args.socket.split(':').reverse();

  const hostname = host.reverse().join(':');

  // The port will be written to a UInt16
  const rawPort = portBuffer();

  rawPort.writeUInt16BE(Number(port));

  const encodedPort = bufferAsHex(rawPort);

  if (ipv4Match.test(hostname)) {
    const parts = Buffer.from(hostname.split('.').map(n => parseInt(n)));

    return {ip4: `${parts.toString('hex')}${encodedPort}`};
  }

  if (ipv6Match.test(hostname)) {
    return {ip6: `${hostname.split(':').join('')}${encodedPort}`};
  }

  if (torV3Match.test(hostname)) {
    const {data} = decodeBase32({base32: torV3Data(hostname)});

    return {tor3: `${data}${encodedPort}`};
  }

  return {};
};
