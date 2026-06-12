import { ESLint } from 'eslint';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');

const never = /** @type {never} */ (undefined);

const eslint = new ESLint({
	cwd: repoRoot,
	ignore: false,
});

/** @type {Record<string, string>} */
const expectedFailures = {
	'incorrect-preamble': 'Incorrect preamble',
	'invalid-section-name': 'Invalid title name "Bogus"',
	'indented-section': "Sections can't be indented",
	'invalid-entry-format': 'Changelog entries have to start with "- " with optional tab indentation',
	'invalid-version-format': 'Invalid version format',
	'multi-line-title': 'Title needs to have 1 line and no trailing newline.',
	'missing-trailing-empty-line': 'Missing trailing empty line.',
	'irregular-whitespace': 'Irregular whitespace',
	'invalid-date': 'Invalid date',
	'multi-version-bad-section': 'Invalid title name "Bogus"',
	'entry-with-plus': 'Changelog entries have to start with "- " with optional tab indentation',
};

/**
 * @param {import('eslint').ESLint.LintResult} result
 */
const formatMessages = (result) => result.messages.map((m) => `  ${m.message}`).join('\n');

/**
 * @param {string} subdir
 * @returns {string[]}
 */
const listFixtures = (subdir) =>
	readdirSync(path.join(fixturesDir, subdir), { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();

const passFixtures = listFixtures('pass');
const failFixtures = listFixtures('fail');

describe('eslint fixtures', function () {
	describe('pass', function () {
		for (const name of passFixtures) {
			it(`pass/${name}`, async function () {
				const file = path.join(fixturesDir, 'pass', name, 'CHANGELOG.md');
				const [result = never] = await eslint.lintFiles([file]);
				assert.equal(result.errorCount + result.warningCount, 0, `Expected no lint findings, got:\n${formatMessages(result)}`);
			});
		}
	});

	describe('fail', function () {
		for (const name of failFixtures) {
			const expected = expectedFailures[name];
			it(`fail/${name} reports "${expected}"`, async function () {
				assert.ok(expected, `No expected message defined for fixture "${name}"`);
				const file = path.join(fixturesDir, 'fail', name, 'CHANGELOG.md');
				const [result = never] = await eslint.lintFiles([file]);
				const matched = result.messages.filter((m) => m.message === expected);
				assert.ok(matched.length > 0, `Expected message "${expected}" to fire. All findings:\n${formatMessages(result)}`);
			});
		}
	});
});
