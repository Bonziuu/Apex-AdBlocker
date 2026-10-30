// Completion policy shared by the local/CI check command and its regression tests.
export function parseCheckArgs(args) {
  for (const arg of args) if (arg !== '--require-browser') throw new Error(`Nieznany argument: ${arg}`);
  return { requireBrowser: args.includes('--require-browser') };
}

export function testRunProblems(result, { requireBrowser = false } = {}) {
  const problems = [];
  if (result.error || result.signal || result.status !== 0) problems.push('test runner failed');
  if (requireBrowser) {
    const totals = {};
    for (const key of ['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo']) {
      const match = [...String(result.stdout || '').matchAll(new RegExp(`^# ${key} (\\d+)\\s*$`, 'gm'))].at(-1);
      totals[key] = match ? Number(match[1]) : null;
    }
    if (!totals.tests || ['pass', 'fail', 'cancelled', 'skipped', 'todo'].some((key) => totals[key] === null)) problems.push('missing test completion summary');
    if (totals.todo > 0) problems.push(`${totals.todo} tests left as TODO`);
    if (totals.tests && totals.pass !== totals.tests) problems.push('not all tests passed');
    if (totals.skipped > 0) problems.push(`${totals.skipped} tests skipped`);
    if (totals.fail > 0 || totals.cancelled > 0) problems.push('tests failed or cancelled');
  }
  return problems;
}

export function smokeRequiredFailure(status, requireBrowser) {
  return status === 'FAIL' || (requireBrowser && status !== 'PASS');
}
