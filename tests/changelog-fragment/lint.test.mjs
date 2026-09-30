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
	'invalid-section-name': 'Invalid title name "Bogus"',
	'invalid-entry-format': 'Changelog entries have to start with "- " with optional tab indentation',
	'missing-trailing-empty-line': 'Missing trailing empty line.',
	'empty-section': 'Section "Added" has no entries.',
	'indented-section': "Sections can't be indented",
	'irregular-whitespace': 'Irregular whitespace',
	'missing-entry-prefix': 'Changelog entries have to start with one of the allowed prefixes: (public), (internal)',
	'version-heading': 'Parsing error: Version "[1.0.0] - 2026-05-05" is not allowed in a section fragment.',
	'entry-outside-section': 'Parsing error: Entry "- (public) Entry with no section" is not part of any section.',
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

describe('sos/changelog-fragment', function () {
	describe('eslint fixtures', function () {
		describe('pass', function () {
			for (const name of passFixtures) {
				it(`pass/${name}`, async function () {
					const file = path.join(fixturesDir, 'pass', name, 'changelog', 'entry.md');
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
					const file = path.join(fixturesDir, 'fail', name, 'changelog', 'entry.md');
					const [result = never] = await eslint.lintFiles([file]);
					const matched = result.messages.filter((m) => m.message === expected);
					assert.ok(matched.length > 0, `Expected message "${expected}" to fire. All findings:\n${formatMessages(result)}`);
				});
			}
		});
	});
});
