import { parseChangelog, ParseError } from './parseChangelog.mjs';

/**
 * @typedef {import("@eslint/core").Language} Language
 * @typedef {import("@eslint/core").TextSourceCode} TextSourceCodeInterface
 * @typedef {import("@eslint/core").File} File
 * @typedef {import("@eslint/core").SourceLocation} SourceLocation
 * @typedef {import("@eslint/core").SourceRange} SourceRange
 * @typedef {import("@eslint/core").VisitTraversalStep} VisitTraversalStep
 *
 * @typedef {import("./parseChangelog.mjs").ChangelogRoot} ChangelogRoot
 */

/** @type {Language} */
export const changelogLanguage = {
	fileType: /** @type {"text"} */ ('text'),
	lineStart: /** @type {1} */ (1),
	columnStart: /** @type {1} */ (1),
	nodeTypeKey: 'type',

	validateLanguageOptions() {
		// No language options to validate for changelog file
	},

	/**
	 * @param {File} file
	 * @returns {import("@eslint/core").ParseResult<ChangelogRoot>}
	 */
	parse(file) {
		if (typeof file.body !== 'string') {
			throw new Error('The sos/text language is only able to process plain-text files.');
		}

		const text = file.body;

		try {
			return {
				ok: true,
				ast: parseChangelog(text),
			};
		} catch (e) {
			if (e instanceof ParseError) {
				return {
					ok: false,
					errors: [
						{
							message: e.message,
							line: e.pos.line + 1,
							column: e.pos.column + 1,
							endLine: e.pos.line,
							endColumn: e.length,
						},
					],
				};
			}
			throw e;
		}
	},

	/**
	 * @param {File} file
	 * @param {import("@eslint/core").OkParseResult<ChangelogRoot>} parseResult
	 */
	createSourceCode(file, parseResult) {
		if (typeof file.body !== 'string') {
			throw new Error('The sos/text language is only able to process plain-text files.');
		}

		return new ChangelogSourceCode({
			text: file.body,
			ast: parseResult.ast,
		});
	},
};

/**
 * @implements {TextSourceCodeInterface}
 */
class ChangelogSourceCode {
	/** @type {string} */
	text;

	/** @type {ChangelogRoot} */
	ast;

	/**
	 * @param {{ text: string, ast: ChangelogRoot }} options
	 */
	constructor({ text, ast }) {
		this.text = text;
		this.ast = ast;
	}

	/**
	 * @param {ChangelogRoot} [node]
	 * @returns {string}
	 */
	getText(node) {
		if (!node) {
			return this.text;
		}
		return this.text.slice(node.range[0], node.range[1]);
	}

	/**
	 * @param {ChangelogRoot} node
	 * @returns {SourceLocation}
	 */
	getLoc(node) {
		return node.loc;
	}

	/**
	 * @param {ChangelogRoot} node
	 * @returns {SourceRange}
	 */
	getRange(node) {
		return node.range;
	}

	/**
	 * @returns {Iterable<VisitTraversalStep>}
	 */
	*traverse() {
		yield { kind: 1, target: this.ast.preamble, phase: 1, args: [this.ast.preamble, this.ast] };
		yield { kind: 1, target: this.ast.preamble, phase: 2, args: [this.ast.preamble, this.ast] };

		for (const version of this.ast.versions) {
			yield { kind: 1, target: version, phase: 1, args: [version, this.ast] };

			yield { kind: 1, target: version.title, phase: 1, args: [version.title, version] };
			yield { kind: 1, target: version.title, phase: 2, args: [version.title, version] };

			for (const section of version.children) {
				yield { kind: 1, target: section, phase: 1, args: [section, version] };

				yield { kind: 1, target: section.title, phase: 1, args: [section.title, section] };
				yield { kind: 1, target: section.title, phase: 2, args: [section.title, section] };

				for (const entry of section.children) {
					yield { kind: 1, target: entry, phase: 1, args: [entry, section] };
					yield { kind: 1, target: entry, phase: 2, args: [entry, section] };
				}

				yield { kind: 1, target: section, phase: 2, args: [section, version] };
			}

			yield { kind: 1, target: version, phase: 2, args: [version, this.ast] };
		}
	}
}
