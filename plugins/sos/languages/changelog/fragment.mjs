import { parseSections, parseErrorToDiagnostic, ParseError } from '@signageos/changelog';

/**
 * @typedef {import("@eslint/core").Language} Language
 * @typedef {import("@eslint/core").TextSourceCode} TextSourceCodeInterface
 * @typedef {import("@eslint/core").File} File
 * @typedef {import("@eslint/core").SourceLocation} SourceLocation
 * @typedef {import("@eslint/core").SourceRange} SourceRange
 * @typedef {import("@eslint/core").VisitTraversalStep} VisitTraversalStep
 *
 * @typedef {import("@signageos/changelog").ChangelogSection} ChangelogSection
 *
 * @typedef {Object} ChangelogFragmentRoot
 * @property {"fragment"} type
 * @property {ChangelogSection[]} sections
 * @property {SourceRange} range
 * @property {SourceLocation} loc
 */

/** @type {Language} */
export const changelogFragmentLanguage = {
	fileType: /** @type {"text"} */ ('text'),
	lineStart: /** @type {1} */ (1),
	columnStart: /** @type {1} */ (1),
	nodeTypeKey: 'type',

	validateLanguageOptions() {
		// No language options to validate for changelog fragment files
	},

	/**
	 * @param {File} file
	 * @returns {import("@eslint/core").ParseResult<ChangelogFragmentRoot>}
	 */
	parse(file) {
		if (typeof file.body !== 'string') {
			throw new Error('The sos/changelog-fragment language is only able to process plain-text files.');
		}

		try {
			return {
				ok: true,
				ast: toFragmentRoot(file.body, parseSections(file.body)),
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
	 * @param {import("@eslint/core").OkParseResult<ChangelogFragmentRoot>} parseResult
	 */
	createSourceCode(file, parseResult) {
		if (typeof file.body !== 'string') {
			throw new Error('The sos/changelog-fragment language is only able to process plain-text files.');
		}

		return new ChangelogFragmentSourceCode({
			text: file.body,
			ast: parseResult.ast,
		});
	},
};

/**
 * @implements {TextSourceCodeInterface}
 */
class ChangelogFragmentSourceCode {
	/** @type {string} */
	text;

	/** @type {ChangelogFragmentRoot} */
	ast;

	/**
	 * @param {{ text: string, ast: ChangelogFragmentRoot }} options
	 */
	constructor({ text, ast }) {
		this.text = text;
		this.ast = ast;
	}

	/**
	 * @param {ChangelogFragmentRoot} [node]
	 * @returns {string}
	 */
	getText(node) {
		if (!node) {
			return this.text;
		}
		return this.text.slice(node.range[0], node.range[1]);
	}

	/**
	 * @param {ChangelogFragmentRoot} node
	 * @returns {SourceLocation}
	 */
	getLoc(node) {
		return node.loc;
	}

	/**
	 * @param {ChangelogFragmentRoot} node
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

/**
 * `parseSections` returns a bare array, but an ESLint `Language` needs one root
 * node to traverse — wrapped the same way `sos/text` wraps a whole file.
 * @param {string} text
 * @param {ChangelogSection[]} sections
 * @returns {ChangelogFragmentRoot}
 */
function toFragmentRoot(text, sections) {
	const lines = text.split('\n');
	const endLine = lines.length;
	const endColumn = (lines[lines.length - 1]?.length ?? 0) + 1;

	return {
		type: 'fragment',
		sections,
		range: [0, text.length],
		loc: {
			start: { line: 1, column: 1 },
			end: { line: endLine, column: endColumn },
		},
	};
}
