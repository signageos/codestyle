/**
 * @typedef {import("@eslint/core").Language} Language
 * @typedef {import("@eslint/core").TextSourceCode} TextSourceCodeInterface
 * @typedef {import("@eslint/core").File} File
 * @typedef {import("@eslint/core").SourceLocation} SourceLocation
 * @typedef {import("@eslint/core").SourceRange} SourceRange
 * @typedef {import("@eslint/core").VisitTraversalStep} VisitTraversalStep
 */

/**
 * @typedef {Object} TextFileNode
 * @property {"TextFile"} type
 * @property {string} body
 * @property {SourceRange} range
 * @property {SourceLocation} loc
 */

/** @type {1} */
const STEP_KIND_VISIT = 1;

/** @type {Language} */
export const textLanguage = {
	fileType: /** @type {"text"} */ ('text'),
	lineStart: /** @type {1} */ (1),
	columnStart: /** @type {1} */ (1),
	nodeTypeKey: 'type',

	validateLanguageOptions() {
		// No language options to validate for plain text
	},

	/**
	 * @param {File} file
	 */
	parse(file) {
		if (typeof file.body !== 'string') {
			throw new Error('The sos/text language is only able to process plain-text files.');
		}

		const text = file.body;

		const lines = text.split('\n');
		const endLine = lines.length;
		const endColumn = (lines[lines.length - 1]?.length ?? 0) + 1;

		return {
			ok: /** @type {true} */ (true),
			ast: /** @type {TextFileNode} */ ({
				type: 'TextFile',
				body: text,
				range: /** @type {SourceRange} */ ([0, text.length]),
				loc: /** @type {SourceLocation} */ ({
					start: { line: 1, column: 1 },
					end: { line: endLine, column: endColumn },
				}),
			}),
		};
	},

	/**
	 * @param {File} file
	 * @param {import("@eslint/core").OkParseResult<TextFileNode>} parseResult
	 */
	createSourceCode(file, parseResult) {
		if (typeof file.body !== 'string') {
			throw new Error('The sos/text language is only able to process plain-text files.');
		}

		return new TextSourceCode({
			text: file.body,
			ast: parseResult.ast,
		});
	},
};

/**
 * @implements {TextSourceCodeInterface}
 */
class TextSourceCode {
	/** @type {string} */
	text;

	/** @type {TextFileNode} */
	ast;

	/**
	 * @param {{ text: string, ast: TextFileNode }} options
	 */
	constructor({ text, ast }) {
		this.text = text;
		this.ast = ast;
	}

	/**
	 * @param {TextFileNode} [node]
	 * @returns {string}
	 */
	getText(node) {
		if (!node) {
			return this.text;
		}
		return this.text.slice(node.range[0], node.range[1]);
	}

	/**
	 * @param {TextFileNode} node
	 * @returns {SourceLocation}
	 */
	getLoc(node) {
		return node.loc;
	}

	/**
	 * @param {TextFileNode} node
	 * @returns {SourceRange}
	 */
	getRange(node) {
		return node.range;
	}

	/**
	 * @returns {Iterable<VisitTraversalStep>}
	 */
	*traverse() {
		// Enter the root node (phase 1)
		yield { kind: STEP_KIND_VISIT, target: this.ast, phase: /** @type {1} */ (1), args: [this.ast] };
		// Exit the root node (phase 2)
		yield { kind: STEP_KIND_VISIT, target: this.ast, phase: /** @type {2} */ (2), args: [this.ast] };
	}
}
