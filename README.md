# BOLT07

[![npm version](https://badge.fury.io/js/bolt07.svg)](https://badge.fury.io/js/bolt07)

Utilities for working with Lightning Network [BOLT 07](https://github.com/lightningnetwork/lightning-rfc/blob/master/07-routing-gossip.md)

## Examples

### Formats

- Id: The raw channel id format specified by bolt07
- Number: Interpreting the raw channel id format as a uint64

### Chan Number

Returns a raw channel id in numeric format.

    const {rawChanId} = require('bolt07');
    
    const id = '15fbe70000260000';
    
    try {
      const {number} = rawChanId({id});
      // number === '1584113681139367936'
    } catch (err) {
      // valid id, no error
    }

### Decode Chan Id

Returns components of a channel id or channel number.

    const {decodeChanId} = require('bolt07');
    
    const id = '15fbe70000260000';
    
    try {
      const components = decodeChanId({id});
      // components.block_height === 1440743
      // components.block_index === 38
      // components.output_index === 0
    } catch (err) {
      // valid id, no error
    }

### Raw Chan Id

Return a raw channel id from a numeric format id

    const {rawChanId} = require('bolt07');
    
    const number = '1584113681139367936';
    
    try {
      const {id} = rawChanId({number});
      // id === '15fbe70000260000'
    } catch (err) {
      // valid number, no error
    }

