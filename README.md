# BOLT07

[![npm version](https://badge.fury.io/js/bolt07.svg)](https://badge.fury.io/js/bolt07)

Utilities for working with Lightning Network [BOLT 07](https://github.com/lightningnetwork/lightning-rfc/blob/master/07-routing-gossip.md)

## Examples

Sample code for working with bolt07 utility functions:

### Formats

- Channel: `x` delimited format designed to be readable.
- Id: The raw channel id format specified by bolt07.
- Number: Interpreting the raw channel id format as a uint64.

### Chan Format

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

### Chan Number

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

### Decode Chan Id

Returns components of a channel id or channel number.

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

### Encode Chan Id

Returns channel id when components are specified

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

### Raw Chan Id

Returns a raw channel id in numeric format.

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

