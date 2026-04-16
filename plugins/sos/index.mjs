import { changelogLanguage } from './languages/changelog/changelog.mjs';
import { textLanguage } from './languages/text.mjs';
import { changelogRule } from './rules/changelog.mjs';

const plugin = {
	meta: {
		name: '@signageos/eslint-plugin-sos',
		version: '1.0.0',
	},
	languages: {
		text: textLanguage,
		changelog: changelogLanguage,
	},
	rules: {
		changelog: changelogRule,
	},
	configs: {},
};

export default plugin;
