import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ESLint } from 'eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');

const never = /** @type {never} */ (undefined);

const eslint = new ESLint({
	cwd: repoRoot,
	ignore: false,
});

/**
 * @param {string} dir
 * @returns {string[]}
 */
const listFixtures = (dir) =>
	readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => path.join(dir, entry.name))
		.sort();

/**
 * @param {string} ruleId
 * @param {string} expected
 */
const ruleMatches = (ruleId, expected) => ruleId === expected || ruleId.endsWith('/' + expected);

/**
 * @param {import('eslint').ESLint.LintResult} result
 */
const formatMessages = (result) => result.messages.map((m) => `  ${m.ruleId ?? '<fatal>'}: ${m.message}`).join('\n');

const passFixtures = listFixtures(path.join(fixturesDir, 'pass'));
const failFixtures = listFixtures(path.join(fixturesDir, 'fail'));

describe('eslint fixtures', function () {
	describe('pass', function () {
		for (const file of passFixtures) {
			it(path.relative(fixturesDir, file), async function () {
				const [result = never] = await eslint.lintFiles([file]);
				assert.equal(result.errorCount + result.warningCount, 0, `Expected no lint findings, got:\n${formatMessages(result)}`);
			});
		}
	});

	describe('fail', function () {
		for (const file of failFixtures) {
			const expectedRule = path.basename(file, path.extname(file));
			it(`${path.relative(fixturesDir, file)} triggers ${expectedRule}`, async function () {
				const [result = never] = await eslint.lintFiles([file]);
				const matched = result.messages.filter((m) => m.ruleId && ruleMatches(m.ruleId, expectedRule));
				assert.ok(matched.length > 0, `Expected rule "${expectedRule}" to fire. All findings:\n${formatMessages(result)}`);
			});
		}
	});
});
