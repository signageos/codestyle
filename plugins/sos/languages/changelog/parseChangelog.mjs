/**
 * @typedef {import("@eslint/core").SourceLocation} SourceLocation
 * @typedef {import("@eslint/core").SourceRange} SourceRange
 */

/**
 * @typedef ChangelogRoot
 * @property {"root"} type
 * @property {SourceRange} range
 * @property {SourceLocation} loc
 * @property {ChangelogPreamble} preamble
 * @property {ChangelogVersion[]} versions
 */

/**
 * @typedef ChangelogPreamble
 * @property {"preamble"} type
 * @property {SourceRange} range
 * @property {SourceLocation} loc
 * @property {string} text
 */

/**
 * @typedef ChangelogVersion
 * @property {"version"} type
 * @property {SourceRange} range
 * @property {SourceLocation} loc
 * @property {ChangelogTitle} title
 * @property {ChangelogSection[]} children
 */

/**
 * @typedef ChangelogTitle
 * @property {"title"} type
 * @property {SourceRange} range
 * @property {SourceLocation} loc
 * @property {string[]} value
 * @property {string} rawLine
 */

/**
 * @typedef ChangelogSection
 * @property {"section"} type
 * @property {SourceRange} range
 * @property {SourceLocation} loc
 * @property {ChangelogTitle} title
 * @property {ChangelogEntry[]} children
 */

/**
 * @typedef ChangelogEntry
 * @property {"entry"} type
 * @property {SourceRange} range
 * @property {SourceLocation} loc
 * @property {string} item
 */

const VERSION_REGEX = /^[ \t]*##([^#][ \t]*.+)$/;
const SECTION_REGEX = /^[ \t]*###([^#][ \t]*.+)$/;

/**
 * Parse a CHANGELOG.md file, into a changelog AST. CHANGELOG.md files are not
 * a valid markdown files, because they are not using trailing newlines after
 * a title. This AST does not represent the file as a generic markdown format,
 * but as a preamble + (version -> section -> entry) structure, which is more
 * useful for this file.
 *
 * Some AST nodes do not have a valid location/range, because it wasn't needed
 * for linting, but could be implemented in the future.
 *
 * @param {string} text
 * @returns {ChangelogRoot}
 */
export const parseChangelog = (text) => {
	const firstVersionIndex = text.indexOf('##');

	const preambleText = text.slice(0, firstVersionIndex);
	const preambleLineOffset = preambleText.split('\n').length;

	/** @type {ChangelogPreamble} */
	const preamble = {
		type: 'preamble',
		loc: loc(0, 0, preambleLineOffset - 1, 0),
		range: [0, firstVersionIndex],
		text: preambleText,
	};

	/** @type {ChangelogVersion[]} */
	const versions = [];

	let lnOffset = 0;

	for (const [i, ln] of text.split('\n').entries()) {
		const lnStart = lnOffset;
		lnOffset += ln.length + 1;

		if (i < preambleLineOffset - 1) {
			continue;
		}

		const lnLoc = loc(i + 1, 0, i + 1, ln.length + 1);

		// Parse version (e.g. "## [2.2.1] - 2026-05-23")
		if (VERSION_REGEX.test(ln)) {
			versions.push({
				type: 'version',
				range: [0, 0],
				loc: loc(0, 0, 0, 0),
				title: {
					type: 'title',
					loc: lnLoc,
					range: [lnStart, lnStart + ln.length],
					value: [VERSION_REGEX.exec(ln)?.[1] ?? ''],
					rawLine: ln,
				},
				children: [],
			});

			continue;
		}

		// Parse section (e.g. "### Added")
		if (SECTION_REGEX.test(ln)) {
			const title = SECTION_REGEX.exec(ln)?.[1] ?? '';
			if (!versions.length) {
				throw new ParseError(`Section "${title}" is not part of any version.`, { line: i, column: 0 }, ln.length);
			}

			versions.at(-1)?.children.push({
				type: 'section',
				range: [0, 0],
				loc: loc(0, 0, 0, 0),
				title: {
					type: 'title',
					loc: lnLoc,
					range: [lnStart, lnStart + ln.length],
					value: [title],
					rawLine: ln,
				},
				children: [],
			});

			continue;
		}

		// Parse changelog entry (e.g. "- Added `sos/changelog` language")
		{
			if (!versions.length) {
				// This should never happen because the line will be either a part of preamble or some version exists
				throw new ParseError(`Line "${ln}" is not part of any version.`, { line: i, column: 0 }, ln.length);
			}
			if (!versions.at(-1)?.children.length) {
				versions.at(-1)?.title.value.push(ln);
			}

			versions
				.at(-1)
				?.children.at(-1)
				?.children.push({
					type: 'entry',
					range: [lnStart, lnStart + ln.length],
					loc: lnLoc,
					item: ln,
				});
		}
	}

	// TODO: do additional AST pass and fill location/range of parent nodes from its children

	/** @type {ChangelogRoot} */
	const root = {
		type: 'root',
		range: [0, text.length],
		loc: loc(0, 0, 0, 0),
		preamble,
		versions,
	};

	return root;
};

export class ParseError extends Error {
	/**
	 * @param {string} msg
	 * @param {import("@eslint/core").Position} pos
	 * @param {number} length
	 */
	constructor(msg, pos, length) {
		super(msg);
		this.pos = pos;
		this.length = length;
	}
}

/**
 * @param {number} startLine
 * @param {number} startCol
 * @param {number} endLine
 * @param {number} endCol
 * @returns
 */
const loc = (startLine, startCol, endLine, endCol) => ({
	start: { line: startLine, column: startCol },
	end: { line: endLine, column: endCol },
});
