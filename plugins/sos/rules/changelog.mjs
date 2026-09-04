import { validateChangelog } from '@signageos/changelog';

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
				},
				additionalProperties: false,
			},
		],
		language: 'sos/changelog',
	},
	create: function (context) {
		// @ts-expect-error context.options[0] is not typed properly
		const allowedSections = context.options[0]?.allowedSections;

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
			},
		};
	},
};
