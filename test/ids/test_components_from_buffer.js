const {test} = require('@alexbosworth/tap');

const componentsFromBuffer = require('./../../ids/components_from_buffer');

const tests = [
  {
    args: {},
    description: 'A channel id is required',
    error: 'ExpectedChannelIdBuffer',
  },
  {
    args: {id: Buffer.from('00')},
    description: 'A correct length channel id is required',
    error: 'UnexpectedByteCountForShortChannelId',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, ({end, equals, throws}) => {
    if (!!error) {
      throws(() => componentsFromBuffer(args), new Error(error), 'Got error');

      return end();
    }

    return end();
  });
});
