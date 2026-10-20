import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prettier from 'prettier';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

describe('prettier markdown tables', function () {
	it('should pad tables outside docs/', async function () {
		assert.equal(
			await format('README.md', '| a | b |\n|-|-|\n| long cell | x |\n'),
			'| a         | b   |\n| --------- | --- |\n| long cell | x   |\n',
		);
	});

	it('should print tables in docs/ without padding', async function () {
		assert.equal(
			await format('docs/design/record.md', '| a | b |\n|-|-|\n| long cell | x |\n'),
			'| a | b |\n| --- | --- |\n| long cell | x |\n',
		);
	});

	it('should keep column alignment and escaped pipes', async function () {
		assert.equal(
			await format('docs/record.md', '| a | b | c | d |\n|:-|-:|:-:|-|\n| `x \\| y` | **z** | [l](http://x) | |\n'),
			'| a | b | c | d |\n| :-- | --: | :-: | --- |\n| `x \\| y` | **z** | [l](http://x) |  |\n',
		);
	});

	it('should indent a table nested in a list', async function () {
		assert.equal(
			await format('docs/record.md', '- item\n\n  | a | b |\n  |-|-|\n  | 1 | 2 |\n'),
			'- item\n\n  | a | b |\n  | --- | --- |\n  | 1 | 2 |\n',
		);
	});

	it('should be stable on its own output', async function () {
		const once = await format('docs/record.md', '| a | b |\n|-|-|\n| long cell | x |\n\nSome text.\n');
		assert.equal(await format('docs/record.md', once), once);
	});
});

/**
 * @param {string} file
 * @param {string} source
 */
async function format(file, source) {
	const filepath = path.join(repoRoot, file);
	const config = await prettier.resolveConfig(filepath);
	return prettier.format(source, { ...config, filepath });
}
