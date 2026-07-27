import semver from 'semver';

/**
 * @typedef {import("../languages/changelog/parseChangelog.mjs").ChangelogEntry} ChangelogEntry
 * @typedef {import("../languages/changelog/parseChangelog.mjs").ChangelogSection} ChangelogSection
 * @typedef {import("../languages/changelog/parseChangelog.mjs").ChangelogPreamble} ChangelogPreamble
 * @typedef {import("../languages/changelog/parseChangelog.mjs").ChangelogTitle} ChangelogTitle
 * @typedef {import("../languages/changelog/parseChangelog.mjs").ChangelogVersion} ChangelogVersion
 */

const SECTION_REGEX = /^#*[\t ](.+)[\t ]*$/;
const ENTRY_REGEX = /^\t*- .+$/;

const VERSION_NAME_REGEX = /\[(.+)] - (.+)/;

const CORRECT_PREAMBLE = `# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

`;

const ALLOWED_SECTIONS = ['Added', 'Fixed', 'Changed', 'Removed', 'Deprecated', 'Security'];

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
		const allowedSections = context.options[0]?.allowedSections ?? ALLOWED_SECTIONS;

		let isUnreleased = false;

		return {
			/**
			 * @param {ChangelogEntry} node
			 * @param {ChangelogSection} section
			 */
			entry: (node, section) => {
				const indexOf = section.children.indexOf(node);

				validateWhitespace(node, node.item.trimStart(), context);

				if (indexOf === section.children.length - 1) {
					if (node.item !== '') {
						context.report({
							node,
							message: `Missing trailing empty line.`,
							fix: (fixer) => {
								return fixer.replaceText(node, node.item + '\n');
							},
						});
					}
					return;
				}

				if (ENTRY_REGEX.test(node.item)) {
					return;
				}

				context.report({
					node,
					message: 'Changelog entries have to start with "- " with optional tab indentation',
				});
			},

			/** @param {ChangelogPreamble} node */
			preamble: (node) => {
				if (node.text !== CORRECT_PREAMBLE) {
					context.report({
						node,
						message: 'Incorrect preamble',
						fix: (fixer) => {
							return fixer.replaceText(node, CORRECT_PREAMBLE);
						},
					});
				}
			},

			/**
			 * @param {ChangelogTitle} node
			 * @param {ChangelogSection | ChangelogVersion} parent
			 */
			title: (node, parent) => {
				validateWhitespace(node, node.value.join('\n'), context);

				if (node.value.length > 1) {
					// Allow 1 trailing newline for versions with no sections/entries
					if (parent.children.length === 0 && node.value.length === 2 && node.value[1] === '') {
						return;
					}

					context.report({
						node,
						message: 'Title needs to have 1 line and no trailing newline.',
					});
					return;
				}

				if (/^\s/.test(node.rawLine) || /\s$/.test(node.rawLine)) {
					context.report({
						node,
						message: "Sections can't be indented",
					});
				}
			},

			/** @param {ChangelogSection} node */
			section: (node) => {
				const val = node.title.value.join('');
				validateWhitespace(node, val, context);

				const [, title] = SECTION_REGEX.exec(val) ?? [];

				if (!title || !allowedSections.includes(title)) {
					context.report({
						node: node.title,
						message: `Invalid title name "${title}"`,
					});
				}
			},

			/** @param {ChangelogVersion} node */
			version: (node) => {
				const val = node.title.value[0] ?? '';
				isUnreleased = val.trim() === '[Unreleased]';

				validateWhitespace(node, val, context);

				const [, title] = SECTION_REGEX.exec(val) ?? [];

				if (isUnreleased) {
					return;
				}

				if (title === undefined) {
					context.report({
						node: node.title,
						message: 'Invalid version',
					});
					return;
				}

				const [, version, releasedAt] = VERSION_NAME_REGEX.exec(title) ?? [];

				if (!version || !semver.valid(version)) {
					context.report({
						node: node.title,
						message: 'Invalid version format',
					});
					return;
				}

				if (releasedAt !== 'unknown') {
					if (!releasedAt || isNaN(new Date(releasedAt).valueOf())) {
						context.report({
							node: node.title,
							message: 'Invalid date',
						});
						return;
					}
				}
			},
		};
	},
};

/**
 *
 * @param {unknown} node
 * @param {string} text
 * @param {import("@eslint/core").RuleContext} context
 * @returns
 */
const validateWhitespace = (node, text, context) => {
	if (/\s\s/.test(text)) {
		context.report({
			node,
			message: 'Irregular whitespace',
		});
	}
};
