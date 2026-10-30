import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCheckArgs, testRunProblems, smokeRequiredFailure } from '../../tools/check-policy.mjs';
const output = ({ tests = 10, fail = 0, cancelled = 0, skipped = 0, todo = 0 } = {}) =>
  `TAP version 13\n1..${tests}\n# tests ${tests}\n# pass ${tests - fail - cancelled - skipped - todo}\n# todo ${todo}\n# fail ${fail}\n# cancelled ${cancelled}\n# skipped ${skipped}\n`;

test('strict local readiness requires completed nonzero tests, no skips/failures, and browser PASS', () => {
  const policy = parseCheckArgs(['--require-browser']);
  assert.equal(policy.requireBrowser, true);
  assert.deepEqual(testRunProblems({ status: 0, stdout: output() }, policy), []);
  for (const stdout of [output({ tests: 0 }), output({ skipped: 2 }), output({ fail: 1 }), output({ cancelled: 1 }), output({ todo: 1 }), 'runner stopped']) {
    assert.ok(testRunProblems({ status: 0, stdout }, policy).length > 0, stdout);
  }
  assert.ok(testRunProblems({ status: 1, stdout: output() }, policy).length > 0);
  assert.ok(testRunProblems({ status:0,error:new Error('runner failed'),stdout:output() },policy).length > 0);
  assert.ok(testRunProblems({status:0,stdout:output()+output({skipped:2})},policy).length > 0,'only final totals determine completion');
  assert.deepEqual(testRunProblems({status:0,stdout:output({skipped:2})+output()},policy),[]);
  assert.equal(smokeRequiredFailure('PASS', true), false);
  assert.equal(smokeRequiredFailure('SKIP', true), true);
  assert.equal(smokeRequiredFailure('FAIL', true), true);
  assert.equal(smokeRequiredFailure('SKIP', false), false);
  assert.throws(() => parseCheckArgs(['--typo']));
});
