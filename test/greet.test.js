import test from 'node:test';
import assert from 'node:assert/strict';
import { greet, shout } from '../src/greet.js';

test('greet ends with an exclamation mark', () => {
  assert.equal(greet('World'), 'Hello, World!');
});

test('shout uppercases the greeting', () => {
  assert.equal(shout('World'), 'HELLO, WORLD!');
});
