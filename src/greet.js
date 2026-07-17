/**
 * Build the greeting shown on the home page.
 *
 * The test in test/greet.test.js expects an exclamation mark at the end.
 * Right now it does not have one, so `npm test` fails.
 */
export function greet(name) {
  return `Hello, ${name}`;
}

/**
 * Shout a greeting: the same text, uppercased.
 *
 * TODO: not implemented yet. test/greet.test.js expects
 * shout('World') === 'HELLO, WORLD!'
 */
export function shout(name) {
  throw new Error('shout() is not implemented yet');
}
