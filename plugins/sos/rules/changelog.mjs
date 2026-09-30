import { validateChangelog } from '@signageos/changelog';
import { DEFAULT_ENTRY_PREFIXES, checkEntryPrefixes } from './changelogEntryPrefixes.mjs';

/**
 * @typedef {import("@signageos/changelog").ChangelogRoot} ChangelogRoot
 */

/** @type {import("@eslint/core").RuleDefinition} */
export const changelogRule = {
	meta: {
		type: 'suggestion',
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					allowedSections: { type: 'array' },
					entryPrefixes: { type: 'array', items: { type: 'string' } },
				},
				additionalProperties: false,
			},
		],
		language: 'sos/changelog',
	},
	create: function (context) {
		// @ts-expect-error context.options[0] is not typed properly
		const allowedSections = context.options[0]?.allowedSections;
		// @ts-expect-error context.options[0] is not typed properly
		const entryPrefixes = context.options[0]?.entryPrefixes ?? DEFAULT_ENTRY_PREFIXES;

		return {
			/** @param {ChangelogRoot} node */
			root: (node) => {
				const diagnostics = validateChangelog(node, allowedSections ? { allowedSections } : undefined);

				for (const diagnostic of diagnostics) {
					const fix = diagnostic.fix;
					context.report({
						node: diagnostic.node,
						loc: diagnostic.loc,
						message: diagnostic.message,
						fix: fix ? (fixer) => fixer.replaceTextRange(fix.range, fix.text) : undefined,
					});
				}

				for (const diagnostic of checkEntryPrefixes(node, entryPrefixes)) {
					context.report(diagnostic);
				}
			},
		};
	},
};
