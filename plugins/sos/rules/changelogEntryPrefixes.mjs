import { walkChangelog } from '@signageos/changelog';

/**
 * @typedef {import("@signageos/changelog").ChangelogNode} ChangelogNode
 * @typedef {import("@signageos/changelog").ChangelogSection} ChangelogSection
 */

export const DEFAULT_ENTRY_PREFIXES = ['(public)', '(internal)'];

/**
 * A top-level entry has to start with one of the configured prefixes, e.g. `(public)`
 * or `(internal)`. Nested entries (indented with tabs) are details of their parent
 * entry, so they carry no prefix of their own.
 * @param {ChangelogNode} root
 * @param {string[]} entryPrefixes
 */
export function* checkEntryPrefixes(root, entryPrefixes) {
	if (entryPrefixes.length === 0) {
		return;
	}
	for (const { node, parent } of walkChangelog(root)) {
		if (node.type !== 'entry' || parent?.type !== 'section') {
			continue;
		}
		const match = /^- (.*)$/.exec(node.item);
		if (!match) {
			continue;
		}
		const text = match[1] ?? '';
		const hasPrefix = entryPrefixes.some((prefix) => text === prefix || text.startsWith(`${prefix} `));
		if (!hasPrefix) {
			yield {
				node,
				loc: node.loc,
				message: `Changelog entries have to start with one of the allowed prefixes: ${entryPrefixes.join(', ')}`,
			};
		}
	}
}

/**
 * `checkEntryPrefixes` run over every section of a fragment, since `parseSections`
 * gives us a list of detached sections rather than one root to walk.
 * @param {ChangelogSection[]} sections
 * @param {string[]} entryPrefixes
 */
export function* checkEntryPrefixesInSections(sections, entryPrefixes) {
	for (const section of sections) {
		yield* checkEntryPrefixes(section, entryPrefixes);
	}
}
