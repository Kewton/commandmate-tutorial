import test from 'node:test';
import assert from 'node:assert/strict';
import { shout } from '../src/greet.js';

test('shout uppercases the greeting', () => {
  assert.equal(shout('World'), 'HELLO, WORLD!');
});
