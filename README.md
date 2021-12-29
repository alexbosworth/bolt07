# BOLT07

Utilities for working with Lightning Network [BOLT 07](https://github.com/lightningnetwork/lightning-rfc/blob/master/07-routing-gossip.md)

[![npm version](https://badge.fury.io/js/bolt07.svg)](https://badge.fury.io/js/bolt07)

## Methods

- [chanFormat](#chanformat) - convert number or raw bytes format channel id to standard format
- [chanNumber](#channumber) - convert standard, raw bytes format channel id to number format
- [decodeChanId](#decodechanid) - decode block height and index components of a channel id
- [encodeChanId](#encodechanid) - encode block height and index components into a channel id
- [hopsFromChannels](#hopsfromchannels) - derive policy hops from a list of channels
- [rawChanId](#rawchanid) - convert numeric or standard channel id into a raw wire form
- [routeFromChannels](#routefromchannels) - derive a route from a sequence of channels
- [routeFromHops](#routefromhops) - derive a route from a sequence of policy hops

## Examples

Sample code for working with bolt07 utility functions:

### Formats

- Channel: `x` delimited format designed to be readable.
- Id: The raw channel id format specified by bolt07.
- Number: Interpreting the raw channel id format as a uint64.

### Chan Format

```node
const {chanFormat} = require('bolt07');

const id = '15fbe70000260000';
const number = '1584113681139367936';

try {
  const fromNumber = chanFormat({number}).channel;
  // fromNumber === '1440743x38x0'
} catch (err) {
  // valid channel, no error
}

try {
  const fromId = chanFormat({id}).channel;
  // fromId === '1440743x38x0'
} catch (err) {
  // valid id, no error
}
```

### Chan Number

```node
const {chanNumber} = require('bolt07');

const channel = '1440743x38x0';
const id = '15fbe70000260000';

try {
  const fromChannel = chanNumber({channel}).number;
  // fromChannel === '1584113681139367936'
} catch (err) {
  // valid channel, no error
}

try {
  const fromId = chanNumber({id}).number;
  // fromId === '1584113681139367936'
} catch (err) {
  // valid id, no error
}
```

### decodeChanId

Returns components of a channel id or channel number.

```node
const {decodeChanId} = require('bolt07');

const channel = '1440743x38x0';
const id = '15fbe70000260000';
const number = '1584113681139367936';

try {
  const fromChannel = decodeChanId({channel});
  // fromChannel.block_height === 1440743
  // fromChannel.block_index === 38
  // fromChannel.output_index === 0
} catch (err) {
  // valid channel, no error
}

try {
  const fromId = decodeChanId({id});
  // fromId.block_height === 1440743
  // fromId.block_index === 38
  // fromId.output_index === 0
} catch (err) {
  // valid id, no error
}

try {
  const fromNumber = decodeChanId({channel});
  // fromNumber.block_height === 1440743
  // fromNumber.block_index === 38
  // fromNumber.output_index === 0
} catch (err) {
  // valid number, no error
}
```

### encodeChanId

Returns channel id when components are specified

```node
const {encodeChanId} = require('bolt07');

try {
  const encoded = encodeChanId({
    block_height: 1440743,
    block_index: 38,
    output_index: 0,
  });

  // encoded.channel === '1440743x38x0'
  // encoded.id === '15fbe70000260000'
  // encoded.number === '1584113681139367936'
} catch (err) {
  // valid components, no error
}
```

### Raw Chan Id

Returns a raw channel id in numeric format.

```node
const {rawChanId} = require('bolt07');

const channel = '1440743x38x0';
const number = '1584113681139367936';

try {
  const idFromNumber = rawChanId({number}).id;
  // idFromNumber === '15fbe70000260000'
} catch (err) {
  // valid number, no error
}

try {
  const idFromChannel = rawChanId({channel}).id;
  // idFromChannel === '15fbe70000260000'
} catch (err) {
  // valid channel, no error
}
```

## Methods

### chanFormat

Get channel components formatted string

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

### chanNumber

Channel id in numeric format

    {
      [channel]: <Channel Components String>
      [id]: <Channel Id Hex String>
    }

    @throws
    <ExpectedChannelIdOrComponentsToConvertToNumber Error>

    @returns
    {
      number: <Channel Id Number String>
    }

### decodeChanId

Decode a short channel id into components

    {
      [channel]: <Channel Components String>
      [id]: <Channel Id Hex String>
      [number]: <Channel Id Number Format String>
    }

    @throws
    <ExpectedShortChannelIdToDecode Error>
    <UnexpectedErrorDecodingChannelIdNumber Error>
    <UnexpectedLengthOfShortChannelId Error>

    @returns
    {
      block_height: <Channel Funding Transaction Inclusion Block Height Number>
      block_index: <Channel Funding Transaction Inclusion Block Position Number>
      output_index: <Channel Funding Transaction Output Index Number>
    }

### encodeChanId

Encode a short channel id from components

    {
      block_height: <Channel Funding Transaction Inclusion Block Height Number>
      block_index: <Channel Funding Transaction Inclusion Block Position Number>
      output_index: <Channel Funding Transaction Output Index Number>
    }

    @throws
    <ExpectedBlockHeightForChannelId Error>
    <ExpectedBlockIndexForChannelId Error>
    <ExpectedTransactionOutputIndexForChannelId Error>

    @returns
    {
      channel: <Channel Components Format String>
      id: <Channel Id Hex String>
      number: <Channel Number String>
    }

### rawChanId

Raw channel id

    {
      [channel]: <Channel Components String>
      [number]: <Channel Id In Number Format String>
    }

    @throws
    <Error>

    @returns
    {
      id: <Raw Channel Id Hex String>
    }

### routeFromChannels

Get a route from a sequence of channels

Either next hop destination in channels or final destination is required

    {
      channels: [{
        capacity: <Maximum Tokens Number>
        [destination]: <Next Node Public Key Hex String>
        id: <Standard Format Channel Id String>
        policies: [{
          base_fee_mtokens: <Base Fee Millitokens String>
          cltv_delta: <Locktime Delta Number>
          fee_rate: <Fees Charged in Millitokens Per Million Number>
          is_disabled: <Channel Is Disabled Bool>
          max_htlc_mtokens: <Maximum HTLC Millitokens Value String>
          min_htlc_mtokens: <Minimum HTLC Millitokens Value String>
          public_key: <Node Public Key String>
        }]
      }]
      [cltv_delta]: <Final CLTV Delta Number>
      [destination]: <Destination Public Key Hex String>
      height: <Current Block Height Number>
      [messages]: [{
        type: <Message Type Number String>
        value: <Message Raw Value Hex Encoded String>
      }]
      mtokens: <Millitokens To Send String>
      [payment]: <Payment Identification Value Hex String>
      [total_mtokens]: <Sum of Shards Millitokens String>
    }

    @throws
    <Error>

    @returns
    {
      route: {
        fee: <Total Fee Tokens To Pay Number>
        fee_mtokens: <Total Fee Millitokens To Pay String>
        hops: [{
          channel: <Standard Format Channel Id String>
          channel_capacity: <Channel Capacity Tokens Number>
          fee: <Fee Number>
          fee_mtokens: <Fee Millitokens String>
          forward: <Forward Tokens Number>
          forward_mtokens: <Forward Millitokens String>
          [public_key]: <Public Key Hex String>
          timeout: <Timeout Block Height Number>
        }]
        [messages]: [{
          type: <Message Type Number String>
          value: <Message Raw Value Hex Encoded String>
        }]
        mtokens: <Total Fee-Inclusive Millitokens String>
        [payment]: <Payment Identification Value Hex String>
        timeout: <Timeout Block Height Number>
        tokens: <Total Fee-Inclusive Tokens Number>
        [total_mtokens]: <Sum of Shards Millitokens String>
      }
    }

### routeFromHops

Given hops to a destination, construct a payable route

    {
      [cltv_delta]: <Final Cltv Delta Number>
      height: <Current Block Height Number>
      hops: [{
        base_fee_mtokens: <Base Fee Millitokens String>
        channel: <Standard Format Channel Id String>
        [channel_capacity]: <Channel Capacity Tokens Number>
        cltv_delta: <CLTV Delta Number>
        fee_rate: <Fee Rate In Millitokens Per Million Number>
        public_key: <Next Hop Public Key Hex String>
      }]
      initial_cltv: <Initial CLTV Delta Number>
      [messages]: [{
        type: <Message Type Number String>
        value: <Message Raw Value Hex Encoded String>
      }]
      mtokens: <Millitokens To Send String>
      [payment]: <Payment Identification Value Hex String>
      [total_mtokens]: <Total Millitokens For Sharded Payments String>
    }

    @throws
    <Error>

    @returns
    {
      fee: <Route Fee Tokens Number>
      fee_mtokens: <Route Fee Millitokens String>
      hops: [{
        channel: <Standard Format Channel Id String>
        channel_capacity: <Channel Capacity Tokens Number>
        fee: <Fee Number>
        fee_mtokens: <Fee Millitokens String>
        forward: <Forward Tokens Number>
        forward_mtokens: <Forward Millitokens String>
        [public_key]: <Public Key Hex String>
        timeout: <Timeout Block Height Number>
      }]
      [messages]: [{
        type: <Message Type Number String>
        value: <Message Raw Value Hex Encoded String>
      }]
      mtokens: <Total Fee-Inclusive Millitokens String>
      [payment]: <Payment Identification Value Hex String>
      timeout: <Timeout Block Height Number>
      tokens: <Total Fee-Inclusive Tokens Number>
      [total_mtokens]: <Sharded Payments Total Millitokens String>
    }
