# Versions

## 2.0.0

- `decodeSocket`: Add support for decoding type 5 DNS hostname sockets
- `encodeSocket`: Add support for encoding type 5 DNS hostname sockets
- `encodeSocket`: Fix encoding of zero compressed and bracketed ip v6 sockets

### Breaking Changes

- Node 22 or higher is now required

## 1.9.5

- `hopsFromChannels`, `routeFromChannels`, `routeFromHops`: Add support for
    inbound discounts

## 1.8.4

- `decodeSocket`: Decode a connection socket from hex data
- `encodeSocket`: Encode a connection socket to hex data

## 1.7.4

- `hopsFromChannels`: Derive policy hops from a list of channels

## 1.6.0

- `routeFromChannels`: Add support for `messages` in routes
- `routeFromHops`: Add method to calculate a route from a set of hops

## 1.5.2

- Add `routeFromChannels` method to calculate a route from channels
