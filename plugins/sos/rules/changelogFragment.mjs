import { validateSections } from '@signageos/changelog';

/**
 * @typedef {import("../languages/changelog/fragment.mjs").ChangelogFragmentRoot} ChangelogFragmentRoot
 */

/** @type {import("@eslint/core").RuleDefinition} */
export const changelogFragmentRule = {
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
		language: 'sos/changelog-fragment',
	},
	create: function (context) {
		// @ts-expect-error context.options[0] is not typed properly
		const allowedSections = context.options[0]?.allowedSections;

		return {
			/** @param {ChangelogFragmentRoot} node */
			fragment: (node) => {
				const diagnostics = validateSections(node.sections, allowedSections ? { allowedSections } : undefined);

				for (const diagnostic of diagnostics) {
					const fix = diagnostic.fix;
					context.report({
						node: diagnostic.node,
						loc: diagnostic.loc,
						message: diagnostic.message,
						fix: fix ? (fixer) => fixer.replaceTextRange(fix.range, fix.text) : undefined,
					});
				}
			},
		};
	},
};
