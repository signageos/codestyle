import { parseChangelog, parseErrorToDiagnostic, ParseError } from '@signageos/changelog';

/**
 * @typedef {import("@eslint/core").Language} Language
 * @typedef {import("@eslint/core").TextSourceCode} TextSourceCodeInterface
 * @typedef {import("@eslint/core").File} File
 * @typedef {import("@eslint/core").SourceLocation} SourceLocation
 * @typedef {import("@eslint/core").SourceRange} SourceRange
 * @typedef {import("@eslint/core").VisitTraversalStep} VisitTraversalStep
 *
 * @typedef {import("@signageos/changelog").ChangelogRoot} ChangelogRoot
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
			throw new Error('The sos/changelog language is only able to process plain-text files.');
		}

		try {
			return {
				ok: true,
				ast: parseChangelog(file.body),
			};
		} catch (e) {
			if (e instanceof ParseError) {
				const diagnostic = parseErrorToDiagnostic(e, file.body);
				return {
					ok: false,
					errors: [
						{
							message: diagnostic.message,
							line: diagnostic.loc.start.line,
							column: diagnostic.loc.start.column,
							endLine: diagnostic.loc.end.line,
							endColumn: diagnostic.loc.end.column,
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
			throw new Error('The sos/changelog language is only able to process plain-text files.');
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
		// The rule validates the whole tree in one pass, so only the root needs visiting.
		yield { kind: 1, target: this.ast, phase: 1, args: [this.ast] };
		yield { kind: 1, target: this.ast, phase: 2, args: [this.ast] };
	}
}
