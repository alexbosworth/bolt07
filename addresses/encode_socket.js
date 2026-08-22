const decodeBase32 = require('./decode_base32');
const expandIpV6 = require('./expand_ip_v6');

const bufferAsHex = buffer => buffer.toString('hex');
const hostnameAsData = n => Buffer.from(n, 'ascii');
const ipv4Match = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;
const ipv6Match = /^[a-fA-F0-9:]+$/;
const isHostnameLabel = n => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(n);
const isNumeric = n => /^\d+$/.test(n);
const maxHostnameLength = 255;
const maxPort = 65535;
const onionSuffix = '.onion';
const portBuffer = () => Buffer.alloc(2);
const torV3Data = hostname => hostname.slice(0, 56);
const torV3Match = /[a-z2-7]{56}.onion/i;
const unbracketed = n => n.replace(/^\[(.*)\]$/, '$1');

/** Hex-encode a socket

  {
    socket: <Host:Port String>
  }

  @returns
  {
    [dns]: <DNS Hostname Socket Hex Encoded String>
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

  const hostname = unbracketed(host.reverse().join(':'));

  // Exit early when the port cannot be written to a UInt16
  if (!isNumeric(port) || Number(port) > maxPort) {
    return {};
  }

  // The port will be written to a UInt16
  const rawPort = portBuffer();

  rawPort.writeUInt16BE(Number(port));

  const encodedPort = bufferAsHex(rawPort);

  if (ipv4Match.test(hostname)) {
    const parts = Buffer.from(hostname.split('.').map(n => parseInt(n)));

    return {ip4: `${bufferAsHex(parts)}${encodedPort}`};
  }

  if (ipv6Match.test(hostname)) {
    const {groups} = expandIpV6({hostname});

    return !!groups ? {ip6: `${groups.join('')}${encodedPort}`} : {};
  }

  if (torV3Match.test(hostname)) {
    const {data} = decodeBase32({base32: torV3Data(hostname)});

    return {tor3: `${data}${encodedPort}`};
  }

  // Overly long hostnames are not encoded
  if (hostname.length > maxHostnameLength) {
    return {};
  }

  // Unsupported onion hostnames are not encoded
  if (hostname.endsWith(onionSuffix)) {
    return {};
  }

  // A remaining hostname is encoded as a type 5 DNS address
  if (hostname.split('.').every(isHostnameLabel)) {
    const data = hostnameAsData(hostname);

    const dataLength = bufferAsHex(Buffer.from([data.length]));

    return {dns: `${dataLength}${bufferAsHex(data)}${encodedPort}`};
  }

  return {};
};
