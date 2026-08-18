import test from 'node:test';
import assert from 'node:assert/strict';
import { greet } from '../src/greet.js';

test('greet ends with an exclamation mark', () => {
  assert.equal(greet('World'), 'Hello, World!');
});
